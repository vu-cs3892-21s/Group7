'use strict';

import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Button, AnswerInput, AnswerLabel, CenteredDiv, CenteredButton, useSharedStyles} from "./shared";
import Timer from 'react-compound-timer';
import PersonIcon from '@material-ui/icons/Person';


const QuestionBoxBase = styled.div`
    position: relative;
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
const QuestionBox = ({me, updateMe, gameInfo, setGameInfo}) => {

    const classes = useSharedStyles();
    const [answer, setAnswer] = useState<number>(NaN); //user answer
    const [buttonText, setButtonText] = useState("Start Game!"); //button state
    const [endGame, setEndGame] = useState<boolean>(false); //game state

    const [question, setQuestions] = useState<{question:string, answer: number}[]>([
        {"question": "3 times 5", "answer": 15},
        {"question": "3 plus 5", "answer": 8},
        {"question": "4 times 5", "answer": 20},
        {"question": "3 plus 3", "answer": 6},
        {"question": "5 minus 1", "answer": 4},
        {"question": "3 minus 6", "answer": -3},
        {"question": "3 times 2", "answer": 6},
        {"question": "5 plus 5", "answer": 10},
        {"question": "8 times 5", "answer": 40},
        {"question": "3 plus 19", "answer": 22},
        {"question": "5 minus 26", "answer": -21},
        {"question": "54 minus 6", "answer": 48},
        {"question": "21 minus 1", "answer": 20},
        {"question": "12 divided by 6", "answer": 2},
        {"question": "3 times 19", "answer": 57},
        {"question": "5 plus 17", "answer": 22},
        {"question": "8 times 12", "answer": 96},
        {"question": "29 plus 12", "answer": 41},
        {"question": "10 minus 17", "answer": -7},
        {"question": "50 minus 27", "answer": 23},
    ]);

    useEffect(() => {
        getMoreQs()
    }, [question.length < 20])

    const onStart = () => {
        setGameInfo({
            ...gameInfo,
            start: true
        });
    };

    const getMoreQs = async () => {
        const res = await fetch('v1/questions');
        if(res.ok) {
            const data = await res.json();
            setQuestions([...question, data])
        }
    }

    const endOfGame = () => {
        setGameInfo({
            ...gameInfo,
            start: false
        });
        setEndGame(true);
    }

    const onChange = (ev: { target: { value: string; }; }) => {
        setAnswer(parseInt(ev.target.value));
        console.log("Changing value!")
        console.log(answer);
    };

    const resetAfterQuestion = () => {
        setQuestions(question.slice(1));
        if(question === [] || (gameInfo.questionNumber >= gameInfo.totalQuestions)) {
            return endOfGame();
        }
        setGameInfo({
            ...gameInfo,
            start: false,
            questionNumber: ++gameInfo.questionNumber
        });
        setAnswer(NaN);
        setButtonText("Next Question!");
    }

    const updateUserStats = async ({question, correct, time}: {question:string, correct: boolean, time:number}) => {

        const userInfo = {
            username: "Sam",
            question: question,
            correct: correct,
            time: time
        };

        const res = await fetch('/v1/userStats', {
            method: 'POST',
            body: JSON.stringify(userInfo),
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            }
        });

        if(res.ok) {
            console.log("Updated Stats");
        } else {
            console.log("Error: could not update user stats");
        }
    }

    const onSubmit = () => {
        console.log("Trying submit")
        if(answer === question[0].answer) {
            console.log("Correct Answer");
            updateMe({
                ...me,
                score: ++me.score
            })

            resetAfterQuestion();
            return true;
        } else {
            console.log("Incorrect");
            return false;
        }
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            onSubmit();
        }
    }

    const timeFinish = () => {
        console.log("Out of Time!");
        //will check the current answer and get ready for the next question
        if(!onSubmit()) {
            resetAfterQuestion();
        }
    };

    return (<QuestionBoxBase>
            <div style={{"gridArea":"topQ"}}>Question {gameInfo.questionNumber} of {gameInfo.totalQuestions}</div>
            <div style={{"gridArea":"topT", "textAlign": "right"}}>
                {gameInfo.start ? (
                    <Timer
                        initialTime={gameInfo.maxTime*1000}
                        direction="backward"
                        checkpoints={[
                            {
                                time: 0 ,
                                callback: () => timeFinish(),
                            }
                        ]}
                    >
                    {() => (
                        <React.Fragment>
                            Time Remaining: <Timer.Seconds /> seconds
                        </React.Fragment>
                    )}
                </Timer>): (
                        <React.Fragment>
                            Time Remaining: {gameInfo.maxTime} seconds
                        </React.Fragment>) }
            </div>
            {gameInfo.start ? (<div style={{"gridArea":"main", "textAlign": "center", "fontSize": "18px"}}>{question[0].question}</div>) :
                (endGame ? (<CenteredDiv style={{"gridArea":"main", "fontWeight": "bold", "fontSize": "32px"}}>
                        Game Over! <br/> Your Score: {me.score} </CenteredDiv>) :
                        (<CenteredDiv style={{"position": "relative", "gridArea": "main", "alignItems": "center"}}>
                            <CenteredButton onClick={onStart}>{buttonText}</CenteredButton>
                        </CenteredDiv>))
            }
            {gameInfo.start ? (<AnswerBox onChange={onChange} onKeyDown={onKeyDown} answer={answer}/>) : null}
        </QuestionBoxBase>);
};

const AnswerBoxBase = styled.div`
  grid-area: answer;
  position: relative;F
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
                type="number"
                name="answer"
                onChange={onChange}
                onKeyDown={onKeyDown}
                value={(answer !== NaN) ? answer: ""}
            />
        </AnswerBoxBase>
    );
}

const ChatBase = styled.div`
    max-height: 300px;
    grid-area: chat;
    display: grid;
    grid-template-rows: 75% 20%;
    grid-gap: 5%;
    grid-template-columns: 100%;
    grid-template-areas:
        'chat'
        'type';
    background-color: #B5CEF3;
    padding: 10px;
    border: 3px solid black;
    box-sizing: border-box;
`;
const ChatBox = () => {
    const [messages, setMessages] = useState<{sender:string, text:string}[]>([]);
    const [myMessage, updateMessage] = useState<string>("");

    useEffect(() => {
        setMessages([
                {sender: "Tim", text: "Hi"},
                {sender: "Sam", text: "Hi"},
                {sender: "Irisa", text: "Sup"},
                {sender: "Evan", text: "Hello"},
                {sender: "Tim", text: "You're going down!"},
                {sender: "Sam", text: "No YOU"},
                {sender: "Evan", text: "Calm down..."},
            ]
        );
    }, []);

    const onChange = (ev: { target: { value: React.SetStateAction<string>; }; }) => {
        updateMessage(ev.target.value);
    }

    const onSubmit = async (ev: { preventDefault: () => void; }) => {
        ev.preventDefault();

        const body = {
            username: "Sam",
            message: myMessage,
        };

        const res = await fetch('/v1/message', {
            method: 'POST',
            body: JSON.stringify(body),
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            }
        });
        if(res.ok) {
            setMessages([...messages, {sender: "Sam", text: myMessage}])
        } else {
            updateMessage("");
            setMessages([...messages, {sender: "Sam", text: myMessage}])
        }
    }



    return(<ChatBase>
        <MessageList messages={messages} />
        <SendMessageForm onChange={onChange} onSubmit={onSubmit} myMessage={myMessage}/>
    </ChatBase>);
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const MessageList = ({messages}) => {
    const messageBox = messages.map((message: {sender:string, text:string}, i:number) => (
        <div style ={{"backgroundColor": "white", "borderRadius": "5px", "margin": "5px", "maxWidth": "50%"}}key={i}>
            {message.sender}: {message.text}
        </div>
    ));
    return(<div style={{"overflow": "scroll", "gridArea":"chat"}}>{messageBox}</div>);

};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const SendMessageForm = ({onChange, onSubmit, myMessage}) => {
    return (
        <form style ={{"position": "relative","gridArea":"type", "alignContent":"right"}}
            onSubmit={onSubmit}
            className="send-message-form">
            <AnswerInput
                style={{"textAlign": "right", "width": "100%"}}
                onChange={onChange}
                value={myMessage}
                placeholder="Type your message and hit ENTER"
                type="text" />
        </form>
    );
};

const PlayerBox = styled.div`
    margin: 5px;
    background: #B5CEF3;
    position: relative;
    border: 3px solid #000000;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 25% 45% 30%;
    grid-template-areas:
        'img player rank';
`

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const Player = ({player, rank}) => {
    return(
        <PlayerBox>
            <PersonIcon style={{"gridArea": "img", "width": "100%", "height": "100%", "fill": player.color }}/>
            <CenteredDiv style={{"gridArea": "player", "fontWeight": "bold","fontSize": "20px"}}>{player.name}: {player.score}</CenteredDiv>
            <CenteredDiv style={{"fontSize": "40px", "gridArea": "rank", "textAlign": "right", "height": "100%"}}>#{rank}</CenteredDiv>
        </PlayerBox>)
};

const PlayerBase = styled.div`
    grid-area: players;
    background:#00538f;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
    border-radius: 5px;
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
    grid-template-rows: 2fr 250px;
    grid-gap: 20px;
    grid-template-areas:
       'question players'
        'chat players';
    padding-left: 1em;
    padding-top: 1em;
`;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const GamePage = props => {
    //useEffect to load in gameInfo & players
    //load in gameInfo

    const loadInGameInfo = async () => {
        const res = await fetch('/v1/game', {
            method: 'POST',
            body: props.$id,
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            }
        });

        if(res.ok) {
            const gameInfo = await res.json()
            return gameInfo;
        }
    }

    const [gameInfo, setGameInfo] = useState({
        "start": false,
        "mode": "head",
        "maxTime": 20,
        "totalQuestions": 20,
        "questionNumber": 1,
    });

    //load in my info
    const [me, updateMe] = useState<{name: string, score: number, color: string}>({name: "Sam", score: 0, color: "red"});

    const loadInPlayerInfo = async () => {
        const res = await fetch('/v1/players', {
            method: 'POST',
            body: props.$id,
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            }
        });

        if (res.ok) {
            const playerInfo = await res.json();
            return playerInfo;
        }
    }

    //load in my opponents info players
    const [players, updatePlayers] = useState<{name: string, score: number, color: string}[]>((gameInfo.mode !== "alone") ? [
        me,
        {name: "Tim", score: 0, color: "pink"},
        {name: "Evan", score: 0, color: "blue"},
        {name: "Irisa", score: 0, color: "green"}
    ] : [me]);

    return(<GamePageBase>
        <QuestionBox me={me} updateMe={updateMe} gameInfo={gameInfo} setGameInfo={setGameInfo}/>
        {gameInfo.mode !== "alone" ? (<Players players = {players}/>): null}
        {gameInfo.mode !== "alone" ? (<ChatBox/>): null}
    </GamePageBase>);
}