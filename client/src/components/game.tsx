'use strict';

import React, {useState} from 'react';
import styled from 'styled-components';
import {FormInput, FormLabel} from "./shared";

//DATA NEEDED
//total number of questions
//question they were on
//total time per round
//array of players
//questions from database

//ADD
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
const QuestionBox = ({gameInfo, question, onChange, answer}) => {
    return (<QuestionBoxBase>
        <div style={{"gridArea":"top", "display": "flex-container"}}>
            <div style={{"flex": 1}}>Question {gameInfo.questionNumber} of {gameInfo.totalQuestions}</div>
            <div style={{"flex": 1}}>Time Remaining: {gameInfo.maxTime}</div>
        </div>
        <div style={{"gridArea":"main"}}>{question}</div>
        <AnswerBox onChange={onChange} answer={answer}/>
    </QuestionBoxBase>);
};

const AnswerBoxBase = styled.div`
  grid-area: answer;
  border: 3px solid black;
  color: white;
`;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const AnswerBox = ({onChange, answer}) => {
    return (
        <AnswerBoxBase>
            <FormLabel>Answer:</FormLabel>
            <FormInput
                id="answer"
                name="answer"
                onChange={onChange}
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

export const GamePage = () => {
    const gameInfo = {
        mode: "alone",
        maxTime: 20,
        totalQuestions:20,
        questionNumber: 1,
    }
    const players = ["Tim", "Sam", "Evan", "Irisa"];
    const question = "How much wood could a wood chuck chuck if a wood chuck could chuck wood?"

    const [answer, setAnswer] = useState('');

    const onChange = (ev: { target: { value: React.SetStateAction<string>; }; }) => {
        setAnswer(ev.target.value);
    };
    return(<GamePageBase>
        <QuestionBox gameInfo={gameInfo} question={question} onChange={onChange} answer={answer}/>
        {gameInfo.mode !== "alone" ? (<Players players = {players}/>): null};
        {gameInfo.mode !== "alone" ? (<ChatBox/>): null};
    </GamePageBase>);
}