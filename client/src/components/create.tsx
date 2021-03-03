'use strict';

import React, {useState} from 'react';
import styled from 'styled-components';

const Header = styled.h2`
position: flex;
    padding-left: 75px;
    padding-top: 50px;
    margin-bottom: -80px;
    font: 70px;
    grid-area: title;
    font-family: revalia;
    
`;

const GameModeBase = styled.div`
  grid-area: modes;
  padding: 60px;
  display: grid;
  grid-template-columns: 33% 33% 33%;
  grid-template-rows: auto
  grid-template-areas: "1 2 3"
  max-height: 250px;
  // padding-top: 160px;
  padding-top: 0px;
  padding-bottom: 0px;
`;

const gameModes: { name: string, description: string, src: string }[] = [
    { name: "Solo", "description": "Practice Math On Your Own", "src": "/images/solo.png" },
    { name: "Head to Head", "description": "Play With A Randomly Matched Foe", "src": "head.png" },
    { name: "Group Play", "description": "Play With 2+ Friends In A Private Room", "src": "group.png"  }
];

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const GameMode = ({gameModes, onClick}) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const modeBoxes = gameModes.map((gameMode, i) => (
        <GameModeBlock key={i} gameMode={gameMode} onClick={onClick}/>
    ));
    return(<GameModeBase>{modeBoxes}</GameModeBase>);
}


const GameModeBlockBase = styled.button`
  display: grid;
  // grid-template-rows: 1fr 30px 70px;
    grid-template-rows: 1fr 40px 90px;

  grid-template-areas: 
    'pic'
    'name'
    'description';
  margin: 1em;
  border: 3px solid black;
  color: black;
  background-color: #B5CEF3;
  text-align: center;
`;

const GameModeImage = styled.img`
  grid-area: pic;
  max-width: 150px;
  padding: 1em;
`;
//gameMode: { name: string, description: string, src: string }
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const GameModeBlock = ({ gameMode, onClick}) => {
    //make the background the image?
    console.log(gameMode);
    return(
    <GameModeBlockBase id={gameMode.name} onClick = {onClick}>
        <GameModeImage src={`images/${gameMode.src}`}/>
        <div style={{"gridArea" : "name", "fontWeight": "bold" , "fontSize": "18px"}}>{gameMode.name}</div>
        <div style={{"gridArea" : "description"}}>{gameMode.description}</div>
    </GameModeBlockBase>);
}

const GameInfoBase = styled.div`
   display:grid;
   grid-template-columns: 50% 50%;
   grid-template-areas: 
      'type duration';
  // grid-area: options;
  // display: flex-container;
  margin: 0 40px;
  text-align: center;
  justify-content: center;
  border: 3px solid black;
  color: black;
  background-color: #B5CEF3;
  // min-height: 90px;
  max-height: 400px;
  padding-top: -100px;
  width: 40vw;
  margin:auto;
`;

const QuestionsBase = styled.div`
  grid-area: type;
  padding: 10px;
  display: grid;
  justify-items: center;
  grid-template-rows: 20% 20% 20% 20%;
`;


const QuestionsButton = styled.button`
    height: 50px;
    width: 100px;
    border: 2px solid black;
    background-color: white; 
`;

const DurationInput = styled.input`
    height: 50px;
    width: 100px;
    border: 2px solid black;
    background-color: white; 
    padding-top: 50px;
`;

const DurationBase = styled.div`
   // display:grid;
   grid-area: duration;
   grid-template-rows: 50% 25% 25%;
   grid-template-areas: 'duration'
   'operation'
   'operation'
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
        'operation operation'
        'operation operation'
    justify-items:center;
    padding: 0px;
`;



const GameInfo = ({chosenMode}: {chosenMode:string}) => {
    // const mode;
    if(chosenMode === "Solo"){
        return (<GameInfoBase>
            <QuestionsBase>
                <h5>Question <br/> Type</h5>
                <QuestionsButton style = {{"fontWeight": "bold" , "fontSize": "18px"}}>SAT</QuestionsButton>
                <QuestionsButton style = {{"fontWeight": "bold" , "fontSize": "18px"}}> ACT</QuestionsButton>
                <QuestionsButton  style = {{"fontWeight": "bold" , "fontSize": "18px"}}>GRE</QuestionsButton>
                <QuestionsButton  style = {{ "fontWeight": "bold" , "fontSize": "18px"}}>Normal</QuestionsButton>
            </QuestionsBase>
            <DurationBase>
                <h5 style = {{"paddingTop": "30px"}}>Duration</h5>
                <DurationInput style = {{"fontWeight": "bold" , "fontSize": "18px"}}></DurationInput>
                <OperationBase>
                    <h5>Operations</h5>
                    <OperationButton style = {{"fontWeight": "bold" , "fontSize": "18px"}}>+</OperationButton>
                    <OperationButton style = {{"fontWeight": "bold" , "fontSize": "18px"}}>-</OperationButton>
                    <OperationButton style = {{"fontWeight": "bold" , "fontSize": "18px"}}>*</OperationButton>
                    <OperationButton style = {{"fontWeight": "bold" , "fontSize": "18px"}}>/</OperationButton>
                </OperationBase>
            </DurationBase>
        </GameInfoBase>);
    }
    else
    return (<GameInfoBase>
        <h5>WORK IN PROGRESS! Want to play {chosenMode}</h5>
        </GameInfoBase>);
};

const GameGenBase = styled.div`
  grid-area: main;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  grid-template-areas: 
  'title'
    'modes'
    'options' 
`;


export const GameGen = () => {
    //get game modes from database

    const [chosenMode, setMode] = useState("");

    const onClick = (event: { preventDefault: () => void; target: { id: React.SetStateAction<string>; }; }) => {
        event.preventDefault();
        console.log("calling onClick");
        console.log(event.target.id);
        setMode(event.target.id);
        console.log(chosenMode);
    };

    console.log(gameModes);

    return(
        <GameGenBase>
            <Header> Select Game Mode</Header>
        <GameMode gameModes = {gameModes} onClick={onClick}/>
        {chosenMode ? (<GameInfo chosenMode = {chosenMode}/>) : null}
    </GameGenBase>);
}