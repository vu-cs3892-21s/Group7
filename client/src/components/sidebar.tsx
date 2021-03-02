'use strict';

import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from './shared';

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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const AccountOptions = ({loggedIn, logIn, logOut}) => {

    return(<AccountOptionsBase>
            {loggedIn ?
                (<Fragment>
                    <Button id="logout" onClick={logOut}>Log Out</Button>
                </Fragment>)
                : (<Fragment>
                    <Button id="google" onClick={logIn}>Google Log In</Button>
                    <Button id="gitHub" onClick={logIn}>GitHub In</Button>
                </Fragment>)

            }
        </AccountOptionsBase>

    );
}

const SideBarOptionsBase = styled.div`
    padding: 0 0 50px 0;
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
            {loggedIn ?
            (<Link id="profile" to={`/profile/${username}`}>Profile</Link>)
            : null}
        </SideBarOptionsBase>
    );
}

const SideBarBase = styled.div`
    height: 100%;
    grid-area: sb;
    display: flex-container;
    flex-direction: column;
    color: white;
    background-color: #00538f;
    text-align: center;
`;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/ban-ts-comment
// @ts-ignore
export const SideBar = ({loggedIn, logIn, logOut, username}) => {
    return(
        <SideBarBase>
            <img style={{"width": 180, "paddingBottom": 200}} src = "../../images/math.png"/>
            <SideBarOptions loggedIn = {loggedIn} username={username}/>
            <AccountOptions loggedIn = {loggedIn} logIn={logIn} logOut={logOut}/>
        </SideBarBase>);
}
