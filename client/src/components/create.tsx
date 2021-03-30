'use strict';

import React, {ChangeEvent, useState} from 'react';
import styled from 'styled-components';

import {CenteredButton, ErrorMessage} from "./shared";
import GroupIcon from '@material-ui/icons/Group';
import PersonIcon from '@material-ui/icons/Person';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import {
    Checkbox,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Radio,
    RadioGroup,
    Slider,
    Typography,
    FormControl
} from "@material-ui/core";
import { useHistory } from 'react-router-dom';

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
  padding-top: 30px;
  padding-bottom: 0px;
  padding-right: 60px;
  padding-left: 60px;
`;

//event: {preventDefault: () => void, target: {id: React.SetStateAction<string>}})
//: {onClick: {event: {preventDefault: () => void, target: {id: React.SetStateAction<string>}}}}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const GameMode = ({onClick}) => {
    const gameModes: { name: string, description: string, icon: any }[] = [
        { name: "Solo", description: "Practice Math On Your Own", icon: <PersonIcon onClick = {onClick} style={{"fill": "#00538F", "width": "100%", "height":"100%"}}/> },
        { name: "Head to Head", description: "Play With A Randomly Matched Foe", icon: <GroupIcon onClick = {onClick} style={{"fill": "#00538F","width": "100%", "height":"100%"}}/>},
        { name: "Group Play", description: "Play With 2+ Friends In A Private Room", icon: <GroupAddIcon onClick = {onClick} style={{"fill": "#00538F","width": "100%", "height":"100%"}}/>  }
    ];
    const modeBoxes = gameModes.map((gameMode, i) => (
        <GameModeBlock key={i} gameMode={gameMode} onClick={onClick}/>
    ));
    return(<GameModeBase>{modeBoxes}</GameModeBase>);
}


const GameModeBlockBase = styled.button`
  border-radius: 10px;
  display: grid;
  max-height: 250px;
  grid-template-rows: 65% 10% 25%;
  grid-template-areas: 
    'pic'
    'name'
    'description';
  margin: 1em;
  border: 3px solid black;
  color: "#00538F";
  background-color: #B5CEF3;
  text-align: center;
`;
//{gameMode: { name: string, description: string, icon: any },
//onClick: {event: {preventDefault: () => void, target: {id: React.SetStateAction<string>}}}}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const GameModeBlock = ({ gameMode, onClick} ) => {
    console.log(gameMode);
    return (
        <GameModeBlockBase id={gameMode.name} onClick={onClick}>
            {gameMode.icon}
            <div id={gameMode.name} onClick={onClick} style={{
                "zIndex": 0,
                "gridArea": "name",
                "fontWeight": "bold",
                "fontSize": "20px"
            }}>{gameMode.name}</div>
            <div id={gameMode.name} onClick={onClick}
                 style={{"zIndex": 0, "gridArea": "description", "fontSize": "18px"}}>{gameMode.description}</div>
        </GameModeBlockBase>);
};

const GameInfoBase = styled.div`
   display:grid;
   grid-template-columns: '50% 50%';
   grid-template-rows: 70% 30%;
   grid-template-areas: 
      'type duration'
      'start start';
  padding: 10px;
  margin: 20px;
  text-align: center;
  justify-content: center;
  border: 3px solid black;
  color: black;
  background-color: #B5CEF3;
  min-height: 330px;
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
    border: 2px solid black;
    background-color: white; 
`;

const DurationBase = styled.div`
   grid-area: duration;
   grid-template-rows: 50% 25% 25%;
   grid-template-areas: 'duration'
   'operation'
   'operation';
   justify-items: center;
   padding-top: 1em;
`;

const OperationBase = styled.div`
    grid-area: operation;
    grid-template-rows: 50% 50%;
    grid-template-columns: 50% 50%;
    grid-template-areas: 
        '1 2'
        '3 4';
    justify-items:center;
    padding: 0px;
    padding-top: 3em;
`;
//{questionType:string}), onChange: {ev: { target: { name: string; value: string; ariaValueText: string; ariaValueNow: string; }
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const QuestionButtons = ({onChange, questionType}) => {

    return( <QuestionsBase>
        <FormControl>
            <FormLabel style={{"fontSize": "1.25rem", "color": "black"}}>Question Type</FormLabel>
            <RadioGroup aria-label="questions" name="questionType" value={questionType} onChange={onChange}>
                <FormControlLabel value="SAT" control={<Radio />} label="SAT" />
                <FormControlLabel value="ACT" control={<Radio />} label="ACT" />
                <FormControlLabel value="GRE" control={<Radio />} label="GRE" />
                <FormControlLabel value="Normal" control={<Radio />} label="Normal" />
            </RadioGroup>
        </FormControl>
    </QuestionsBase>);
};
//{onChange: {ev: { target: { name: string; value: string; ariaValueText: string; ariaValueNow: string; }}}, operations:string[]}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const OperationButtons = ({onChange, operations}) => {

    return( <OperationBase>
        <FormLabel style={{"fontSize": "1.25rem", "color": "black"}}>Operation Type</FormLabel>
                <FormGroup style={{"flexDirection": "row"}}>
                    <FormControlLabel
                        control={<Checkbox checked={operations.includes("+")} onChange={onChange} value="+" name="operations" />}
                        label="+"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={operations.includes("-")} onChange={onChange} value="-" name="operations" />}
                        label="-"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={operations.includes("*")} onChange={onChange} value="*" name="operations" />}
                        label="*"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={operations.includes("/")} onChange={onChange} value="/" name="operations" />}
                        label="/"
                    />
                </FormGroup>
    </OperationBase>);
};

const GameInfo = ({chosenMode}: {chosenMode:string}) => {
    const questionType = ["SAT", "ACT", "GRE", "Normal"];
    const duration = (chosenMode !== "Head to Head");
    const numberOfQuestions = (chosenMode === "Group Play");
    const operations = (chosenMode === "Solo");
    const history = useHistory();

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
        operations: [],
        numberOfQuestions: 20,
    });
    //{ target: { name: string; value: string; ariaValueText: string; ariaValueNow: string; }}
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const onChange = (ev) => {
        setError('');
        console.log(ev);
        if(ev.target.name === "questionType") {
            if (ev.target.value === game.questionType) {
                setGame({
                    ...game,
                    questionType: ""
                })}
            else {
                setGame({
                    ...game,
                    [ev.target.name]: ev.target.value
                });
            }
        } else if(ev.target.name === "operations") {
            if (game.operations.includes(ev.target.value)) {
                console.log("already includes");
                const newArr = [...game.operations];
                console.log(newArr);
                newArr.splice(newArr.findIndex(item => item === ev.target.value), 1)
                console.log("removed");
                setGame({
                    ...game,
                    [ev.target.name]: newArr
                })
            } else {
                setGame({
                    ...game,
                    [ev.target.name]: [...game.operations, ev.target.value]
                })
            }
        } else{
            setGame({
                ...game,
                [ev.target.ariaValueText]: parseInt(ev.target.ariaValueNow)
            });
        }
        console.log(game);
    }

    const onSubmit = async (ev: { preventDefault: () => void; }) => {
        ev.preventDefault();
        console.log("Trying to submit!");

        if(game.questionType === "") {
            setError("Select question type");
            console.log("Select question type");
            return;
        } else if(chosenMode === "Solo" && game.operations === []) {
            setError("Select operation types");
            console.log("Select operation types");
            return;
        } else if(chosenMode !== "Head To Head" && game.duration === 0) {
            setError("Enter > 0 duration");
            console.log("Enter > 0 duration");
            return;
        } else if (chosenMode === "Group Play" && game.numberOfQuestions === 0) {
            setError("Enter > 0 number of questions");
            console.log("Enter > 0 number of questions");
            return;
        }

        console.log(game);

        const res = await fetch('/v1/create', {
            method: 'POST',
            body: JSON.stringify(game),
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            }
        });

        if (res.ok) {
            const data = await res.json();
            console.log(data);
            history.push(`/game/${data.id}`);
        }
    }

    return (<GameInfoBase>
            {questionType ? (<QuestionButtons onChange={onChange} questionType = {game.questionType}/>): null}
            <DurationBase>
                {duration ?
                    <div>
                        <Typography style = {{"fontSize":"1.25rem"}} gutterBottom>
                            Duration
                        </Typography>
                        <Slider
                            defaultValue={20}
                            aria-valuetext={"duration"}
                            valueLabelDisplay="auto"
                            onChange={onChange}
                            step={5}
                            marks
                            min={5}
                            max={40}
                        />
                    </div> : null
                }
                {operations ? (<OperationButtons operations = {game.operations} onChange = {onChange}/>): null}
                {numberOfQuestions ?
                    <div>
                        <Typography style = {{"fontSize":"1.25rem", "paddingTop": "3em"}} gutterBottom>
                            Number of Questions
                        </Typography>
                        <Slider
                            defaultValue={20}
                            aria-valuetext={"numberOfQuestions"}
                            valueLabelDisplay="auto"
                            onChange={onChange}
                            step={5}
                            marks
                            min={10}
                            max={50}
                        />
                    </div> : null
                }
            </DurationBase>
        <div style={{"gridArea": "start", "position": "relative"}}>
            <CenteredButton style={{"fontSize": "18px","minWidth":0, "width": "50%", "height": "100%"}} onClick={onSubmit}>Start Game!</CenteredButton>
            <ErrorMessage msg = {error}/>
        </div>
    </GameInfoBase>);
};

const JoinGameBase = styled.div`
  text-align: center;
  position: relative;
  justify-content: center;
  border: 3px solid black;
  border-radius: 10px;
  color: black;
  background-color: #B5CEF3;
  height: fit-content;
  padding: 10px;
  margin: 20px;
  width: fit-content;
`;

const JoinGame = () => {
    const [error, setError] = useState("");
    const [code, setCode] = useState<string>("");
    const history = useHistory();

    const onChange = (ev: { target: { value: React.SetStateAction<string>; }; }) => {
        setCode(ev.target.value);
    }

    const onSubmit = async (ev: { preventDefault: () => void; }) => {
        ev.preventDefault();
        console.log("Trying to submit!");

        const res = await fetch('/v1/join', {
            method: 'POST',
            body: code,
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            }
        });

        if (res.ok) {
            const data = await res.json();
            console.log(data);
            history.push(`/game/${data.id}`);
        } else {
            setError("Invalid Game Code")
        }

    }

    return(<JoinGameBase>
        <DurationBase>
            <h5>Room Code</h5>
            <DurationInput
                value = {code}
                style = {{"fontWeight": "bold" , "fontSize": "18px" }}
                onChange = {onChange}
            />
        </DurationBase>
        <CenteredButton style={{"fontSize": "18px","minWidth":0, "width": "50%", "height": "100%", "margin": "1.5em", "position": "relative"}} onClick={onSubmit}>Join!</CenteredButton>
        <ErrorMessage msg = {error}/>
    </JoinGameBase>)


}
const GameGenBase = styled.div`
  grid-area: main;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 75px auto auto;
  grid-template-areas: 
    'title'
    'modes'
    'options' 
`;

const OptionsBase = styled.div`
    gridArea: options;
    display: grid; 
    grid-template-areas: '1 2';
    grid-template-columns: 50% 50%;
    padding-left: 60px;
`;

export const GameGen = (props: { history: History; }) => {
    const [chosenMode, setMode] = useState("");

    //event: { preventDefault: () => void; target: { id: React.SetStateAction<string>; }; }
    const onClick = (event: { preventDefault: () => void; target: { id: React.SetStateAction<string>; }; }) => {
        event.preventDefault();
        console.log("calling onClick");
        console.log(event.target.id);
        setMode(event.target.id);
        console.log(chosenMode);
    };

    return(
        <GameGenBase>
            <Header> Select Game Mode</Header>
            <GameMode onClick={onClick}/>
            <OptionsBase>
                {chosenMode ? (<GameInfo chosenMode = {chosenMode}/>) : null}
                {(chosenMode === "Group Play") ? <JoinGame/> : null}
            </OptionsBase>
    </GameGenBase>);
}