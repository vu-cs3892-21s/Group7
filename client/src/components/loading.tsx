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
      <HeaderWrap>Waiting for match</HeaderWrap>
      <CircularProgress />
      <CircularProgress color="secondary" />
      <CenteredButton>
        <Link to="/create" onClick={onCancel}>
          Cancel
        </Link>
      </CenteredButton>
    </CenteredDiv>
  );
};
