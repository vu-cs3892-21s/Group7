from flask_sqlalchemy import SQLAlchemy
from main import db



class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), index=True, unique=True)
    name = db.Column(db.String(40), index=True, default='')

    def __repr__(self):
        return '<User %r>' % self.name
