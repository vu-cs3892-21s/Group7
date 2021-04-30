import React, { ReactElement, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import { History } from "history";
import { CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
import { CenteredButton, CenteredDiv, HeaderWrap } from "./shared";
import { Socket } from "socket.io-client";
import { SocketContext } from "../context/socket";

export const Loading = (): ReactElement => {
  const socket: Socket = useContext(SocketContext);
  const history: History = useHistory();

  useEffect((): (() => void) => {
    socket.on("found_match", (id: string) => {
      history.push(`/game/${id}`);
    });
    return (): void => {
      socket.off("found_match");
    };
  }, [socket, history]);

  const onCancel = (): void => {
    socket.emit("cancel_match");
  };

  return (
    <CenteredDiv>
      <HeaderWrap style={{ color: "white"}}>Waiting for match</HeaderWrap>
      <CircularProgress style= {{"width": "80px", "height": "80px", "padding": "15px"}}/>
      <CenteredButton>
        <Link to="/create"
              style={{ color: "white"}}
              onClick={onCancel}>
          Cancel
        </Link>
      </CenteredButton>
    </CenteredDiv>
  );
};
