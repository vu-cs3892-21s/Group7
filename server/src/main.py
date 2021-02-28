from flask import Flask
from api.v1.session import (github_blueprint, google_blueprint,
                            session_api, SESSION_API_PREFIX, SECRET_KEY)


app = Flask(__name__)
app.secret_key = SECRET_KEY
app.register_blueprint(github_blueprint, url_prefix="/login")
app.register_blueprint(google_blueprint, url_prefix="/login")
app.register_blueprint(session_api, url_prefix=SESSION_API_PREFIX)
