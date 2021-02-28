import json
import os
import flask
from flask_dance.contrib.github import make_github_blueprint, github


SESSION_API_PREFIX = "/v1/session"

dir_path = os.path.dirname(os.path.realpath(__file__))
with open(dir_path + "/../../../config/sso_config.json", "r") as sso_config_json:
    SSO_CONFIG = json.load(sso_config_json)

# TODO: Switch to Docker Secret, Github Secret, or GCP Secret
SECRET_KEY = SSO_CONFIG["secret_key"]

GITHUB_SSO_CONFIG = SSO_CONFIG["github"]  # Github Specific SSO Config

github_blueprint = make_github_blueprint(
    client_id=GITHUB_SSO_CONFIG["client_id"],
    client_secret=GITHUB_SSO_CONFIG["client_secret"],
    scope=GITHUB_SSO_CONFIG["scope"],
    redirect_url=SESSION_API_PREFIX + "/github"
)


session_api = flask.Blueprint(
    'session_api', __name__, url_prefix=SESSION_API_PREFIX)


@session_api.route("/github")
def sesssion():
    if not github.authorized:
        return flask.redirect(flask.url_for("github.login"))
    resp = github.get("/user")
    assert resp.ok
    return resp.json()
