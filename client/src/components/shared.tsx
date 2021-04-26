
'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";


export const useSharedStyles = makeStyles((theme: Theme) =>
    createStyles({
        toolbar: theme.mixins.toolbar,
        labelFormat: {
            fontSize: "24px",
            lineHeight: "30px",
            alignItems: "center",
            color: "#000000",
            paddingRight: "1em",
        },
        inputFormat: {
            paddingLeft: "5px",
            color: "black",
        },
        centeredFormat: {
            width: "50%",
            height: "50%",
            overflow: "auto",
            margin: "auto",
            textAlign: "center",
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
        },
        buttonFormat: {
            maxWidth: "200px",
            minWidth: "150px",
            maxHeight: "2em",
            background: "#00538f",
            lineHeight: "2em",
            fontSize: "25px",
            color: "white",
        },
        tr: {
            '&:hover': {
                background: "#B5CEF3",
            },
        },

    }),
);

export const CenteredDiv = styled.div`
    width: 100%;
    height: 50%;
    overflow: auto;
    margin: auto;
    text-align: center;
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
`;

export const AnswerLabel = styled.label`
    font-size: 24px;
    line-height: 30px;
    text-align: right;
    color: #000000;
    padding-right: 1em;
`;


export const AnswerInput = styled.input`
    padding-left: 5px;
    color: black;
    width: 50%;
    height: 70%;
    overflow: scroll;
    margin: auto;
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0
    `;




export const HeaderWrap = styled.div`
    grid-area: top;
    padding: 0px 10px;
    font-size: 48px;
    line-height: 60px;
    color: #B5CEF3;
    padding-left: 30px;
    padding-top: 20px;
`;

export const Button = styled.button`
  max-width: 200px;
  min-width: 150px;
  max-height: 2em;
  background: black;
  border-radius: 5px;
  line-height: 2em;
  font-size: 25px;
  color: white;
`;

export const FunButton = styled.button`
  max-width: 300px;
  min-width: 150px;
  max-height: 2em;
  background: #00538f;
  border-radius: 5px;
  font-size: 20px;
  color: white;
  width: 100%;
  height: auto;
  overflow: auto;
  box-shadow: 0 9px #999;
  &:hover {
    background-color: #b5cef3;
    box-shadow: 0 5px #666;
    transform: translateY(4px);
  }
  &:active {
    background-color: #b5cef3;
  }
`;

export const CenteredButton = styled.button`
  max-width: 300px;
  min-width: 200px;
  max-height: 2em;
  background:#00538f;
  border-radius: 5px;
  font-size: 25px;
  color: white;
  width: 50%;
  height: 50%;
  overflow: auto;
  margin: auto;
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  box-shadow: 0 9px #999;
  &:hover {
    background-color: #B5CEF3;
    box-shadow: 0 5px #666;
    transform: translateY(4px);
  }
  &:active{
    background-color: #B5CEF3;
  }
`;


export const InfoBlock = styled.div`
  display: grid;
  color: black;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto;
  grid-template-areas: 'labels info';
`;

export const InfoData = styled.div`
  grid-area: info;
  display: flex;
  color: black;
  flex-direction: column;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  & > p {
    margin: 0.5em 0.5em;
  }
  font-size: 1.05em;
`;

export const InfoLabels = styled(InfoData)`
  grid-area: labels;
  align-items: flex-end;
  font-weight: bold;
  color: white;
`;

export const ShortP = styled.p`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: white;
`;
