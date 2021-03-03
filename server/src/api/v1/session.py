import json
import os
from flask import Blueprint, redirect, url_for
from flask_dance.contrib.github import make_github_blueprint, github
from flask_dance.contrib.google import make_google_blueprint, google
from oauthlib.oauth2.rfc6749.errors import InvalidGrantError, TokenExpiredError, OAuth2Error
from api.v1.user import create_user

# temporarily allow http and relax scope
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "true"
os.environ["OAUTHLIB_RELAX_TOKEN_SCOPE"] = "true"


SESSION_API_PREFIX = "/v1/session"

dir_path = os.path.dirname(os.path.realpath(__file__))
with open(dir_path + "/../../../config/sso_config.json", "r") as sso_config_json:
    SSO_CONFIG = json.load(sso_config_json)

# TODO: Switch to Docker Secret, Github Secret, or GCP Secret
SECRET_KEY = SSO_CONFIG["secret_key"]
GITHUB_SSO_CONFIG = SSO_CONFIG["github"]  # Github Specific SSO Config
GOOGLE_SSO_CONFIG = SSO_CONFIG["google"]

github_blueprint = make_github_blueprint(
    client_id=GITHUB_SSO_CONFIG["client_id"],
    client_secret=GITHUB_SSO_CONFIG["client_secret"],
    scope=GITHUB_SSO_CONFIG["scope"],
    redirect_url=SESSION_API_PREFIX + "/github"
)

google_blueprint = make_google_blueprint(
    client_id=GOOGLE_SSO_CONFIG["client_id"],
    client_secret=GOOGLE_SSO_CONFIG["client_secret"],
    scope=GOOGLE_SSO_CONFIG["scope"],
    redirect_url=SESSION_API_PREFIX + "/google"
)

session_api = Blueprint(
    'session_api', __name__, url_prefix=SESSION_API_PREFIX)


def create_session(session_handler, token_api, get_api):
    if not session_handler.authorized:
        return redirect(url_for(token_api))

    # TODO: Find cleaner way to handle expired tokens
    try:
        resp = session_handler.get(get_api)
        assert resp.ok
        create_user(resp.text)
        return 'User created'
    except (InvalidGrantError, TokenExpiredError, OAuth2Error):  # token is expired
        return redirect(url_for(token_api))


@session_api.route("/github")
def github_sesssion():
    return create_session(github, "github.login", "/user")


@session_api.route("/google")
def google_sesssion():
    return create_session(google, "google.login", "/oauth2/v1/userinfo")
