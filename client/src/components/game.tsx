'use strict';

import React, {useState} from 'react';
import styled from 'styled-components';
import {Button, FormInput, FormLabel} from "./shared";
import Timer from 'react-compound-timer';

//DATA NEEDED
//total number of questions - multiplayer
//question they were on - multiplayer
//total time per round - multiplayer
//array of players - multiplayer
//questions from database - multiplayer
//buffer of question

// ADD
// start button
// how to count down time
// how to dynamically move users
// when to grab questions

const QuestionBoxBase = styled.div`
    grid-area: question;
    display: grid;
    grid-template-rows: 1fr 3fr 1fr;
    grid-template-columns: 500px;
    grid-template-areas:
        top
        main
        answer
    background: #FFFFFF;
    border: 3px solid #000000;
    box-sizing: border-box;

`;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const QuestionBox = ({gameInfo, setGameInfo, question, onChange, onKeyDown, answer}) => {
    const onStart = () => {
        setGameInfo({
            ...gameInfo,
            start: true
        });
        //load question in here?
    };

    return (gameInfo.start ? (<QuestionBoxBase>
            <div style={{"gridArea":"top", "display": "flex-container", "flexDirection": "row"}}>
                <div style={{"flex": 1}}>Question {gameInfo.questionNumber} of {gameInfo.totalQuestions}</div>
                <Timer
                    initialTime={gameInfo.maxTime}
                    lastUnit="s"
                    direction="backward"
                    startImmediately={false}
                >
                    {() => (
                        <React.Fragment>
                            Time Remaining: <Timer.Seconds /> seconds
                        </React.Fragment>
                    )}
                </Timer>
            </div>
            <div style={{"gridArea":"main"}}>{question}</div>
            <AnswerBox onChange={onChange} onKeyDown={onKeyDown} answer={answer}/>
            </QuestionBoxBase>)
                :
            (<div style={{"gridArea": "question", "justifyContent": "center"}}>
                    <Button onClick={onStart}> Start Game!</Button>
            </div>)
    );
};

const AnswerBoxBase = styled.div`
  grid-area: answer;
  display: flex-container;
  flex-direction: row;
  border: 3px solid black;
  color: white;
`;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const AnswerBox = ({onChange, onKeyDown, answer}) => {
    return (
        <AnswerBoxBase>
            <FormLabel>Answer:</FormLabel>
            <FormInput
                id="answer"
                name="answer"
                onChange={onChange}
                onKeyDown={onKeyDown}
                value={answer}
            />
        </AnswerBoxBase>
    );
}

const ChatBase = styled.div`
    grid-area: chat;
    background: white;
    border: 3px solid black;
    box-sizing: border-box;
`;
const ChatBox = () => {
    return(<ChatBase>
        Question Box
    </ChatBase>);
}

const PlayerBox = styled.div`
    background: #FFFFFF;
    border: 1px solid #000000;
    box-sizing: border-box;
    display: flex-container;
    flex-direction: column;
`

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const Player = ({player}) => {
    return(
        <PlayerBox>
            <img style={{"flex": 1}}/>
            <div style={{"flex": 2}}>
                <div>{player.name}</div>
                <div>{player.score}</div>
            </div>
            <div style={{"flex": 1}}>#{player.rank}</div>
        </PlayerBox>)
};

const PlayerBase = styled.div`
    grid-area: players;
    background: white;
    justify-content: center;
    border: 3px solid black;
    box-sizing: border-box;
`;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const Players = ({players}) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const playerBoxes = players.map((player, i) => (
        <Player key={i} player={player}/>
    ));
    return(<PlayerBase>{playerBoxes}</PlayerBase>);
}

const GamePageBase = styled.div`
    grid-area: main;
    display: grid;
    grid-template-columns: 3fr 1fr;
    grid-template-rows: 2fr 1fr;
    grid-gap: 20px;
    grid-template-areas:
        question players
        chat chat
    background-color: #00538f;
`;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const GamePage = props => {
    //load in gameInfo

    const [gameInfo, setGameInfo] = useState({
        start: false,
        "mode": "alone",
        "maxTime": 20,
        "totalQuestions": 20,
        "questionNumber": 1,
    });

    //load in players
    const players = ["Tim", "Sam", "Evan", "Irisa"];

    //load in first question
    const [question, setQuestion] = useState([
        {"question": "How much wood could a wood chuck chuck if a wood chuck could chuck wood?", "answer": 50}
    ]);

    //user answer
    const [answer, setAnswer] = useState(0);

    const onChange = (ev: { target: { value: React.SetStateAction<number>; }; }) => {
        setAnswer(ev.target.value);
    };

    const onSubmit = () => {
        if(answer === question[0].answer) {
            //do something
            question.pop();
        } else{
            //notify incorrect
        }
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            onSubmit();
        }
    }

    return(<GamePageBase>
        <QuestionBox gameInfo={gameInfo} setGameInfo={setGameInfo} question={question[0].question} onChange={onChange} onKeyDown={onKeyDown} answer={answer}/>
        {gameInfo.mode !== "alone" ? (<Players players = {players}/>): null};
        {gameInfo.mode !== "alone" ? (<ChatBox/>): null};
    </GamePageBase>);
}