'use strict';

import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Button, InfoBlock, InfoData, InfoLabels, ShortP} from "./shared";



const ProfileBlockBase = styled.div`
  flex: 1;
  display: flex-container;
  flex-direction: row;
  justify-content: center;
`;


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const ProfileBlock = ({userInfo}) => {
    return(
    <ProfileBlockBase>
        <div style={{"flex" : 1}}>
            PROFILE PICTURE
        </div>
        <InfoBlock style={{"flex" : 2}}>
            <InfoLabels>
                {/* <p>Username:</p>
                <p>First Name:</p>
                <p>Last Name:</p>
                <p>City:</p> */}
                <p>Name:</p>
                <p>Email Address:</p>
            </InfoLabels>
            <InfoData>
                {/* <ShortP>{userInfo.username ? userInfo.username :"--"}</ShortP>
                <ShortP>{userInfo.first_name ? userInfo.first_name: "--"}</ShortP>
                <ShortP>{userInfo.last_name ? userInfo.last_name: "--"}</ShortP>
                <ShortP>{userInfo.city ? userInfo.city: "--"}</ShortP> */}
                <ShortP>{userInfo.name ? userInfo.name: "--"}</ShortP>
                <ShortP>{userInfo.primary_email ? userInfo.primary_email: "--"}</ShortP>
            </InfoData>
        </InfoBlock>
    </ProfileBlockBase>);
}

const StatsBoxBase = styled.div`
  grid-area: stats;
  padding: 1em;
  display: flex-container;
  justify-content: center;
  background: white;
  justify-content: center;
  border: 3px solid black;
`;

// TO DO: add circle for the stat
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const StatBox = ({stat}) => {
    return(<StatsBoxBase>
        <div style={{"flex": 1}}>
            {[stat]}
        </div>
        <div style={{"flex": 2}}>
            {stat}
        </div>
    </StatsBoxBase>)
}
const StatsBlockBase = styled.div`
  flex: 2;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 75px auto;
  grid-template-areas: 
  'button' 
  'stats'
  padding: 1em;
  justify-content: center;
`;

const ModeButtonsBase = styled.div`
  grid-area: button;
  display: flex-container;
  flex-direction: row;
  justify-content: center;
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
// @ts-ignore
const StatsBlock = ({username, mode, setMode}) => {

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const changeMode = (ev) => {
        setMode(ev.target.id);
    };

    //grab the modes
    const modes = ["Normal", "GRE", "ACT"];

    //grab all the user stats from given mode!
    const stats = {
        "Average Speed": 20,
        "Level": 30,
        "Ranking" : 20,
        "Win Rate" : 20,
        "Accuracy" : 20,
    };

    const modeButtons = modes.map((mode, i) => (
        <Button onClick={changeMode} key={i} id={mode}>{mode}</Button>
    ));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const statsBoxes = stats.map((stat, i) => (
        <StatBox key={i} stat={stat}/>
    ));

    return(<StatsBlockBase>
        <ModeButtonsBase>{modeButtons}</ModeButtonsBase>
        {statsBoxes}
    </StatsBlockBase>);
}

const ProfilePageBase = styled.div`
  grid-area: main;
  display: flex-container;;
  flex-direction: column;
  justify-content: center;
  padding: 1em;
`;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const Profile : ReactStatelessComponent<Props> = ({currentUser, onLoggedIn}) => {
    const defaultMode = "Normal";
    const [mode, setMode] = useState(defaultMode);

    useEffect(() => {
        onLoggedIn();
    }, [])


    return(<ProfilePageBase>
        <ProfileBlock userInfo={currentUser}/>
        <StatsBlock username={currentUser.username} mode={mode} setMode={setMode}/>
    </ProfilePageBase>);
}