'use strict';

import React, {useState} from 'react';
import styled from 'styled-components';
const GameModeBase = styled.div`
  grid-area: modes
  display: flex-container;
  max-height: 250px;
`;

const gameModes: { name: string, description: string, src: string }[] = [
    { "name": "Solo", "description": "Practice Math On Your Own", "src": "solo.png" },
    { "name": "Head to Head", "description": "Play With A Randomly Matched Foe", "src": "head.png" },
    { "name": "Group Play", "description": "Play With 2+ Friends In A Private Room", "src": "group.png"  }
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


const GameModeBlockBase = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  grid-template-areas: 
    'pic'
    'name'
    'description'
  padding: 2em;
  color: black;
`;

const GameModeImage = styled.img`
  grid-area: pic;
  max-width: 150px;
  padding: 1em;
`;

const GameModeBlock = ({gameMode, onClick}: {gameMode: { name: string, description: string, src: string }, onClick: (modeName: string)=>void}) => {
    //make the background the image?
    return(
    <GameModeBlockBase onClick = {() => onClick(gameMode.name)}>
        <GameModeImage src={`images/${gameMode.src}`}/>
        <div style={{"gridArea" : "name"}}>{gameMode.name}</div>
        <div style={{"gridArea" : "description"}}>{gameMode.description}</div>
    </GameModeBlockBase>);
}

const GameInfoBase = styled.div`
  grid-area: options;
  display: flex-container;
`;


const GameInfo = ({chosenMode}: {chosenMode:string}) => {
    return (<GameInfoBase>WORK IN PROGRESS! Want to play {chosenMode}</GameInfoBase>);
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

    const onClick = ({modeName}: {modeName:string}) => {
        setMode(modeName);
    };

    return(<GameGenBase>
        <GameMode gameModes = {gameModes} onClick={onClick}/>
        {chosenMode ? (<GameInfo chosenMode = {chosenMode}/>) : null}
    </GameGenBase>);
}