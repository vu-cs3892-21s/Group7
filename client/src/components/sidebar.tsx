'use strict';

import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from './shared';


const AccountOptionsBase = styled.div`
    grid-area: account;
    position: absolute;
    bottom: 0;
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
                    <Button id="gitHub" onClick={logIn}>GitHub Log In</Button>
                </Fragment>)

            }
        </AccountOptionsBase>

    );
}

const SideBarOptionsBase = styled.div`
    padding: 0 0 50px 0;
    grid-area: options;
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
            <Link id="leaderBoard" to="/leadership">Leadership <br/> Board </Link>
            {loggedIn ?
            (<Link id="profile" to={`/profile/${username}`}>Profile</Link>)
            : null}
        </SideBarOptionsBase>
    );
}

const SideBarBase = styled.div`
    height: 100vh;
    padding: 0 0 20px 0;
    grid-area: sb;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 40% 50% 10%;
    grid-template-areas:
      "pic"
      "options"
      "account";
    position: absolute;
    color: white;
    background-color: #00538f;
    text-align: center;
    overflow: auto;
    box-sizing: border-box;
    bottom: 0;
`;


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/ban-ts-comment
// @ts-ignore
export const SideBar = ({loggedIn, logIn, logOut, username}) => {
    return(
        <SideBarBase>
            <img style={{"gridArea" : "pic", "width": 180, "paddingBottom": 200}} src = {'../../images/math.png'}/>
            <SideBarOptions loggedIn = {loggedIn} username={username}/>
            <AccountOptions loggedIn = {loggedIn} logIn={logIn} logOut={logOut}/>
        </SideBarBase>);
}
