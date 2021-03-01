'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const FormLabel = styled.label`
    font-family: Revalia;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 30px;
    display: flex;
    align-items: center;
    color: #000000;
`;

export const FormInput = styled.input`
  margin: 0.5em 0;
  padding-left: 5px;
  color: black;
`;

export const HeaderWrap = styled.div`
    grid-area: top;
    padding: 0px 10px;
    font-family: Revalia;
    font-style: normal;
    font-weight: normal;
    font-size: 48px;
    line-height: 60px;
    color: #B5CEF3;
`;

export const Button = styled.button`
  max-width: 200px;
  min-width: 150px;
  max-height: 2em;
  background: black;
  border-radius: 5px;
  line-height: 2em;
  font-size: 0.8em;
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
  color: black;
`;

export const ShortP = styled.p`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: black;
`;