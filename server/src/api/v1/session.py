from db.database import db
from db.models.oauth import OAuth
from db.models.user import User, UserRecord
from db.models.game import StatsTable
import json
import os
from typing import Dict, List
from flask import Blueprint, redirect, url_for, request
from requests.models import Response as HandlerResponse
from werkzeug.wrappers import Response
from werkzeug.local import LocalProxy
from flask_login import current_user, login_user, login_required, logout_user
from flask_dance.contrib.github import make_github_blueprint, github, OAuth2ConsumerBlueprint
from flask_dance.contrib.google import make_google_blueprint, google
from flask_dance.consumer.storage.sqla import SQLAlchemyStorage
from flask_dance.consumer import oauth_authorized
from sqlalchemy.orm.exc import NoResultFound
from oauthlib.oauth2.rfc6749.errors import InvalidGrantError, TokenExpiredError, OAuth2Error
from .shared.api_types import Json

import sys
sys.path.append("...")  # Necessary to import beyond top-level package

# temporarily allow http and relax scope
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "true"
os.environ["OAUTHLIB_RELAX_TOKEN_SCOPE"] = "true"


SESSION_API_PREFIX: str = "/v1/session"

dir_path: str = os.path.dirname(os.path.realpath(__file__))
with open(dir_path + "/../../../config/sso_config.json", "r") as sso_config_json:
    SSO_CONFIG: Json = json.load(sso_config_json)

# TODO: Switch to Docker Secret, Github Secret, or GCP Secret. Also preset it in environment variables
SECRET_KEY: str = SSO_CONFIG["secret_key"]

# SSO Config variables
GITHUB_SSO_CONFIG: Json = SSO_CONFIG["github"]
GOOGLE_SSO_CONFIG = SSO_CONFIG["google"]

# Constants for SSO Handlers
GITHUB_TOKEN_API: str = "github.login"
GOOGLE_TOKEN_API: str = "google.login"
SSO_HANDLER_MAP: Dict[str, LocalProxy] = {
    "github": github,
    "google": google
}

QUESTION_TYPES: List[str] = ["Normal", "ACT", "GRE", "SAT"]

github_blueprint: OAuth2ConsumerBlueprint = make_github_blueprint(
    storage=SQLAlchemyStorage(
        OAuth, db.session, user=current_user, user_required=False),
    client_id=GITHUB_SSO_CONFIG["client_id"],
    client_secret=GITHUB_SSO_CONFIG["client_secret"],
    scope=GITHUB_SSO_CONFIG["scope"],
    redirect_url=SESSION_API_PREFIX + "/github"
)

google_blueprint: OAuth2ConsumerBlueprint = make_google_blueprint(
    storage=SQLAlchemyStorage(
        OAuth, db.session, user=current_user, user_required=False),
    client_id=GOOGLE_SSO_CONFIG["client_id"],
    client_secret=GOOGLE_SSO_CONFIG["client_secret"],
    scope=GOOGLE_SSO_CONFIG["scope"],
    redirect_url=SESSION_API_PREFIX + "/google"
)

session_api: Blueprint = Blueprint(
    'session_api', __name__, url_prefix=SESSION_API_PREFIX)


def make_api_call(session_handler: LocalProxy, token_api: str, api_path: str):
    # TODO: Find cleaner way to handle expired tokens
    try:
        resp: HandlerResponse = session_handler.get(api_path)
        print(resp)
        # assert resp.ok
        # create_user(resp.text)
        return resp.json()
    except (InvalidGrantError, TokenExpiredError, OAuth2Error):  # token is expired
        return redirect(url_for(token_api))


def parse_github_email(email_json) -> str:
    primary_email: str = ""
    for email in email_json:
        if email['primary']:
            primary_email = email['email']
            break
    return primary_email


def get_github_user_info() -> UserRecord:
    emails: List[Json] = make_api_call(
        github, GITHUB_TOKEN_API, "/user/emails")
    primary_email: str = parse_github_email(emails)

    user: Json = make_api_call(github, GITHUB_TOKEN_API, "/user")
    return {"name": user["name"], "primary_email": primary_email}


def get_google_user_info() -> UserRecord:
    user: Json = make_api_call(google, GOOGLE_TOKEN_API, "/oauth2/v2/userinfo")
    return {"name": user["name"], "primary_email": user["email"]}


def get_user_info(blueprint: OAuth2ConsumerBlueprint) -> UserRecord:
    if blueprint.name == "github":
        return get_github_user_info()
    elif blueprint.name == "google":
        return get_google_user_info()
    return None


@ session_api.route("/profile")
@ login_required
def get_profile_data() -> UserRecord:
    return current_user.as_dict()


@ session_api.route("/updateProfile", methods=["POST"])
@ login_required
def update_profile():
    request_json: Json = request.get_json()
    user: User = User.query.filter_by(id=current_user.id).one()
    if request_json["name"]:
        user.name = request_json["name"]
    if request_json["color"]:
        user.color = request_json["color"]
    db.session.commit()
    return current_user.as_dict()


@ session_api.route("/github")
def github_session() -> Response:
    if not github.authorized:
        return redirect(url_for(GITHUB_TOKEN_API))
    return redirect("http://localhost:7070/#/profile")


@ session_api.route("/google")
def google_session() -> Response:
    if not google.authorized:
        return redirect(url_for(GOOGLE_TOKEN_API))
    return redirect("http://localhost:7070/#/profile")


@ session_api.route("/logout")
def logout() -> Response:
    logout_user()
    return redirect("http://localhost:7070")


@ oauth_authorized.connect_via(github_blueprint)
@ oauth_authorized.connect_via(google_blueprint)
def blueprint_logged_in(blueprint, token) -> bool:
    # TODO: make this method reusable for every SSO
    if not token:
        return False

    user_info: UserRecord = get_user_info(blueprint)
    user_email: str = user_info["primary_email"]

    # Find this OAuth token in the database, or create it
    query = OAuth.query.filter_by(
        provider=blueprint.name,
        provider_user_email=user_email,
    )
    try:
        oauth = query.one()
    except NoResultFound:
        oauth = OAuth(
            provider=blueprint.name,
            provider_user_email=user_email,
            token=token,
        )

    if oauth.user:
        # If this OAuth token already has an associated local account,
        # log in that local user account.
        login_user(oauth.user)

    else:
        # This OAuth token doesn't have an associated local account,
        # If there is an existing user with the same email we can join
        # their accounts. Otherwise, we need to create a new account. We
        # can log in that account as well, while we're at it.
        user_query = User.query.filter_by(
            primary_email=user_email
        )

        try:
            user = user_query.one()
        except NoResultFound:
            user = User(
                primary_email=user_info["primary_email"],
                name=user_info["name"],
            )
            db.session.add(user)
            db.session.commit()
            for question_type in QUESTION_TYPES:
                stat_table = StatsTable(
                    player_id=user.id, question_type=question_type)
                db.session.add(stat_table)

        oauth.user = user
        db.session.add(oauth)
        db.session.commit()

        # Log in the new local user account
        login_user(user)

    return False

    # create a new local user account for this user. We can log
    # in that account as well, while we're at it.
