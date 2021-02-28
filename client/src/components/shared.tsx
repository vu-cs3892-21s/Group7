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
    gridArea: top;
    padding: 0px 10px;
    font-family: Revalia;
    font-style: normal;
    font-weight: normal;
    font-size: 48px;
    line-height: 60px;
    color: #B5CEF3;
`;
