"use strict";

import React from "react";
import styled from 'styled-components'

import {SideBar} from "./components/sidebar";
import {Profile} from "./components/profile";
import {GameGen} from "./components/create";
import {GamePage} from "./components/game";
import {LeadershipBoard} from "./components/leadership";
import {Login} from "./components/login";

import { BrowserRouter, Route, Redirect } from "react-router-dom";
import {render} from "react-dom";
import {HeaderWrap} from "./components/shared";

const GridBase = styled.div`
  display: grid;
  grid-template-columns: 180px 1fr 1fr;
  grid-template-rows: 30px auto auto;
  grid-template-areas:
      "sb top top"
      "sb main main"
      "sb main main";
  }
`;

const App = () => {
    const loggedIn = true;
    const username = "nobody";

    return (
        <BrowserRouter>
        <GridBase>
            <HeaderWrap>Multiplayer Math</HeaderWrap>
            <SideBar loggedIn = {loggedIn} username ={username}/>
            <Route exact path="/" component={Landing} />
            <Route
                path="/login"
                render={p => {
                    return loggedIn ? (
                        <Redirect to={`/profile/${username}`} />
                    ) : (
                        <Login/>
                    );
                }}
            />
            <Route
                path="/profile/:username"
                render = {p => {return <Profile currentUser = {username}/>}}
            />
            <Route
                path="/create"
                render={p => {return loggedIn ? <GameGen /> : <Redirect to={"/login"} />;
                }}
            />
            <Route
                path="/game/:id"
                render={p => {return loggedIn ? <GamePage/> : <Redirect to={"/login"} />;
                }}
            />
            <Route
                path="/leadership"
                render={p => <LeadershipBoard currentUser = {username} />}
            />
        </GridBase>
        </BrowserRouter>
    );
};

const Landing = () => {
    return(<h1>Hello World</h1>);
};

render(<App />, document.getElementById("root"));
