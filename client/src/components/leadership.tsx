'use strict';

import React from 'react';

export const LeadershipBoard = ({currentUser} : {currentUser:string}) => {
    return(<h1>Leadership Board for {currentUser}</h1>);
}