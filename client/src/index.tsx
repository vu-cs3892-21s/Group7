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

import CssBaseline from "@material-ui/core/CssBaseline";
import {MuiThemeProvider, createMuiTheme, Theme} from "@material-ui/core/styles";
import {AppBar} from "@material-ui/core";
import { makeStyles, createStyles } from '@material-ui/core/styles';


// const themeLight = createMuiTheme({
//     palette: {
//         background: {
//             default: "#f4f7fc"
//         }
//     }
// });


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header:{
            backgroundColor: "#B5CEF3",
            minHeight: "100px",
            margin: "0px",
            width: "100vw",
            position: "fixed",
            // position: "relative",
            // zIndex: theme.zIndex.drawer + 1,
        },
    }),
);

const landingStyleTop = {
    lineHeight: "40vh",
    fontSize: "60px",
    fontFamily: "neuemachina-ultrabold",
    color: "white",
    width: "100vw",
}


const GridBase = styled.div`
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

    const classes = useStyles();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return (
        <BrowserRouter>
        <GridBase>
            {/*<MuiThemeProvider theme={themeLight}>*/}
            {/*    <CssBaseline />*/}
                {/*<AppBar  className={classes.header}>*/}
                {/*    Multiplayer Math*/}
                {/*</AppBar>*/}
            {/*<HeaderWrap>Multiplayer Math</HeaderWrap>*/}
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
            {/*</MuiThemeProvider>*/}
        </GridBase>
        </BrowserRouter>
    );
};

const Landing = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore

    return <div>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <CenteredDiv style = {landingStyleTop}>TRAIN YOUR BRAIN</CenteredDiv>
    </div>
    // <CenteredDiv style={{"gridArea": "main", "fontSize" : "100px"}}>Welcome to our site!</CenteredDiv>;
};

render(<App />, document.getElementById("root"));
