# from flask_marshmallow import Marshmallow
import os
from api.v1.session import (github_blueprint, google_blueprint,
                            session_api, SESSION_API_PREFIX, SECRET_KEY)
from api.v1.game import (socketio, game_api, GAME_API_PREFIX)
from flask import Flask
from flask_login import LoginManager
from db.database import db
from db.models.user import User
from db.models.game import Game, GamePlayer, GameQuestion
from db.models.oauth import OAuth

app = Flask(__name__)
app.secret_key = SECRET_KEY
app.register_blueprint(github_blueprint, url_prefix="/login")
app.register_blueprint(google_blueprint, url_prefix="/login")
app.register_blueprint(session_api, url_prefix=SESSION_API_PREFIX)

app.register_blueprint(game_api, url_prefix=GAME_API_PREFIX)


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
socketio.init_app(app)


@login_manager.user_loader
def load_user(email):
    return User.query.get(email)


def drop_everything():
    """(On a live db) drops all foreign key constraints before dropping all tables.
    Workaround for SQLAlchemy not doing DROP ## CASCADE for drop_all()
    (https://github.com/pallets/flask-sqlalchemy/issues/722)
    """
    from sqlalchemy.engine.reflection import Inspector
    from sqlalchemy.schema import DropConstraint, DropTable, MetaData, Table

    con = db.engine.connect()
    trans = con.begin()
    inspector = Inspector.from_engine(db.engine)

    # We need to re-create a minimal metadata with only the required things to
    # successfully emit drop constraints and tables commands for postgres (based
    # on the actual schema of the running instance)
    meta = MetaData()
    tables = []
    all_fkeys = []

    for table_name in inspector.get_table_names():
        fkeys = []

        for fkey in inspector.get_foreign_keys(table_name):
            if not fkey["name"]:
                continue

            fkeys.append(db.ForeignKeyConstraint((), (), name=fkey["name"]))

        tables.append(Table(table_name, meta, *fkeys))
        all_fkeys.extend(fkeys)

    for fkey in all_fkeys:
        con.execute(DropConstraint(fkey))

    for table in tables:
        con.execute(DropTable(table))

    trans.commit()


def create_test_data() -> None:
    question_prompt: str = '2+2'
    question_ans: str = '4'
    # manually declaring ids here for simplicity, normally will autoincrement
    test_user: User = User(
        id=0, primary_email='tester@test.com', name='Testy Testo')
    test_question: GameQuestion = GameQuestion(
        id=1, game_id=100, question=question_prompt, answer=question_ans,
        quest_num=0)
    test_player: GamePlayer = GamePlayer(game_id=100, player_id=0, score=0)
    test_game: Game = Game(id=100, status='complete', operations='+',
                           mode='solo', question_type='abc',
                           num_questions=1, duration=1000, room_code='abcd')

    for m in (test_user, test_game):
        db.session.add(m)
    db.session.commit()
    for m in (test_question, test_player):
        db.session.add(m)
    db.session.add(test_player)
    db.session.commit()

    return None


with app.app_context():
    drop_everything()
    db.create_all()
    # create_test_data()


socketio.run(app, host="0.0.0.0", port=5000, debug=True)
