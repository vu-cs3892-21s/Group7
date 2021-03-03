from models import User, db


def create_user(resp: str):
    user = User(name='Tim', email='tim@test.com')
    db.session.add(user)
    db.session.commit()
