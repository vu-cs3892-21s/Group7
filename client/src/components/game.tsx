import React, {
  useEffect,
  useState,
  useContext,
  ReactElement,
  SetStateAction,
} from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import {
  AnswerInput,
  AnswerLabel,
  CenteredDiv,
  CenteredButton,
} from "./shared";
import Timer from "react-compound-timer";
import PersonIcon from "@material-ui/icons/Person";
import { Socket } from "socket.io-client";
import { SocketContext } from "../context/socket";

interface Player {
  name: string;
  primary_email: string;
  score: number;
  color: string;
}

interface GameInfo {
  id: string;
  status: string;
  mode: string;
  maxTime: number;
  totalQuestions: number;
  questionNumber: number;
  start: boolean;
}

interface Event {
  target: {
    value: string;
  };
}

interface Message {
  sender: string;
  text: string;
}

const QuestionBoxBase = styled.div`
  position: relative;
  padding: 1em;
  grid-area: question;
  display: grid;
  grid-template-rows: 20% 60% 15%;
  grid-template-columns: auto;
  grid-template-areas:
    "topQ topT"
    "main main"
    "answer answer";
  background: #ffffff;
  min-height: 400px;
  border: 3px solid #000000;
  box-sizing: border-box;
`;

const QuestionBox = ({
  players,
  gameInfo,
  setGameInfo,
  userEmail,
}: {
  players: Player[];
  gameInfo: GameInfo;
  setGameInfo: React.Dispatch<SetStateAction<GameInfo>>;
  userEmail: string;
}): ReactElement => {
  const [status, setStatus] = useState<string>("");
  const [answer, setAnswer] = useState<string>(""); //user answer
  const [buttonText, setButtonText] = useState<string>("Start Game!"); //button state
  const [endGame, setEndGame] = useState<boolean>(false); //game state
  const socket: Socket = useContext(SocketContext);

  const [question, setQuestions] = useState<string[]>([]);

  console.log(gameInfo);

  useEffect(() => {
    const getQuestions = async (): Promise<void> => {
      const res = await fetch(`api/v1/game/${gameInfo.id}/questions`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data["questions"]);
      }
    };

    getQuestions();
  }, []);

  useEffect(() => {
    // attach socket event listeners
    socket.on("start_game", () => {
      setGameInfo({
        ...gameInfo,
        start: true,
      });
    });

    socket.on("validate_answer", (correct: boolean) => {
      console.log("validate attempt");
      console.log(question);
      if (correct) {
        resetAfterQuestion();
      } else {
        setStatus("Incorrect!");
      }
    });

    socket.on("end_game", () => {
      endOfGame();
    });

    return () => {
      socket.off("start_game");
      socket.off("validate_answer");
      socket.off("end_game");
    };
  }, [question, gameInfo, players]);

  const onStart = () => {
    setGameInfo({
      ...gameInfo,
      start: true,
    });

    if (gameInfo.questionNumber == 1) {
      // game should start for all players
      socket.emit("start", gameInfo.id.toString());
    }
  };

  const endOfGame = () => {
    setGameInfo({
      ...gameInfo,
      start: false,
    });
    setEndGame(true);
    // game should end for all players
    socket.emit("end", gameInfo.id.toString());
    socket.offAny();
  };

  const onChange = (ev: Event): void => {
    setStatus("");
    setAnswer(ev.target.value.replace(/ /g, ""));
    console.log("Changing value!");
    console.log(answer);
  };

  const resetAfterQuestion = (): void => {
    setQuestions(question.slice(1));

    if (question === [] || gameInfo.questionNumber >= gameInfo.totalQuestions) {
        return endOfGame();
      }
    console.log("next question")
    setGameInfo({
      ...gameInfo,
      start: false,
      questionNumber: ++gameInfo.questionNumber,
    });

    setAnswer("");
    setStatus("");

    console.log("restarting timer")
    setGameInfo({
      ...gameInfo,
      start: true,
    });

  };

  const getUserScore = (): number => {
    const user: Player | undefined = players.find(
      (player: Player) => player.primary_email == userEmail
    );
    if (user === undefined) {
      throw new TypeError("User is not in this game!");
    }
    return user.score;
  };

  const onSubmit = (): void => {
    console.log("Trying submit");
    socket.emit("answer", {
      answer: answer,
      game_id: gameInfo.id.toString(),
      quest_num: gameInfo.questionNumber,
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      onSubmit();
    }
  };

  const timeFinish = (): void => {
    console.log("Out of Time!");
    //will check the current answer and get ready for the next question
    resetAfterQuestion();
  };

  return (
    <QuestionBoxBase>
      <div style={{ gridArea: "topQ" }}>
        Question {gameInfo.questionNumber} of {gameInfo.totalQuestions}
        {gameInfo.mode === "Group Play" ? <div> Room Code: {gameInfo.id}</div>: null}
      </div>
      <div style={{ gridArea: "topT", textAlign: "right" }}>
        {gameInfo.start ? (
          <Timer
            initialTime={gameInfo.maxTime * 1000}
            direction="backward"
            checkpoints={[
              {
                time: 0,
                callback: () => timeFinish(),
              },
            ]}
          >
            {() => (
              <React.Fragment>
                Time Remaining: <Timer.Seconds /> seconds
              </React.Fragment>
            )}
          </Timer>
        ) : (
          <React.Fragment>
            Time Remaining: {gameInfo.maxTime} seconds
          </React.Fragment>
        )}
      </div>
      {gameInfo.start ? (
        <div
          style={{ gridArea: "main", textAlign: "center", fontSize: "18px" }}
        >
          {question[0]}
        </div>
      ) : endGame ? (
        <CenteredDiv
          style={{ gridArea: "main", fontWeight: "bold", fontSize: "32px" }}
        >
          Game Over! <br /> Questions Answered: {getUserScore()}{" "}
        </CenteredDiv>
      ) : (
        <CenteredDiv
          style={{
            position: "relative",
            gridArea: "main",
            alignItems: "center",
          }}
        >
          <CenteredButton onClick={onStart}>{buttonText}</CenteredButton>
        </CenteredDiv>
      )}
      <Status>{status}</Status>
      {gameInfo.start ? (
        <AnswerBox onChange={onChange} onKeyDown={onKeyDown} answer={answer} />
      ) : null}
    </QuestionBoxBase>);
};

const AnswerBoxBase = styled.div`
  grid-area: answer;
  position: relative;
  border: 3px solid white;
  border-radius: 10px;
  color: white;
  background-color: #00538f;
  padding: 10px;
`;

const Status = styled.div`
  color: #00538f;
  font-size: 20px;
`;

const AnswerBox = ({
  onChange,
  onKeyDown,
  answer,
}: {
  onChange: (ev: Event) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  answer: string;
}): ReactElement => {
  return (
    <AnswerBoxBase>
      <AnswerLabel style={{ textAlign: "right", color: "white" }}>
        Answer:
      </AnswerLabel>
      <AnswerInput
        id="answer"
        type="text"
        name="answer"
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={answer}
        autoFocus
      />
    </AnswerBoxBase>
  );
};

const ChatBase = styled.div`
  max-height: 300px;
  grid-area: chat;
  display: grid;
  grid-template-rows: 75% 20%;
  grid-gap: 5%;
  grid-template-columns: 100%;
  grid-template-areas:
    "chat"
    "type";
  padding: 10px;
  border: 5px solid white;
  box-sizing: border-box;
`;
const ChatBox = ({ name, id }: { name: string; id: string }): ReactElement => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [myMessage, updateMessage] = useState<string>("");
  const socket: Socket = useContext(SocketContext);

  useEffect(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    socket.on("chat_update", (message: Message) => {
      setMessages([message, ...messages]);
    });
    return () => {
      socket.off("chat_update");
    };
  }, [messages]);

  const onChange = (ev: {
    target: { value: React.SetStateAction<string> };
  }): void => {
    console.log("changed");
    updateMessage(ev.target.value);
  };

  const onSubmit = async (ev: {
    preventDefault: () => void;
  }): Promise<void> => {
    ev.preventDefault();

    const message: Message = {
      sender: name,
      text: myMessage,
    };
    socket.emit("send_chat", { message: message, game_id: id });
    updateMessage("");
  };

  return (
    <ChatBase>
      <MessageList messages={messages} />
      <SendMessageForm
        onChange={onChange}
        onSubmit={onSubmit}
        myMessage={myMessage}
      />
    </ChatBase>
  );
};

const MessageList = ({ messages }: { messages: Message[] }): ReactElement => {
  const messageBox = messages.map(
    (message: { sender: string; text: string }, i: number) => (
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "5px",
          margin: "2px",
          maxWidth: "95%",
        }}
        key={i}
      >
        {message.sender}: {message.text}
      </div>
    )
  );
  return (
    <div
      style={{
        overflow: "scroll",
        gridArea: "chat",
        display: "flex",
        flexDirection: "column-reverse",
      }}
    >
      {messageBox}
    </div>
  );
};

const SendMessageForm = ({
  onChange,
  onSubmit,
  myMessage,
}: {
  onChange: (ev: { target: { value: React.SetStateAction<string> } }) => void;
  onSubmit: (ev: { preventDefault: () => void }) => Promise<void>;
  myMessage: string;
}): ReactElement => {
  return (
    <form
      style={{ position: "relative", gridArea: "type", alignContent: "right" }}
      onSubmit={onSubmit}
      className="send-message-form"
    >
      <AnswerInput
        style={{ textAlign: "right", width: "100%" }}
        onChange={onChange}
        value={myMessage}
        placeholder="Type your message and hit ENTER"
        type="text"
      />
    </form>
  );
};

const PlayerBox = styled.div`
  margin: 5px;
  padding-right: 30px;
  background: #b5cef3;
  position: relative;
  border: 3px solid white;
  border-radius: 5px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 25% 45% 30%;
  grid-template-areas: "img player rank";
`;

const Player = ({
  player,
  rank,
}: {
  player: Player;
  rank: number;
}): ReactElement => {
  return (
    <PlayerBox>
      <PersonIcon
        style={{
          gridArea: "img",
          width: "100%",
          height: "100%",
          fill: player.color,
        }}
      />
      <CenteredDiv
        style={{
          gridArea: "player",
          fontWeight: "bold",
          fontSize: "20px",
          position: "relative",
        }}
      >
        {player.name}: {player.score}
      </CenteredDiv>
      <CenteredDiv
        style={{
          fontSize: "40px",
          gridArea: "rank",
          textAlign: "right",
          height: "75%",
          position: "relative",
        }}
      >
        #{rank}
      </CenteredDiv>
    </PlayerBox>
  );
};

const PlayerBase = styled.div`
  grid-area: players;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  border-radius: 5px;
`;

const Players = ({ players }: { players: Player[] }): ReactElement => {
  players.sort((a, b) => b.score - a.score);
  const playerBoxes = players.map((player: any, i: number) => (
    <Player key={i} player={player} rank={i + 1} />
  ));
  return <PlayerBase>{playerBoxes}</PlayerBase>;
};

const GamePageBase = styled.div`
  grid-area: main;
  display: grid;
  padding: 30px;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: 2fr 250px;
  grid-gap: 20px;
  grid-template-areas:
    "question players"
    "chat players";
  padding-left: 1em;
  padding-top: 1em;
`;

export const GamePage = ({
  userEmail,
  userName,
}: {
  userEmail: string;
  userName: string;
}): ReactElement => {
  //useEffect to load in gameInfo & players
  //load in gameInfo
  const socket: Socket = useContext(SocketContext);
  const { id } = useParams<{ id: string }>();
  const [gameInfo, setGameInfo] = useState({
    id: id,
    status: "",
    mode: "",
    maxTime: 20,
    totalQuestions: 20,
    questionNumber: 1,
    start: false,
  });

  //load in all the players
  const [players, updatePlayers] = useState<Player[]>([]);

  useEffect(() => {
    async function setGameData() {
      const res = await fetch(`/api/v1/game/${id}`);
      if (res.ok) {
        const game = await res.json();
        console.log("grabbing data!");
        console.log(game);
        setGameInfo({
          ...gameInfo,
          start: false,
        });
      }
    }
    setGameData();
  }, []);

  useEffect(() => {
    socket.on("update_players", (game_players: Player[]) => {
      updatePlayers(game_players);
    });

    return () => {
      socket.off("update_players");
    };
  }, [players]);

  return (
    <GamePageBase>
      <QuestionBox
        players={players}
        gameInfo={gameInfo}
        setGameInfo={setGameInfo}
        userEmail={userEmail}
      />
      {gameInfo.mode !== "Solo" ? <Players players={players} /> : null}
      {gameInfo.mode !== "Solo" ? <ChatBox name={userName} id={id} /> : null}
    </GamePageBase>
  );
};