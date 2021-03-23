import random
from typing import List, Tuple
from flask import Blueprint, request
from flask_login import login_required, current_user
from .shared.api_types import Json

import sys
sys.path.append("...")  # Necessary to import beyond top-level package
from db.models.game import Game, GamePlayer, GameQuestion
from db.database import db

GAME_API_PREFIX = "/v1/game"


game_api: Blueprint = Blueprint(
    'game_api', __name__, url_prefix=GAME_API_PREFIX)


def create_questions(operations: List[str], numberOfQuestions: int) -> List[Tuple[str, str]]:
    questions: List[Tuple[str, str]] = []
    for _ in range(numberOfQuestions):
        operation: str = random.choice(operations)
        operand_range = 12
        if operation == "+" or operation == "-":
            operand_range = 100

        operand1: int = random.randrange(operand_range)
        operand2: int = random.randrange(operand_range)
        if operation == "/":
            operand1 = operand2 * operand1
        question: str = f"{operand1} {operation} {operand2}"
        answer: int = int(eval(question))
        questions.append((question, str(answer)))
    return questions


@game_api.route("/<game_id>", methods=["GET"])
@login_required
def get_game_info(game_id=None):
    game_query = Game.query.filter_by(id=game_id)
    game = game_query.one()
    return {
        "id": game.id,
        "status": game.status,
        "mode": game.mode,
        "maxTime": game.duration,
        "totalQuestions": game.num_questions
    }


@game_api.route("/<game_id>/questions", methods=["GET"])
@login_required
def get_questions(game_id=None):
    game_query = GameQuestion.query.filter_by(game_id=game_id)
    questions: List[Json] = []
    for question in game_query:
        questions.append(question.as_dict())
    return {"questions": questions}


@game_api.route("/create", methods=["POST"])
@login_required
def create_game():
    request_json: Json = request.get_json()
    game: Game = Game(status='Created', operations=','.join(
        request_json["operations"]), mode=request_json["mode"],
        question_type=request_json["questionType"],
        num_questions=request_json["numberOfQuestions"], duration=request_json["duration"])
    db.session.add(game)
    db.session.commit()

    game_player: GamePlayer = GamePlayer(
        game_id=game.id, player_id=current_user.id, score=0)

    questions: List[Tuple[str, str]] = create_questions(
        request_json["operations"], request_json["numberOfQuestions"])

    for quest_num in range(request_json["numberOfQuestions"]):
        question, answer = questions[quest_num]
        game_question: GameQuestion = GameQuestion(
            game_id=game.id, question=question, answer=answer, quest_num=1 + quest_num)
        db.session.add(game_question)

    db.session.add(game_player)
    db.session.commit()

    return {"id": game.id}
