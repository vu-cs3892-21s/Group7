'use strict';

import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {AnswerInput, FunButton, InfoBlock, InfoData, InfoLabels, ShortP} from "./shared";
import PersonIcon from "@material-ui/icons/Person";



const ProfileBlockBase = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  color: white;
`;


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const ProfileBlock = ({userInfo}) => {

    const [edit, setEdit] = useState(false);
    const [editText, setEditText] = useState("Edit Profile");
    const [profile, updateProfile] = useState(userInfo);

    useEffect(() => updateProfile(userInfo), [userInfo]);

    const onChange = (ev: { target: { id: string; value: any; }; }) => {
        updateProfile({
            ...profile,
            [ev.target.id] : ev.target.value
        })
    }

    const saveProfile = async () => {
        const body = {
            id: profile.id,
            name: profile.name,
            primary_email: userInfo.primary_email,
            color: profile.color,
        };
        const res = await fetch('localhost:7070/api/v1/updateInfo', {
            method: 'POST',
            body: JSON.stringify(body),
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            }
        });
        if(!res.ok) {
            console.log("Could not update info");
        }
    }

    const onClick = () => {
        if(edit) {
            saveProfile().then(r => console.log("Tried to save profile"));
            setEdit(false);
            setEditText("Edit Profile")
        } else {
            setEdit(true);
            setEditText("Save Profile");
        }
    }

    return(
    <ProfileBlockBase>
        <div style={{"flex" : 1, "position": "relative"}}>
            <PersonIcon style={{"gridArea": "img", "width": "100%", "height": "100%", "fill": (profile.color)? (profile.color) : "white" }}/>
            <FunButton style={{"position": "absolute", "bottom": -20, "right": 0}}onClick={onClick}>{editText}</FunButton>
        </div>
        <InfoBlock style={{"flex" : 5, "position": "relative"}}>
            <InfoLabels>
                <p>Name:</p>
                <p>Email Address:</p>
                <p>Color:</p>
            </InfoLabels>
            <InfoData style={{"position": "relative"}}>
                {edit ?
                    (<AnswerInput
                    id="name"
                    type="text"
                    name="name"
                    onChange={onChange}
                    value={profile.name}
                    style = {{"margin": "0.5em", "height": "1.5em", "position": "relative"}}
                />) : <ShortP>{profile.name ? profile.name: "--"}</ShortP>}
                <ShortP>{profile.primary_email ? profile.primary_email: "--"}</ShortP>
                {edit ?
                <AnswerInput
                    id="color"
                    type="text"
                    name="color"
                    onChange={onChange}
                    value={profile.color}
                    style = {{"margin": "0.5em", "height": "1.5em", "position": "relative"}}
                /> : <ShortP>{profile.color ? profile.color: "--"}</ShortP>}
            </InfoData>
        </InfoBlock>
    </ProfileBlockBase>);
}

const StatsBoxBase = styled.div`
  flex: 1;
  padding: 1em;
  margin: 1em;
  display: flex-container;
  justify-content: center;
  text-align: center;
  background: white;
  justify-content: center;
  border: 3px solid black;
  border-radius: 100px;
`;

// TO DO: add circle for the stat
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const StatBox = ({stat}:{stat: (string | number)[]}) => {

    return(<StatsBoxBase>
        <div style={{"flex": 1, "fontWeight": "bold"}}>
            {stat[0]}
        </div>
        <div style={{"flex": 2}}>
            {stat[1]}
        </div>
    </StatsBoxBase>)
}
const StatsBlockBase = styled.div`
  flex: 2;
  display: flex;
  padding: 1em;
  justify-content: center;
  margin-top: 1em;
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
// @ts-ignore
const StatsBlock = ({userInfo, mode}) => {

    useEffect(() => {
        getStats().then(r=>
            updateStats(r)
        );
    }, [mode]);

    const getStats = async () => {
        console.log("changing stats");
        return ([
            ["Average Speed", (Math.random()*100).toPrecision(3)],
            ["Level", (Math.random()*100).toPrecision(3)],
            ["Ranking", (Math.random()*100).toPrecision(3)],
            ["Win Rate", (Math.random()*100).toPrecision(3)],
            ["Accuracy", (Math.random()*100).toPrecision(3)]
        ]);
        // const body = {
        //     primary_email: userInfo.primary_email,
        //     mode: mode
        // };
        // const res = await fetch('/v1/gameStats', {
        //     method: 'GET',
        //     body: JSON.stringify(body),
        //     credentials: 'include',
        //     headers: {
        //         'content-type': 'application/json'
        //     }
        // });
        // if(res.ok) {
        //     const data = await res.json();
        //     return data;
        // } else {
        //     console.log("Did not work!");
        //     return ([
        //         ["Average Speed", Math.random()*100],
        //         ["Level", Math.random()*100],
        //         ["Ranking", Math.random()*100],
        //         ["Win Rate", Math.random()*100],
        //         ["Accuracy", Math.random()*100]
        //     ]);
        // }
    };

    //grab all the user stats from given mode!
    const [stats, updateStats] = useState(
        [
            ["Average Speed", 20],
            ["Level", 30],
            ["Ranking", 20],
            ["Win Rate", 20],
            ["Accuracy", 20]
        ]);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const statsBoxes = stats.map((stat, i) => (
        <StatBox key={i} stat={stat}/>
    ));

    return(<StatsBlockBase>
        {statsBoxes}
    </StatsBlockBase>);
}

const ProfilePageBase = styled.div`
  grid-area: main;
  display: flex-container;
  flex-direction: column;
  justify-content: center;
  padding: 1em;
`;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const Profile : ReactStatelessComponent<Props> = ({currentUser, onLoggedIn}) => {
    const defaultMode = "Normal";
    const modes = ["Normal", "ACT", "GRE", "SAT"];
    const [mode, setMode] = useState(defaultMode);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const modeChange = (ev) => {
        setMode(ev.target.id);
    }

    const modeButtons = modes.map(m =>
        <FunButton style={{"backgroundColor": (mode === m) ? "#B5CEF3" : "#00538f"}} key={m} onClick={modeChange} id={m}>
            {m}
        </FunButton>);

    useEffect(() => {
        onLoggedIn();
    }, []);


    return(<ProfilePageBase>
        <ProfileBlock userInfo={currentUser}/>
        <div style={{"marginTop": "50px", "display": "flex", "flexDirection": "row"}}>{modeButtons}</div>
        <StatsBlock userInfo={currentUser} mode={mode}/>
    </ProfilePageBase>);
}