from ..database import db


class Question(db.Model):
    __tablename__ = "question"
    # not ideal, but avoid df problems
    question = db.Column(db.String(130), primary_key=True)
    answer = db.Column(db.String(40))
    question_type = db.Column(db.String(40))
