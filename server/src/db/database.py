from typing import Dict
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def as_dict(instance) -> Dict[str, any]:
    return {c.name: getattr(instance, c.name) for c in instance.__table__.columns}
