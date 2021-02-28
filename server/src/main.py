import os
from flask import Flask
from api.v1.session import github_blueprint, session_api, SESSION_API_PREFIX, SECRET_KEY

# temporarily allow http
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "true"

app = Flask(__name__)
app.secret_key = SECRET_KEY
app.register_blueprint(github_blueprint, url_prefix="/login")
app.register_blueprint(session_api, url_prefix=SESSION_API_PREFIX)
