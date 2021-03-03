import os


class Config(object):
    SECRET_KEY: str = os.environ.get('SECRET_KEY') or 'super-secret-key'
    SQLALCHEMY_DATABASE_URI: str = os.environ.get(
        'DATABASE_URI') or 'postgres:5432'
    SQLALCHEMY_ECHO: bool = os.environ.get('DATABASE_LOG') or True
    DEBUG: bool = True
    CSRF_ENABLED: bool = True
