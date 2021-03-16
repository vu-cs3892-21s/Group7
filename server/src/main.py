# from flask_marshmallow import Marshmallow
import os
from api.v1.session import (github_blueprint, session_api,
                            SESSION_API_PREFIX, SECRET_KEY)
from flask import Flask
from flask_login import LoginManager
from db.database import db
from db.models.user import User
from db.models.oauth import OAuth

app = Flask(__name__)
app.secret_key = SECRET_KEY
app.register_blueprint(github_blueprint, url_prefix="/login")
# app.register_blueprint(google_blueprint, url_prefix="/login")
app.register_blueprint(session_api, url_prefix=SESSION_API_PREFIX)


class Config(object):
    # TODO: Move this object
    SECRET_KEY: str = os.environ.get('SECRET_KEY') or 'super-secret-key'
    SQLALCHEMY_DATABASE_URI: str = os.environ.get(
        'DATABASE_URI') or 'postgres:5432'
    SQLALCHEMY_TRACK_MODIFICATIONS: bool = False

    # SQLALCHEMY_ECHO: bool = os.environ.get('DATABASE_LOG') or True
    # DEBUG: bool = True
    # CSRF_ENABLED: bool = True


app.config.from_object(Config)

db.init_app(app)
login_manager = LoginManager(app)


@login_manager.user_loader
def load_user(email):
    return User.query.get(email)


with app.app_context():
    db.drop_all()
    db.create_all()
