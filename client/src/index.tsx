"use strict";

import React, {useState} from "react";
import styled from 'styled-components'

import {SideBar} from "./components/sidebar";
import {Profile} from "./components/profile";
import {GameGen} from "./components/create";
import {GamePage} from "./components/game";
import {LeadershipBoard} from "./components/leadership";

import { BrowserRouter, Route, Redirect } from "react-router-dom";
import {render} from "react-dom";
import {CenteredDiv, HeaderWrap} from "./components/shared";



const GridBase = styled.div`
  positive: relative;
  display: grid;
  grid-template-columns: 180px 1fr 1fr;
  grid-template-rows: 75px 1fr 1fr;
  grid-template-areas:
      "sb top top"
      "sb main main"
      "sb main main";
  }
`;

const defaultUser = {
    username: "nobody",
    first_name: "",
    last_name: "",
    primary_email: "",
    city: "",
};

const App = () => {
    // If the user has logged in, grab info from sessionStorage
    const data = localStorage.getItem("user");
    const [state, setState] = useState(data ? JSON.parse(data) : defaultUser);

    // Helper to check if the user is logged in or not
    const loggedIn = () => {
        return state.username;
    };

    const logIn = async (ev: { preventDefault: () => void; target: { id: string; }; }) => {
        ev.preventDefault();
        const endpoint = `http://localhost:7070/api/v1/session/${ev.target.id}`;
        try {
            //use this for SSO so how do we do this...
            window.location.href = endpoint
            // const data = await response.json();
            // console.log(data)
            // console.log(response)
            const user = {
                // username: data.login,
                first_name: "",
                last_name: "",
                primary_email: "",
                city: "",
            }
            localStorage.setItem("user", JSON.stringify(user));
            setState(user);
        } catch (err) {
            alert("An unexpected error occurred.");
            logOut();
        }
    };

    // Helper for when a user logs out
    const logOut = () => {
        // Wipe localStorage
        localStorage.removeItem("user");
        // Reset user state
        setState(defaultUser);
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return (
        <BrowserRouter>
        <GridBase>
            <HeaderWrap>Multiplayer Math</HeaderWrap>
            <SideBar loggedIn = {loggedIn()} logIn={logIn} logOut={logOut} username ={state.username}/>
            <Route exact path="/" component={Landing} />
            <Route
                path="/profile"
                render = {p => {return <Profile currentUser = {state.username}/>}}
            />
            <Route
                path="/create"
                render={p => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    return <GameGen {...p.history} />;
                }}
            />
            <Route
                path="/game/:id"
                render={p => {return <GamePage {...p}/>;
                }}
            />
            <Route
                path="/leadership"
                render={p => <LeadershipBoard currentUser = {state.username} />}
            />
        </GridBase>
        </BrowserRouter>
    );
};

const Landing = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <CenteredDiv style={{"gridArea": "main", "fontSize" : "60px"}}>Welcome to our site!</CenteredDiv>;
};

render(<App />, document.getElementById("root"));
