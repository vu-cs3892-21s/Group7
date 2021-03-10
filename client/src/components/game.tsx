'use strict';

import React, {useState} from 'react';
import styled from 'styled-components';
import {Button, AnswerInput, AnswerLabel} from "./shared";
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
    padding: 1em;
    grid-area: question;
    display: grid;
    grid-template-rows: 20% 65% 15%;
    grid-template-columns: auto;
    grid-template-areas:
        'topQ topT'
        'main main'
        'answer answer';
    background: #FFFFFF;
    min-height: 400px;
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

    console.log(gameInfo);
    console.log(gameInfo.start);

    return (<QuestionBoxBase>
            <div style={{"gridArea":"topQ"}}>Question {gameInfo.questionNumber} of {gameInfo.totalQuestions}</div>
            <div style={{"gridArea":"topT"}}>
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
            {gameInfo.start ? (<div style={{"gridArea":"main"}}>{question}</div>) :
                (<div style={{"gridArea": "main", "alignItems": "center"}}>
                    <Button onClick={onStart}> Start Game!</Button>
                </div>)
            }
            {gameInfo.start ? (<AnswerBox onChange={onChange} onKeyDown={onKeyDown} answer={answer}/>) : null}
        </QuestionBoxBase>);
};

const AnswerBoxBase = styled.div`
  grid-area: answer;
  border: 3px solid black;
  color: white;
  background-color: #00538f;
  padding: 10px;
`;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const AnswerBox = ({onChange, onKeyDown, answer}) => {
    return (
        <AnswerBoxBase>
            <AnswerLabel>Answer:</AnswerLabel>
            <AnswerInput
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
    margin: 5px;
    background: #00538f;
    border: 1px solid #000000;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 33% 33% 33%;
    grid-template-areas:
        'img player rank';
`

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const Player = ({player, rank}) => {
    return(
        <PlayerBox>
            <img style={{"gridArea": "img"}}/>
            <div style={{"gridArea": "player", "textAlign": "center", "margin": "20%"}}>
                <div>{player.name}</div>
                <div>{player.score}</div>
            </div>
            <div style={{"fontSize": "48px", "gridArea": "rank"}}>#{rank}</div>
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
    players.sort((a,b) => b.score - a.score);
    const playerBoxes = players.map((player: any, i: number) => (
        <Player key={i} player={player} rank={i+1}/>
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
        'question players'
        'chat chat';
    padding-left: 1em;
    padding-top: 1em;
`;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const GamePage = props => {
    const getMoreQs = async () => {
        const res = await fetch('v1/questions');
        if(res.ok) {
            const data = await res.json();
            setQuestions([...question, data])
        }
    }

    //useEffect to load in gameInfo & players

    //load in gameInfo
    const [gameInfo, setGameInfo] = useState({
        "start": false,
        "mode": "head",
        "maxTime": 20,
        "totalQuestions": 20,
        "questionNumber": 1,
    });

    //load in players
    const players = [
        {name: "Tim", score: 0},
        {name: "Sam", score: 10},
        {name: "Evan", score: 0},
        {name: "Irisa", score: 7}
    ]

    //load in first question
    const [question, setQuestions] = useState([
        {"question": "How much wood could a wood chuck chuck if a wood chuck could chuck wood?", "answer": 50},
        {"question": "3 times 5", "answer": 15},
        {"question": "3 plus 5", "answer": 8},
    ]);

    if (question.length < 5) {
        getMoreQs();
    }

    //user answer
    const [answer, setAnswer] = useState(0);

    const onChange = (ev: { target: { value: React.SetStateAction<number>; }; }) => {
        setAnswer(ev.target.value);
        console.log("Changing value!")
        console.log(answer);
    };

    const onSubmit = () => {
        console.log("trying submit")
        console.log(answer);
        console.log(question[0].answer);
        if(answer === question[0].answer) {
            //do something
            console.log("Correct Answer");
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
        {gameInfo.mode !== "alone" ? (<Players players = {players}/>): null}
        {gameInfo.mode !== "alone" ? (<ChatBox/>): null}
    </GamePageBase>);
}