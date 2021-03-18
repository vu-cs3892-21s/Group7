'use strict';

import React from 'react';

export const LeadershipBoard = ({currentUser} : {currentUser:string}) => {
    return(<h1 style={{"gridArea": "main", "padding": "10px 50px", "color": "white"}}>Leadership Board for {currentUser}</h1>);
}