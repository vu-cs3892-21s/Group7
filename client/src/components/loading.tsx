import React, { ReactElement } from "react";
import { CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
import { CenteredButton, CenteredDiv, HeaderWrap } from "./shared";

export const Loading = (): ReactElement => {
  console.log("hello");

  return (
    <CenteredDiv>
      <HeaderWrap>Waiting for match</HeaderWrap>
      <CircularProgress />
      <CircularProgress color="secondary" />
      <CenteredButton>
        <Link to="/create">Cancel</Link>
      </CenteredButton>
    </CenteredDiv>
  );
};
