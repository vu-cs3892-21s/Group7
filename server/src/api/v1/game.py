import random
from typing import List, Tuple
from flask_socketio import SocketIO, emit, join_room, close_room, rooms
from flask import Blueprint, request
from flask_login import login_required, current_user
from sqlalchemy.orm.exc import NoResultFound

from db.models.user import User
from db.models.game import Game, GamePlayer, GameQuestion, StatsTable
from db.database import db, as_dict
from .shared.api_types import Json


GAME_API_PREFIX = "/v1/game"

socketio: SocketIO = SocketIO(cors_allowed_origins='*')
game_api: Blueprint = Blueprint(
    'game_api', __name__, url_prefix=GAME_API_PREFIX)


def update_game_players(game_id: str = None) -> List[Json]:
    # Push updated players/scores to entire game
    player_query = GamePlayer.query.filter_by(game_id=game_id)
    players: List[Json] = []
    player: GamePlayer
    for player in player_query:
        user: User = User.query.filter_by(id=player.player_id).one()
        players.append({"score": player.score, "primary_email": user.primary_email,
                        "name": user.name, "color": user.color, "total_duration": player.total_duration})
    return players


def create_questions(operations: List[str], numberOfQuestions: int) -> List[Tuple[str, str]]:
    questions: List[Tuple[str, str]] = []
    for _ in range(numberOfQuestions):
        operation: str = random.choice(operations)
        operand_range = 12
        if operation == "+" or operation == "-":
            operand_range = 100

        operand1: int = random.randint(1, operand_range)
        operand2: int = random.randint(1, operand_range)
        if operation == "/":
            operand1 = operand2 * operand1
        question: str = f"{operand1} {operation} {operand2}"
        answer: int = int(eval(question))
        questions.append((question, str(answer)))
    return questions


@game_api.route("/<game_id>", methods=["GET"])
@login_required
def get_game_info(game_id: str = None) -> Json:
    game_query = Game.query.filter_by(id=game_id)
    game = game_query.one()
    return {
        "id": game.id,
        "status": game.status,
        "mode": game.mode,
        "maxTime": game.duration,
        "totalQuestions": game.num_questions
    }


@game_api.route("/getUsers", methods=["GET"])
def get_users() -> Json:
    stats_query = StatsTable.query.order_by(num_correct).limit(10)
    users: List[Json] = []
    correct: List[int] = []
    for stat in stats_query:
        user = User.query.filter_by(id=stat.player_id).one()
        users.append(user.name)
        correct.append(stat.num_correct)
    return {
        "users": users,
        "correct": correct,
    }


@ game_api.route("/<game_id>/questions", methods=["GET"])
@ login_required
def get_questions(game_id: str = None) -> Json:
    game_query = GameQuestion.query.filter_by(game_id=game_id)
    questions: List[Json] = []
    for question in game_query:
        questions.append(question.question)
    return {"questions": questions}


@ game_api.route("/create", methods=["POST"])
@ login_required
def create_game() -> Json:
    request_json: Json = request.get_json()
    game: Game = Game(status='Created', operations=','.join(
        request_json["operations"]), mode=request_json["mode"],
        question_type=request_json["questionType"],
        num_questions=request_json["numberOfQuestions"], duration=request_json["duration"])
    db.session.add(game)
    db.session.commit()

    questions: List[Tuple[str, str]] = create_questions(
        request_json["operations"], request_json["numberOfQuestions"])

    for quest_num in range(request_json["numberOfQuestions"]):
        question, answer = questions[quest_num]
        game_question: GameQuestion = GameQuestion(
            game_id=game.id, question=question, answer=answer, quest_num=1 + quest_num)
        db.session.add(game_question)

    db.session.commit()

    return {"id": game.id}


@game_api.route("/stats/<mode>", methods=["GET"])
@login_required
def get_stats(mode: str = None) -> Json:
    stats_query = StatsTable.query.filter_by(
        player_id=current_user.id, mode=mode)
    try:
        stats: StatsTable = stats_query.one()
    except NoResultFound:
        stats = StatsTable(player_id=current_user.id, mode=mode)
        db.session.add(stats)
        db.session.commit()

    # Compute additional stats ad-hoc
    accuracy: float = stats.num_correct / \
        stats.num_questions if stats.num_questions != 0 else 0
    win_rate: float = stats.num_wins / \
        stats.num_games if stats.num_games != 0 else 0
    speed: float = stats.total_duration / \
        stats.num_correct if stats.num_correct != 0 else 0

    return {
        "num_games": stats.num_games,
        "num_questions": stats.num_questions,
        "accuracy": accuracy,
        "win_rate": win_rate,
        "speed": speed
    }


def update_stats(game_id: str = None, mode: str = "Normal") -> Json:
    game: Game = Game.query.filter_by(id=game_id).one()
    players: List[GamePlayer] = GamePlayer.query.filter_by(
        game_id=game_id).all()

    player: GamePlayer
    game.max_score = max(player.score for player in players)
    for player in players:
        stats_query = StatsTable.query.filter_by(
            player_id=player.player_id, mode=mode)
        player_stats: StatsTable
        try:
            player_stats = stats_query.one()
        except NoResultFound:
            player_stats = StatsTable(
                player_id=player.player_id, mode=game.mode)
            db.session.add(player_stats)
            db.session.commit()

        # Update player's stats based on game
        if game.mode != "Solo":
            win: int = int(player.score == game.max_score)
            player_stats.num_wins = player_stats.num_wins + win
            player_stats.num_games = player_stats.num_games + 1
        player_stats.num_questions = player_stats.num_questions + game.num_questions
        player_stats.num_correct = player_stats.num_correct + player.score
        player_stats.total_duration = player_stats.total_duration + player.total_duration + \
            game.duration * (game.num_questions - player.score)
        db.session.commit()

    return {"id": game.id}


@socketio.on("join")
def join_game_room(room_code: str) -> None:
    req_game: Game = Game.query.filter_by(id=room_code).one_or_none()
    if req_game is not None:
        game_player: GamePlayer = GamePlayer(
            game_id=room_code, player_id=current_user.id, score=0)
        db.session.add(game_player)
        db.session.commit()
        join_room(room_code)
        emit("join_response", True, room=room_code)

        # Inform all other players of new player
        emit("update_players", update_game_players(
            room_code), room=room_code)

    else:
        print("invalid room")
        socketio.emit("join_response", False)


@socketio.on("start")
def start_game(room_code: str) -> None:
    emit("start_game", room=room_code, include_self=False)


@socketio.on("end")
def end_game(room_code: str) -> None:
    emit("end_game", room=room_code, include_self=False)
    close_room(room_code)
    update_stats(room_code)


@socketio.on("answer")
def validate_answer(answer_data: Json) -> None:
    game_id: str = answer_data["game_id"]
    game_question: GameQuestion = GameQuestion.query.filter_by(
        game_id=game_id, quest_num=answer_data["quest_num"]).one()
    if game_question.answer == answer_data["answer"]:

        # Correct answer - update scoreboard realtime
        emit("validate_answer", True, room=request.sid)
        game_player: GamePlayer = GamePlayer.query.filter_by(
            game_id=game_id, player_id=current_user.id).one()
        game_player.score += 1
        game_player.total_duration += answer_data["duration"]
        db.session.commit()
        emit("update_players", update_game_players(
            game_id), room=game_id)

    else:
        emit("validate_answer", False, room=request.sid)


@socketio.on("send_chat")
def send_chat(chat_data: Json) -> None:
    game_id: str = chat_data["game_id"]
    emit("chat_update", chat_data["message"], room=game_id)


@socketio.on("connect")
def connect() -> None:
    print("Websocket has been connected")


@socketio.on("disconnect")
def disconnect() -> None:
    print("Websocket has been disconnected")
