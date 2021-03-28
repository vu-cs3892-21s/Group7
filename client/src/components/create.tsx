'use strict';

import React, {useState} from 'react';
import {useHistory} from 'react-router';
import styled from 'styled-components';

import {CenteredButton, ErrorMessage} from "./shared";
import GroupIcon from '@material-ui/icons/Group';
import PersonIcon from '@material-ui/icons/Person';
import GroupAddIcon from '@material-ui/icons/GroupAdd';

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
  padding: 60px;
  display: grid;
  grid-template-columns: 33% 33% 33%;
  grid-template-rows: auto
  grid-template-areas: "1 2 3"
  max-height: 250px;
  padding-top: 0px;
  padding-bottom: 0px;
`;



// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const GameMode = ({onClick}) => {
    // type Icon = typeof PersonIcon | typeof GroupIcon | typeof GroupAddIcon;
    // eslint-disable-next-line @typescript-eslint/ban-types
    const gameModes: { name: string, description: string, icon: any}[] = [
        { name: "Solo", description: "Practice Math On Your Own", icon: <PersonIcon onClick = {onClick} style={{"fill": "#00538F", "width": "100%", "height":"70%"}}/> },
        { name: "Head to Head", description: "Play With A Randomly Matched Foe", icon: <GroupIcon onClick = {onClick} style={{"fill": "#00538F","width": "100%", "height":"100%"}}/>},
        { name: "Group Play", description: "Play With 2+ Friends In A Private Room", icon: <GroupAddIcon onClick = {onClick} style={{"fill": "#00538F","width": "100%", "height":"100%"}}/>  }
    ];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const modeBoxes = gameModes.map((gameMode, i) => (
        <GameModeBlock key={i} gameMode={gameMode} onClick={onClick}/>
    ));
    return(<GameModeBase>{modeBoxes}</GameModeBase>);
}


const GameModeBlockBase = styled.button`
  display: grid;
  max-height: 300px;
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

//gameMode: { name: string, description: string, src: string }
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const GameModeBlock = ({ gameMode, onClick}) => {
    //make the background the image?
    console.log(gameMode);
    return(
    <GameModeBlockBase id={gameMode.name} onClick = {onClick}>
        {gameMode.icon}
        <div id={gameMode.name} onClick = {onClick} style={{"zIndex": 0, "gridArea" : "name", "fontWeight": "bold" , "fontSize": "20px"}}>{gameMode.name}</div>
        <div id={gameMode.name} onClick = {onClick} style={{"zIndex": 0, "gridArea" : "description", "fontSize": "18px"}}>{gameMode.description}</div>
    </GameModeBlockBase>);
};

const GameInfoBase = styled.div`
   display:grid;
   grid-template-columns: '50% 50%';
   grid-template-rows: 80% 20%;
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
  max-height: 300px;
  width: fit-content;
`;

const QuestionsBase = styled.div`
  grid-area: type;
  padding: 10px;
  display: grid;
  justify-items: center;
  grid-template-rows: 12% 22% 22% 22% 22%;
`;


const QuestionButton = styled.button`
    height: 40px;
    width: 100px;
    margin: 5px;
    border: 2px solid black;
    background-color: white; 
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
   padding-bottom: 10px;
   justify-items: center;
`;

const OperationButton = styled.button`
    height: 50px;
    width: 50px;
    border: 2px solid black;
    background-color: white; 
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
`;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const QuestionButtons = ({questionTypes, onChange, game}) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const questionBoxes = questionTypes.map((questionType, i) => (
        <QuestionButton
            name="questionType"
            value={questionType}
            onClick={onChange}
            key={i}
            style = {{"fontWeight": "bold" , "fontSize": "18px", "border": (questionType === game.questionType) ? "2px solid red": ""}}>
            {questionType}
        </QuestionButton>
    ));
    return( <QuestionsBase>
        <h5>Question Type</h5>
        {questionBoxes}
    </QuestionsBase>);
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const OperationButtons = ({operationTypes, onChange, game}) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const operationBoxes = operationTypes.map((operationType, i) => (
        <OperationButton
            value = {operationType}
            name = "operations"
            onClick = {onChange}
            key = {i}
            style = {{"fontWeight": "bold" , "fontSize": "18px", "border": (game.operations.includes(operationType)) ? "2px solid red": ""}}>
            {operationType}
        </OperationButton>
    ));
    return( <OperationBase>
        <h5 style = {{"paddingTop": "20px"}}>Operations</h5>
        {operationBoxes}
    </OperationBase>);
};

const GameInfo = ({chosenMode}: {chosenMode:string}) => {
    const questionType = ["SAT", "ACT", "GRE", "Normal"];
    const duration = (chosenMode !== "Head to Head");
    const numberOfQuestions = (chosenMode === "Group Play");
    const operations = (chosenMode === "Solo") ? ["+", "-", "*", "/"]: null;

    const [error, setError] = useState("");
    const [game, setGame] = useState({
        mode: chosenMode,
        questionType: "",
        duration: 0,
        operations: [],
        numberOfQuestions: 20,
    });

    const history = useHistory()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const onChange = (ev) => {
        setError('');

        if(ev.target.name === "questionType" && ev.target.value === game.questionType) {
            setGame({
                ...game,
                questionType: ""
            })
        } else if(ev.target.name === "operations") {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
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
        } else {
            setGame({
                ...game,
                [ev.target.name]: ev.target.value
            });
        }


        console.log(game);
    }

    const onSubmit = async (ev: { preventDefault: () => void; }) => {
        ev.preventDefault();
        console.log("Trying to submit!");

        if(game.questionType === "") {
            setError("Select question type");
            return;
        } else if(chosenMode === "Solo" && game.operations === []) {
            setError("Select operation types");
            return;
        } else if(chosenMode !== "Head To Head" && game.duration === 0) {
            setError("Enter > 0 duration");
            return;
        } else if (chosenMode === "Group Play" && game.numberOfQuestions === 0) {
            setError("Enter > 0 number of questions");
            return;
        }

        console.log(game);

        const res = await fetch('/api/v1/game/create', {
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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            history.push(`/game/${data.id}`)
        }

    }



    return (<GameInfoBase>
            {questionType ? (<QuestionButtons onChange={onChange} game = {game} questionTypes={questionType}/>): null}
            <DurationBase>
                {duration ? <h5 style = {{"paddingTop": "10px"}}>Duration</h5> : null}
                {duration ? (
                    <DurationInput
                        name = "duration"
                        value = {game.duration}
                        style = {{"fontWeight": "bold" , "fontSize": "18px"}}
                        onChange = {onChange}
                    />) : null}
                {operations ? (<OperationButtons operationTypes={operations} game = {game} onChange = {onChange}/>): null}
                {numberOfQuestions ? (<h5 style = {{"paddingTop": "20px"}}>Number of Questions</h5>) : null}
                {numberOfQuestions ? (
                    <DurationInput
                        name ="numberOfQuestions"
                        value = {game.numberOfQuestions}
                        onChange = {onChange}
                        style = {{"fontWeight": "bold" , "fontSize": "18px"}}/>) : null}
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
  color: black;
  background-color: #B5CEF3;
  max-height: 300px;
  padding: 10px;
  margin: 20px;
  width: fit-content;
`;

const JoinGame = () => {
    const [error, setError] = useState("");
    const [code, setCode] = useState<string>("");

    const onChange = (ev: { target: { value: React.SetStateAction<string>; }; }) => {
        setCode(ev.target.value);
    }
    const history = useHistory()

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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            history.push(`/game/${data.id}`);
        } else {
            setError("Invalid Game Code")
        }

    }

    return(<JoinGameBase>
        <DurationBase >
            <h5 style = {{"paddingTop": "10px"}}>Room Code</h5>
            <DurationInput
                value = {code}
                style = {{"fontWeight": "bold" , "fontSize": "18px" , "paddingBottom": "20px"}}
                onChange = {onChange}
            />
        </DurationBase>
        <CenteredButton style={{"fontSize": "18px","minWidth":0, "width": "50%", "height": "100%"}} onClick={onSubmit}>Join!</CenteredButton>
        <ErrorMessage msg = {error}/>
    </JoinGameBase>)


}
const GameGenBase = styled.div`
  grid-area: main;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 75px 330px 300px;
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-unused-vars
export const GameGen = (props: { history: History; }) => {
    //get game modes from database
    const [chosenMode, setMode] = useState("");

    const onClick = (event: { preventDefault: () => void; target: { id: React.SetStateAction<string>; }; }) => {
        event.preventDefault();
        console.log("calling onClick");
        console.log(event.target.id);
        setMode(event.target.id);
        console.log(chosenMode);
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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