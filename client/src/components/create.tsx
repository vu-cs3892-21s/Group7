'use strict';

import React, {useState} from 'react';
import styled from 'styled-components';
const GameModeBase = styled.div`
  grid-area: modes;
  padding: 20px;
  display: grid;
  grid-template-columns: 33% 33% 33%;
  grid-template-rows: auto
  grid-template-areas: "1 2 3"
  max-height: 250px;
`;

const gameModes: { name: string, description: string, src: string }[] = [
    { name: "Solo", "description": "Practice Math On Your Own", "src": "solo.png" },
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
  grid-template-rows: 1fr 30px 70px;
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
  grid-area: options;
  display: flex-container;
  margin: 0 40px;
  text-align: center;
  justify-content: center;
  border: 3px solid black;
  color: black;
  background-color: #B5CEF3;
  min-height: 60px;
`;


const GameInfo = ({chosenMode}: {chosenMode:string}) => {
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

    return(<GameGenBase>
        <GameMode gameModes = {gameModes} onClick={onClick}/>
        {chosenMode ? (<GameInfo chosenMode = {chosenMode}/>) : null}
    </GameGenBase>);
}