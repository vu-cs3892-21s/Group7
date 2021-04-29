import random
from typing import List, Tuple, Annotated
from flask_socketio import SocketIO, emit, join_room, close_room, rooms
from flask import Blueprint, request
from flask_login import login_required, current_user
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.sql.expression import func
from sqlalchemy import or_
from elo import rate_1vs1

from db.models.user import User
from db.models.game import Game, GamePlayer, GameQuestion, StatsTable
from db.models.questions import Question
from db.database import db, as_dict
from .shared.api_types import Json


GAME_API_PREFIX = "/api/v1/game"

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


def create_arithmetic_questions(operations: List[str], numberOfQuestions: int) -> List[Tuple[str, str]]:
    questions: List[Tuple[str, str]] = []
    for _ in range(numberOfQuestions):
        operation: str = random.choice(operations)
        first_operand_range: int = 100
        second_operand_range: int = 100
        if operation == "*" or operation == "/":
            second_operand_range = 12

        operand1: int = random.randint(2, first_operand_range)
        operand2: int = random.randint(2, second_operand_range)
        if operation == "/":
            operand1 = operand2 * operand1
        question: str = f"{operand1} {operation} {operand2}"
        answer: int = int(eval(question))
        questions.append((question, str(answer)))
    return questions


def pull_database_questions(question_type: Json, num_questions: int) -> List[Tuple[str, str]]:
    questions: List[Question] = Question.query.order_by(
        func.random()).filter_by(question_type=question_type).limit(num_questions).all()
    question_list: List[Tuple[str, str]] = []
    for question in questions:
        question_list.append((question.question, question.answer))
    return question_list


def create_questions(game_json: Json) -> List[Tuple[str, str]]:
    if game_json["questionType"] == "Arithmetic":
        return create_arithmetic_questions(game_json["operations"], game_json["numberOfQuestions"])
    else:
        return pull_database_questions(game_json["questionType"], game_json["numberOfQuestions"])


def join_game(game_id: str) -> None:
    join_room(game_id)
    req_player : GamePlayer = GamePlayer.query.filter_by(game_id=game_id, player_id=current_user.id).one_or_none()
    if req_player is None:
        game_player: GamePlayer = GamePlayer(
            game_id=game_id, player_id=current_user.id, score=0)
        db.session.add(game_player)
        db.session.commit()
    # Inform all other players of new player
    emit("update_players", update_game_players(game_id), room=game_id)

@ game_api.route("/<game_id>", methods=["GET"])
@ login_required
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


@game_api.route("/getUsers/<question_type>", methods=["GET"])
def get_users(question_type: str = None) -> Json:
    stats_query = StatsTable.query.filter_by(
        question_type=question_type).order_by('elo').limit(10)
    users: List[Json] = []
    elo: List[float] = []
    colors: List[Json] = []
    for stat in stats_query:
        user = User.query.filter_by(id=stat.player_id).one()
        users.append(user.name)
        elo.append(stat.elo)
        colors.append(user.color)
    return {
        "users": users,
        "elo": elo,
        "colors": colors,
    }


@ game_api.route("/<game_id>/questions", methods=["GET"])
@ login_required
def get_questions(game_id: str = None) -> Json:
    game_query = GameQuestion.query.filter_by(game_id=game_id)
    questions: List[Json] = []
    for question in game_query:
        questions.append(question.question)
    return {"questions": questions}


def create_game_from_json(game_json: Json) -> str:

    # Create game and questions
    game: Game = Game(status='Created', operations=','.join(
        game_json["operations"]), mode=game_json["mode"],
        question_type=game_json["questionType"],
        num_questions=game_json["numberOfQuestions"], duration=game_json["duration"])
    db.session.add(game)
    db.session.commit()

    questions: List[Tuple[str, str]] = create_questions(game_json)

    # Add questions to database
    for quest_num in range(game_json["numberOfQuestions"]):
        question, answer = questions[quest_num]
        game_question: GameQuestion = GameQuestion(
            game_id=game.id, question=question, answer=answer, quest_num=1 + quest_num)
        db.session.add(game_question)
    db.session.commit()
    return str(game.id)


@ game_api.route("/create", methods=["POST"])
@ login_required
def create_game() -> Json:
    request_json: Json = request.get_json()
    return {"id": create_game_from_json(request_json)}


@ game_api.route("/stats/<question_type>", methods=["GET"])
@ login_required
def get_stats(question_type: str = None) -> Json:
    stats_query = StatsTable.query.filter_by(
        player_id=current_user.id, question_type=question_type)
    stats: StatsTable = stats_query.one_or_none()

    # Compute additional stats ad-hoc
    accuracy: float = stats.num_correct / \
        stats.num_questions if stats.num_questions != 0 else 0
    win_rate: float = stats.num_wins / \
        stats.num_games if stats.num_games != 0 else 0
    speed: float = stats.total_duration / \
        stats.num_questions if stats.num_questions != 0 else 0

    return {
        "num_games": stats.num_games,
        "num_questions": stats.num_questions,
        "accuracy": accuracy,
        "win_rate": win_rate,
        "speed": speed
    }


def update_ratings(players: Annotated[List[GamePlayer], 2], game: Game):
    # in the form [winner, loser]
    players.sort(key=lambda player: player.score, reverse=True)

    # calculate changes to elos
    stats: Annotated[List[StatsTable], 2] = [StatsTable.query.filter_by(
        player_id=player.player_id, question_type=game.question_type).one_or_none() for player in players]
    (stats[0].elo, stats[1].elo) = rate_1vs1(stats[0].elo, stats[1].elo)
    db.session.commit()


def update_stats(game_id: str = None) -> Json:
    game: Game = Game.query.filter_by(id=game_id).one()
    players: List[GamePlayer] = GamePlayer.query.filter_by(
        game_id=game_id).all()

    player: GamePlayer
    game.max_score = max(player.score for player in players)
    if game.mode == "Head to Head":
        update_ratings(players, game)
    for player in players:
        stats_query = StatsTable.query.filter_by(
            player_id=player.player_id, question_type=game.question_type)
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


@ socketio.on("join")
def join_game_room(room_code: str) -> None:
    req_game: Game = Game.query.filter_by(id=room_code).one_or_none()

    if req_game.mode == "Solo":
        num_players = GamePlayer.query.filter_by(id=room_code).count()
        if num_players != 0:
            print("One person allowed in solo room")
            socketio.emit("join_response", False)
        else:
            emit("join_response", True)
            join_game(room_code)

    elif req_game is not None and req_game.mode == "Group Play" and req_game.status=="Created":
        emit("join_response", True)
        join_game(room_code)

    else:
        print("invalid room")
        socketio.emit("join_response", False)


@ socketio.on("start")
def start_game(room_code: str) -> None:
    game: Game = Game.query.filter_by(id=room_code).one_or_none()
    if game.status == "Created":
        game.status = "Started"
        db.session.commit()
        emit("start_game", room=room_code, include_self=False)


@ socketio.on("end")
def end_game(room_code: str) -> None:
    game: Game = Game.query.filter_by(id=room_code).one_or_none()
    if game.status == "Started":
        game.status = "Ended"
        db.session.commit()
        emit("end_game", room=room_code, include_self=False)
        close_room(room_code)
        update_stats(room_code)


@ socketio.on("answer")
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


@ socketio.on("find_match")
def find_match(game: Json) -> None:
    games: List[Game] = Game.query.filter_by(
        question_type=game["questionType"], mode=game["mode"], status="Created").all()
    game_id: str

    def only_one_opponent(game: Game) -> bool:
        return GamePlayer.query.filter_by(game_id=game.id).count() == 1

    def get_elo_difference(game: Game) -> float:
        my_elo: float = StatsTable.query.filter_by(
            question_type=game.question_type, player_id=current_user.id).one().elo
        opponent: GamePlayer = GamePlayer.query.filter_by(
            game_id=game.id).one()
        opponent_elo: float = StatsTable.query.filter_by(
            question_type=game.question_type, player_id=opponent.player_id).one().elo
        return abs(my_elo - opponent_elo)

    # filter out unfair games and games with too many players and sort by closest elo
    games = list(filter(lambda game: (only_one_opponent(game)
                                      and get_elo_difference(game) < 200), games))
    games.sort(key=get_elo_difference)
    if len(games) == 0:  # No matches, create our own game
        game_id = create_game_from_json(game)
    else:  # Other players waiting for game

        # Find match with closest rating
        game: Game = games[0]
        game_id = str(game.id)
        join_room(game_id)
        emit("found_match", game_id, room=game_id)
    join_game(game_id)


@socketio.on("cancel_match")
def cancel_match() -> None:
    game_players: List[GamePlayer] = GamePlayer.query.filter_by(
        player_id=current_user.id).all()
    for game_player in game_players:
        game: Game = Game.query.filter_by(
            id=game_player.game_id, status="Created").one_or_none()
        if game is not None:
            game.status = "Cancelled"
    db.session.commit()

@socketio.on("cancel")
def cancel(room_id: str) -> None:
    players_query: List[GamePlayer] = GamePlayer.query.filter_by(game_id = room_id).all()
    if len(players_query) == 1:
        game: Game = Game.query.filter_by(
            id=room_id, status="Created").one_or_none()
        if game is not None:
            game.status = "Cancelled"
        db.session.commit()

    game_player: GamePlayer = GamePlayer.query.filter_by(game_id = room_id, player_id=current_user.id).one_or_none()
    if game_player is not None:
        db.session.delete(game_player)
        db.session.commit()
        emit("update_players", update_game_players(room_id), room=room_id)

@ socketio.on("send_chat")
def send_chat(chat_data: Json) -> None:
    game_id: str = chat_data["game_id"]
    emit("chat_update", chat_data["message"], room=game_id)


@ socketio.on("connect")
def connect() -> None:
    print("Websocket has been connected")


@ socketio.on("disconnect")
def disconnect() -> None:
    print("Websocket has been disconnected")
