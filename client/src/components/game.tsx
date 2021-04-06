'use strict';

import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {AnswerInput, AnswerLabel, CenteredDiv, CenteredButton} from "./shared";
import Timer from 'react-compound-timer';
import PersonIcon from '@material-ui/icons/Person';


const QuestionBoxBase = styled.div`
    position: relative;
    padding: 1em;
    grid-area: question;
    display: grid;
    grid-template-rows: 20% 60% 15%;
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
const QuestionBox = ({players, updatePlayers, gameInfo, setGameInfo}) => {

    const [status, setStatus] = useState<string>("");
    const [answer, setAnswer] = useState<string>(""); //user answer
    const [buttonText, setButtonText] = useState("Start Game!"); //button state
    const [endGame, setEndGame] = useState<boolean>(false); //game state

    const [question, setQuestions] = useState<{question:string, answer: string}[]>([
    ]);

    console.log(gameInfo)

    useEffect(() => {
        getQuestions()
    }, [])

    const onStart = () => {
        setGameInfo({
            ...gameInfo,
            start: true
        });
    };

    const getQuestions = async () => {
        const res = await fetch(`api/v1/game/${gameInfo.id}/questions`);
        if(res.ok) {
            const data = await res.json();
            setQuestions(data["questions"])
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
        setStatus("");
        setAnswer((ev.target.value.replace(/ /g,'')));
        console.log("Changing value!")
        console.log(answer);
    };

    const resetAfterQuestion = () => {
        setQuestions(question.slice(1));

        if(gameInfo.mode !== "alone") {
            if(question === [] || (gameInfo.questionNumber >= gameInfo.totalQuestions)) {
                return endOfGame();
            }
            setGameInfo({
                ...gameInfo,
                start: false,
                questionNumber: ++gameInfo.questionNumber
            });
        } else {
            setGameInfo({
                ...gameInfo,
                questionNumber: ++gameInfo.questionNumber
            });
        }
        setAnswer("");
        setStatus("");
        setButtonText("Next Question!");
    }

    const updateUserStats = async ({question, correct, time} : {question:string, correct: boolean, time:number}) => {

        const userInfo = {
            score: ++players[0].score,
            question: question,
            correct: correct,
            time: time,
            gameId: gameInfo.id
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

    const getScores = async () => {
        const res = await fetch('/v1/updatedScores', {
            method: 'GET',
            body: gameInfo.id,
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
            const newPlayers = players;
            newPlayers[0].score = ++newPlayers[0].score;
            updatePlayers(newPlayers);
            // await updateUserStats(question[0].question, true, 10);
            // let newPlayers = getScores();
            // updatePlayers(newPlayers);
            resetAfterQuestion();
            return true;
        } else {
            setStatus("Incorrect!");
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

    return (gameInfo.mode !== "alone") ? (<QuestionBoxBase>
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
                        Game Over! <br/> Your Score: {players[0].score} </CenteredDiv>) :
                        (<CenteredDiv style={{"position": "relative", "gridArea": "main", "alignItems": "center"}}>
                            <CenteredButton onClick={onStart}>{buttonText}</CenteredButton>
                        </CenteredDiv>))
            }
            <Status>{status}</Status>
            {gameInfo.start ? (<AnswerBox onChange={onChange} onKeyDown={onKeyDown} answer={answer} />) : null}
        </QuestionBoxBase>) :
        (
            <QuestionBoxBase>
                <div style={{"gridArea":"topQ"}}>Question {gameInfo.questionNumber}</div>
                <div style={{"gridArea":"topT", "textAlign": "right"}}>Number Correct: {players[0].score}</div>
                {gameInfo.start ? (<div style={{"gridArea":"main", "textAlign": "center", "fontSize": "18px"}}>{question[0].question}</div>) :
                    (<CenteredDiv style={{"position": "relative", "gridArea": "main", "alignItems": "center"}}>
                        <CenteredButton onClick={onStart}>{buttonText}</CenteredButton>
                    </CenteredDiv>)}
                <Status>{status}</Status>
                {gameInfo.start ? (<AnswerBox onChange={onChange} onKeyDown={onKeyDown} answer={answer}/>) : null}
            </QuestionBoxBase>
    )
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const AnswerBox = ({onChange, onKeyDown, answer}) => {
    return (
        <AnswerBoxBase>
            <AnswerLabel style = {{"textAlign": "right", "color": "white"}}>Answer:</AnswerLabel>
            <AnswerInput
                id="answer"
                type="text"
                name="answer"
                onChange={onChange}
                onKeyDown={onKeyDown}
                value={answer}
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
    padding: 10px;
    border: 5px solid white;
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
            setMessages([{sender: "Sam", text: myMessage}, ...messages])
        } else {
            updateMessage("");
            setMessages([{sender: "Sam", text: myMessage}, ...messages])
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
        <div style ={{"backgroundColor": "white", "borderRadius": "5px", "margin": "2px", "maxWidth": "95%"}}key={i}>
            {message.sender}: {message.text}
        </div>
    ));
    return(<div style={{"overflow": "scroll", "gridArea":"chat", "display":"flex", "flexDirection": "column-reverse"}}>{messageBox}</div>);

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
    padding-right: 30px;
    background: #B5CEF3;
    position: relative;
    border: 3px solid white;
    border-radius: 5px;
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
            <CenteredDiv style={{"gridArea": "player", "fontWeight": "bold","fontSize": "20px", "position": "relative"}}>{player.name}: {player.score}</CenteredDiv>
            <CenteredDiv style={{"fontSize": "40px", "gridArea": "rank", "textAlign": "right", "height": "75%", "position": "relative"}}>#{rank}</CenteredDiv>
        </PlayerBox>)
};

const PlayerBase = styled.div`
    grid-area: players;
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
    padding: 30px;
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

    const [gameInfo, setGameInfo] = useState({
        "id": props.match.params.id,
        "status": "",
        "mode": "",
        "maxTime": 20,
        "totalQuestions": 20,
        "questionNumber": 1,
    });

    useEffect(() => {
        async function setGameData() {
            const res = await fetch(`/api/v1/game/${props.match.params.id}`);
            if(res.ok) {
                const gameInfo = await res.json()
                setGameInfo({
                    ...gameInfo,
                    questionNumber: 1
                })
            }
        }
        setGameData()
    }, [])

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
        <QuestionBox players={players} updatePlayers={updatePlayers} gameInfo={gameInfo} setGameInfo={setGameInfo}/>
        {gameInfo.mode !== "alone" ? (<Players players = {players}/>): null}
        {gameInfo.mode !== "alone" ? (<ChatBox/>): null}
    </GamePageBase>);
}