'use strict';

import React from 'react';

export const Profile = ({currentUser} : {currentUser:string}) => {
    return(<h1>Profile for {currentUser}</h1>);
}