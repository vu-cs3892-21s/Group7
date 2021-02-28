'use strict';

import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const AccountOptionsBase = styled.div`
    & > a {
        padding: 6px 8px 6px 16px;
        text-decoration: none;
        font-size: 25px;
        color: white;
        display: block;
        font-family: revalia;
    }
    & > a:hover {
        color: #f1f1f1;
    }
`;

const AccountOptions = ({loggedIn}: {loggedIn:boolean}) => {
    return(<AccountOptionsBase>
            {loggedIn ?
                (<Fragment>
                    <Link to="/logout">Log Out</Link>
                </Fragment>)
                : (<Fragment>
                    <Link id="googleLink" to={"/googleAuth"}>Google Log In</Link>
                    <Link id="gitHubLink" to={"/gitHubAuth"}>GitHub Log In</Link>)
                </Fragment>)

            }
        </AccountOptionsBase>

    );
}

const SideBarOptionsBase = styled.div`
    & > a {
        padding: 6px 8px 6px 16px;
        text-decoration: none;
        font-size: 25px;
        color: white;
        display: block;
        font-family: revalia;
    }
`;
const SideBarOptions = ({loggedIn, username}: {loggedIn:boolean, username:string}) => {
    return (
        <SideBarOptionsBase>
            <Link id="playLink" style = {{"fontSize": 35}} to="/create">Play!</Link>
            <Link id="leaderBoard" to="/leadership">Leadership Board</Link>
            {loggedIn ? (<Link id="profile" to={`/profile/${username}`}>Profile</Link>): null};
        </SideBarOptionsBase>
    );
}

const SideBarBase = styled.div`
    height: 100%;
    grid-area: sb;
    background-color: #00538f;
    text-align: center;
`;
export const SideBar = ({loggedIn, username}: {loggedIn:boolean, username:string}) => {
    return(
        <SideBarBase>
            <img style={{"width": 180, "paddingBottom": 200}} src = "images/math.png"/>
            <SideBarOptions loggedIn = {loggedIn} username={username}/>
            <AccountOptions loggedIn = {loggedIn}/>
        </SideBarBase>);
}
