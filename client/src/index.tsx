"use strict";

import React, { useState } from "react";
import styled from "styled-components";

import { SideBar } from "./components/sidebar";
import { Profile } from "./components/profile";
import { GameGen } from "./components/create";
import { GamePage } from "./components/game";
import { LeadershipBoard } from "./components/leadership";
import { HashRouter, Route } from "react-router-dom";
import { render } from "react-dom";
import { CenteredDiv } from "./components/shared";
import { SocketContext, socket } from "./context/socket";
import { Theme } from "@material-ui/core/styles";
import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      backgroundColor: "#B5CEF3",
      minHeight: "100px",
      margin: "0px",
      width: "100vw",
      position: "fixed",
    },
  })
);

const landingStyleTop = {
  lineHeight: "40vh",
  fontSize: "60px",
  fontFamily: "neuemachina-ultrabold",
  color: "white",
  width: "100vw",
};

const GridBase = styled.div`
  positive: relative;
  font-family: Revalia, Sans-Serif;
  font-size: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 75px 1fr 1fr;
  grid-template-areas:
      "top top"
      "main main"
      "main main";
  }
`;

const defaultUser = {
  name: "",
  primary_email: "",
};

const App = () => {
  // If the user has logged in, grab info from sessionStorage
  const data = localStorage.getItem("user");
  const [state, setState] = useState(data ? JSON.parse(data) : defaultUser);

  // Helper to check if the user is logged in or not
  const loggedIn = (): string => {
    return state.primary_email;
  };

  const logIn = async (ev: {
    preventDefault: () => void;
    target: { offsetParent: { id: string } };
  }) => {
    ev.preventDefault();
    const endpoint = `http://localhost:5000/login/${ev.target.offsetParent.id}`;
    try {
      window.location.href = endpoint;
      const user = {
        // username: data.login,
        name: "",
        primary_email: "",
        color: "",
      };
      localStorage.setItem("user", JSON.stringify(user));
      setState(user);
    } catch (err) {
      alert("An unexpected error occurred.");
      logOut();
    }
  };

  const onLoggedIn = (): void => {
    fetch("/api/v1/session/profile")
      .then((res) => res.json())
      .then((data) => {
        setState(data);
        console.log("fetched profile info");
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  // Helper for when a user logs out
  const logOut = (): void => {
    // Wipe localStorage
    localStorage.removeItem("user");
    window.location.href = "http://localhost:7070/api/v1/session/logout";
    // Reset user state
    setState(defaultUser);
  };

  const classes = useStyles();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (
    <HashRouter>
      <GridBase>
        <SideBar
          loggedIn={loggedIn()}
          logIn={logIn}
          logOut={logOut}
          username={state.username}
        />
        <Route exact path="/" component={Landing} />
        <Route
          path="/profile"
          render={() => {
            return <Profile currentUser={state} onLoggedIn={onLoggedIn} />;
          }}
        />
        <Route
          path="/create"
          render={(p) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return <GameGen {...p.history} />;
          }}
        />
        <Route
          path="/game/:id"
          render={() => {
            return (
              <SocketContext.Provider value={socket}>
                <GamePage
                  userEmail={state.primary_email}
                  userName={state.name}
                />
              </SocketContext.Provider>
            );
          }}
        />
        <Route
          path="/leadership"
          render={() => <LeadershipBoard currentUser={state.username} />}
        />
      </GridBase>
    </HashRouter>
  );
};

const Landing = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (
    <div>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <CenteredDiv style={landingStyleTop}>TRAIN YOUR BRAIN</CenteredDiv>
    </div>
  );
};

render(<App />, document.getElementById("root"));