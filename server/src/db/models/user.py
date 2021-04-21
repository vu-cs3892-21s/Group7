from typing import Dict
from flask_login import UserMixin
from ..database import db

UserRecord = Dict[str, str]


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    primary_email = db.Column(db.String(120), index=True, unique=True)
    name = db.Column(db.String(40), index=True, default='')
    color = db.Column(db.String(40), default="White")
    # may want to update with backref for stats, but this is fine for now

    def __repr__(self) -> str:
        return '<User %r>' % self.name

    def as_dict(self) -> UserRecord:
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
