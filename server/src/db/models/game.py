from typing import Dict
from .user import User
from ..database import db
from datetime import datetime


class Game(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(40))
    operations = db.Column(db.String(40))
    mode = db.Column(db.String(40))
    question_type = db.Column(db.String(40))
    num_questions = db.Column(db.Integer)
    duration = db.Column(db.Integer)
    room_code = db.Column(db.String(8))
    max_score = db.Column(db.Integer)
    create_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)


class GamePlayer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey(Game.id), nullable=False)
    player_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    score = db.Column(db.Integer, default=0)
    total_duration = db.Column(db.Float(2), default=0)

class GameQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey(Game.id), nullable=False)
    question = db.Column(db.String(120), index=True)
    answer = db.Column(db.String(40), index=True)
    quest_num = db.Column(db.Integer)

    def as_dict(self) -> Dict[str, any]:
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class StatsTable(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    mode = db.Column(db.String(40))
    num_questions = db.Column(db.Integer, default=0)
    num_correct = db.Column(db.Integer, default=0)
    num_games = db.Column(db.Integer, default=0)
    num_wins = db.Column(db.Integer, default=0)
    total_duration = db.Column(db.Float(2), default=0)
