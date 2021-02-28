"use strict";

import React from "react";
import {render} from "react-dom";
import styled from 'styled-components'

import {SideBar} from "./components/sidebar";
import {Profile} from "./components/profile";
import {GameGen} from "./components/create";
import {GamePage} from "./components/game";
import {LeadershipBoard} from "./components/leadership";
import {Login} from "./components/login";

import { BrowserRouter, Route, Redirect } from "react-router-dom";

const GridBase = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    "hd"
    "main"
    "ft";

  @media (min-width: 500px) {
    grid-template-columns: 180px auto auto auto;
    grid-template-rows: auto auto auto;
    grid-template-areas:
      "sb top top top"
      "sb main main main"
      "sb foot foot foot";
  }
`;

const App = () => {
    const loggedIn = true;
    const username = "nobody";

    return (
        <BrowserRouter>
        <GridBase>
            <SideBar loggedIn = {loggedIn} username ={username}/>
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

render(<App />, document.getElementById("root"));
