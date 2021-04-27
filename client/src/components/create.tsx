"use strict";

import React, {useState, useContext, useEffect, ChangeEvent, MouseEventHandler} from "react";
import { useHistory } from "react-router";
import styled from "styled-components";

import { CenteredButton } from "./shared";
import { SocketContext, socket } from "../context/socket";
import { Alert } from "@material-ui/lab";
import GroupIcon from "@material-ui/icons/Group";
import PersonIcon from "@material-ui/icons/Person";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  Slider,
  Typography,
  FormControl,
} from "@material-ui/core";

const Header = styled.h2`
  position: flex;
  padding-left: 75px;
  padding-top: 30px;
  font: 70px;
  grid-area: title;
  color: white;
`;

const GameModeBase = styled.div`
  grid-area: modes;
  display: grid;
  grid-template-columns: 33% 33% 33%;
  padding-bottom: 0px;
  padding-right: 60px;
  padding-left: 60px;
`;

interface GameMode {
  name: string;
  description: string;
  icon: any
}

interface Event1 {
  target: {
    name: string;
    value: string;
  };
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const GameMode = ({ onClick})  => {
  const gameModes: GameMode[] = [
    {
      name: "Solo",
      description: "Practice Math On Your Own",
      icon: (
        <PersonIcon
          style={{ fill: "#00538F", width: "100%", height: "100%" }}
        />
      ),
    },
    {
      name: "Head to Head",
      description: "Play With A Randomly Matched Foe",
      icon: (
        <GroupIcon
          style={{ fill: "#00538F", width: "100%", height: "100%" }}
        />
      ),
    },
    {
      name: "Group Play",
      description: "Play With 2+ Friends In A Private Room",
      icon: (
        <GroupAddIcon
          style={{ fill: "#00538F", width: "100%", height: "100%" }}
        />
      ),
    },
  ];

  const modeBoxes = gameModes.map((gameMode, i) => (
    <GameModeBlock key={i} gameMode={gameMode} onClick={onClick} />
  ));

  return <GameModeBase>{modeBoxes}</GameModeBase>;
};

const GameModeBlockBase = styled.button`
  border-radius: 10px;
  display: grid;
  max-height: 250px;
  grid-template-rows: 65% 10% 25%;
  grid-template-areas:
    "pic"
    "name"
    "description";
  margin: 1em;
  border: 3px solid black;
  color: "#00538F";
  background-color: #b5cef3;
  text-align: center;
`;

const GameModeBlock = ({ gameMode, onClick }:
{
  gameMode: GameMode;
  onClick: (mode: string) => void
}
) => {
  return (
    <GameModeBlockBase id={gameMode.name} onClick={() => onClick(gameMode.name)}>
      {gameMode.icon}
      <div
        id={gameMode.name}
        style={{
          zIndex: 0,
          gridArea: "name",
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        {gameMode.name}
      </div>
      <div
        id={gameMode.name}
        style={{ zIndex: 0, gridArea: "description", fontSize: "18px" }}
      >
        {gameMode.description}
      </div>
    </GameModeBlockBase>
  );
};

const GameInfoBase = styled.div`
  display: grid;
  grid-template-columns: "50% 50%";
  grid-template-rows: 70% 15% 15%;
  grid-template-areas:
    "type duration"
    "error error"
    "start start";
  padding: 10px;
  margin: 20px;
  margin-top: 0px;
  text-align: center;
  justify-content: center;
  border: 3px solid white;
  color: white;
  min-height: 350px;
  max-height: 375px;
  width: fit-content;
  border-radius: 10px;
`;

const QuestionsBase = styled.div`
  grid-area: type;
  padding: 10px;
  justify-items: center;
`;

const DurationInput = styled.input`
  height: 50px;
  width: 100px;
  border: 2px solid white;
  background-color: white;
`;

const DurationBase = styled.div`
  grid-area: duration;
  grid-template-rows: 50% 25% 25%;
  grid-template-areas:
    "duration"
    "operation"
    "operation";
  justify-items: center;
  padding-top: 1em;
`;

const OperationBase = styled.div`
  grid-area: operation;
  grid-template-rows: 50% 50%;
  grid-template-columns: 50% 50%;
  grid-template-areas:
    "1 2"
    "3 4";
  justify-items: center;
  padding: 0px;
`;

const QuestionButtons = ({
  onChange,
  questionType,
}: {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  questionType: string;
}) => {
  const questionTypes = ["Bases","Kth_biggest", "Sequence", "Arithmetic"];
  return (
    <QuestionsBase>
      <FormControl>
        <FormLabel style={{ fontSize: "1.25rem", color: "white" }}>
          Question Type
        </FormLabel>
        <RadioGroup
          aria-label="questions"
          name="questionType"
          value={questionType}
          onChange={onChange}
          style={{color: "white"}}
        >
          <FormControlLabel value={questionTypes[0]} control={<Radio />} label={questionTypes[0]} />
          <FormControlLabel value={questionTypes[1]} control={<Radio />} label={questionTypes[1]}/>
          <FormControlLabel value={questionTypes[2]} control={<Radio />} label={questionTypes[2]} />
          <FormControlLabel value={questionTypes[3]} control={<Radio />} label={questionTypes[3]} />
        </RadioGroup>
      </FormControl>
    </QuestionsBase>
  );
};

const OperationButtons = ({ onChange, operations }: {onChange: (ev: ChangeEvent<HTMLInputElement>) => void, operations: string[]}) => {
  return (
    <OperationBase>
      <FormLabel style={{ fontSize: "1.25rem", color: "white" }}>
        Operation Type
      </FormLabel>
      <FormGroup style={{ flexDirection: "row", color: "white"}}>
        <FormControlLabel
          control={
            <Checkbox
              checked={operations.includes("+")}
              onChange={onChange}
              value="+"
              name="operations"
            />
          }
          label="+"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={operations.includes("-")}
              onChange={onChange}
              value="-"
              name="operations"
            />
          }
          label="-"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={operations.includes("*")}
              onChange={onChange}
              value="*"
              name="operations"
            />
          }
          label="*"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={operations.includes("/")}
              onChange={onChange}
              value="/"
              name="operations"
            />
          }
          label="/"
        />
      </FormGroup>
    </OperationBase>
  );
};

const GameInfo = ({ chosenMode }: { chosenMode: string }) => {
  const duration = chosenMode !== "Head to Head";
  const numberOfQuestions = chosenMode !== "Head to Head";
  const operations = chosenMode !== "Head to Head";
  const history = useHistory();
  const socket = useContext(SocketContext);

  const [error, setError] = useState("");
  const [game, setGame] = useState<{
    mode: string;
    questionType: string;
    duration: number;
    operations: string[];
    numberOfQuestions: number;
  }>({
    mode: chosenMode,
    questionType: "",
    duration: 20,
    operations: ["+", "-", "*", "/"],
    numberOfQuestions: 20,
  });

  useEffect(() => setError(""), [chosenMode]);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
    const onChangeNum = (ev) : void => {
    setError("");
    setGame({
      ...game,
      [ev.target.ariaValueText]: parseInt(ev.target.ariaValueNow),
    });
    console.log(game);
  };

  const onChangeOps = (ev: ChangeEvent<HTMLInputElement>) : void => {
    if (game.operations.includes(ev.target.value)) {
      console.log("already includes");
      const newArr = [...game.operations];
      console.log(newArr);
      newArr.splice(
          newArr.findIndex((item) => item === ev.target.value),
          1
      );
      console.log("removed");
      setGame({
        ...game,
        [ev.target.name]: newArr,
      });
    } else {
      setGame({
        ...game,
        [ev.target.name]: [...game.operations, ev.target.value],
      });
    }
  };

  const onChangeQType = (ev: Event1) : void => {
    setError("");
    if (ev.target.value === game.questionType) {
        setGame({
          ...game,
          questionType: "",
        });
    } else {
        setGame({
          ...game,
          [ev.target.name]: ev.target.value,
        });
      }
  };

  const onSubmit = async (ev: { preventDefault: () => void }) => {
    ev.preventDefault();
    console.log("Trying to submit!");

    if (game.questionType === "") {
      setError("Select question type");
      console.log("Select question type");
      return;
    } else if (chosenMode === "Solo" && game.operations.length === 0) {
      setError("Select operation types");
      console.log("Select operation types");
      return;
    } else if (chosenMode !== "Head to Head" && game.duration === 0) {
      setError("Enter > 0 duration");
      console.log("Enter > 0 duration");
      return;
    } else if (chosenMode === "Group Play" && game.numberOfQuestions === 0) {
      setError("Enter > 0 number of questions");
      console.log("Enter > 0 number of questions");
      return;
    }

    console.log(JSON.stringify(game));

    console.log(chosenMode);
    if (chosenMode === "Head to Head") {
      socket.emit("find_match", game);
      history.push("/loading");
    } else {
      const res = await fetch("/api/v1/game/create", {
        method: "POST",
        body: JSON.stringify(game),
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        socket.emit("join", data.id.toString());
        history.push(`/game/${data.id}`);
      }
    }
  };

    return (
    <GameInfoBase>
      <QuestionButtons onChange={onChangeQType} questionType={game.questionType} />
      <DurationBase>
        {duration ? (
          <div>
            <Typography style={{ fontSize: "1.25rem", color: "white"}} gutterBottom>
              Duration
            </Typography>
            <Slider
              defaultValue={20}
              aria-valuetext={"duration"}
              valueLabelDisplay="auto"
              onChange={onChangeNum}
              step={10}
              marks
              min={10}
              max={60}
            />
          </div>
        ) : null}
        {numberOfQuestions ? (
          <div>
            <Typography style={{ fontSize: "1.25rem", color: "white"}} gutterBottom>
              Number of Questions
            </Typography>
            <Slider
              defaultValue={20}
              aria-valuetext={"numberOfQuestions"}
              valueLabelDisplay="auto"
              onChange={onChangeNum}
              step={5}
              marks
              min={10}
              max={50}
            />
          </div>
        ) : null}
        {operations ? (
          <OperationButtons operations={game.operations} onChange={onChangeOps} />
        ) : null}
      </DurationBase>
      <div style={{ gridArea: "error" }}>
        {error ? <Alert severity="error">{error}</Alert> : null}
      </div>
      <div style={{ gridArea: "start", position: "relative" }}>
        <CenteredButton
          style={{
            fontSize: "18px",
            minWidth: 0,
            width: "50%",
            height: "100%",
          }}
          onClick={onSubmit}
        >
          Start Game!
        </CenteredButton>
      </div>
    </GameInfoBase>
  );
};

const JoinGameBase = styled.div`
  text-align: center;
  position: relative;
  justify-content: center;
  border: 3px solid white;
  border-radius: 10px;
  color: white;
  height: fit-content;
  padding: 10px;
  margin: 20px;
  width: fit-content;
`;

const JoinGame = () => {
  const [error, setError] = useState("");
  const [code, setCode] = useState<string>("");
  const history = useHistory();
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on("join_response", (worked: any) => {
      if (worked) {
        history.push(`/game/${code}`);
        console.log("connected!");
      } else {
        setError("Invalid Game Code");
      }
    });
    return () => {
      socket.off("join_response");
    };
  }, [code]);

  const onChange = (ev: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setCode(ev.target.value);
  };

  const onSubmit = async (ev: { preventDefault: () => void }) => {
    ev.preventDefault();
    console.log("Trying to submit!");

    socket.emit("join", code);
  };

  return (
    <JoinGameBase>
      <DurationBase>
        <h5>Room Code</h5>
        <DurationInput
          value={code}
          style={{ fontWeight: "bold", fontSize: "18px" }}
          onChange={onChange}
        />
      </DurationBase>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <CenteredButton
        style={{
          fontSize: "18px",
          minWidth: 0,
          width: "50%",
          height: "100%",
          margin: "1.5em",
          position: "relative",
        }}
        onClick={onSubmit}
      >
        Join!
      </CenteredButton>
    </JoinGameBase>
  );
};

const GameGenBase = styled.div`
  grid-area: main;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 75px 275px 400px;
  grid-template-areas:
    "title"
    "modes"
    "options";
`;

const OptionsBase = styled.div`
  gridarea: options;
  display: grid;
  grid-template-areas: "1 2";
  grid-template-columns: 50% 50%;
  padding-left: 60px;
`;

export const GameGen = (props: { history: History }) => {
  const [chosenMode, setMode] = useState<string>("");

  const onClick = (mode: string) : void => {
    console.log("calling onClick");
    console.log(mode);
    setMode(mode);
    console.log(chosenMode);
  };

  return (
    <GameGenBase>
      <Header> Select Game Mode</Header>
      <GameMode onClick={onClick} />
      <SocketContext.Provider value={socket}>
        <OptionsBase>
          {chosenMode ? <GameInfo chosenMode={chosenMode} /> : null}
          {chosenMode === "Group Play" ? <JoinGame /> : null}
        </OptionsBase>
      </SocketContext.Provider>
    </GameGenBase>
  );
};
