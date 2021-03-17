'use strict';

import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Box from '@material-ui/core/Box';

const drawerWidth = 180;

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
            background: "#00538F",
        },
        toolbar: theme.mixins.toolbar,
        playFormat: {
            color: "white",
            textAlign: "center",
            fontSize:'35px',
        },
        listFormat: {
            color: "white",
            textAlign: "center",
            fontSize:'22px',
        },
        tr: {
            '&:hover': {
                background: "#B5CEF3",
            },
        },

    }),
);

const SideBarOptions = ({loggedIn, username}: {loggedIn:boolean, username:string}) => {
    const classes = useStyles();
    return (
        <Box mt={10} mb={28}>
            <Link to={"/create"}>
            <ListItem button key = {"createlink"} className = {classes.tr}>
                <ListItemText classes = {{primary: classes.playFormat}} primary={"Play!"}/>
            </ListItem>
            </Link>
            <Link to={"/game/123"}>
                <ListItem button key = {"gamelink"} className = {classes.tr}>
                    <ListItemText classes = {{primary: classes.listFormat}} primary={"Game Page"}/>
                </ListItem>
            </Link>
            <Link to={"/leadership"}>
            <ListItem button key = {"Leadership Board"} className = {classes.tr}>
                <ListItemText classes = {{primary: classes.listFormat}} primary={"Leadership Board"} />
            </ListItem>
            </Link>
            {loggedIn ?
                <Link to={`/profile/${username}`}>
                    <ListItem button key = {"profile"} className = {classes.tr}>
                        <ListItemText classes = {{primary: classes.listFormat}} primary={"Profile"} />
                    </ListItem>
                </Link>
                : null
            }
        </Box>
    );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const AccountOptions = ({loggedIn, logIn, logOut}) => {
    const classes = useStyles();
    return(<List>
            {loggedIn ?
                (<Fragment>
                    <ListItem button key = {"logout"} className = {classes.tr} onClick={logOut}>
                        <ListItemText classes = {{primary: classes.listFormat}} primary={"Log Out"} />
                    </ListItem>
                </Fragment>)
                : (<Fragment>
                    <ListItem button key = {"google"} className = {classes.tr} onClick = {logIn}>
                        <ListItemText classes = {{primary: classes.listFormat}} primary={"Google Log In"} />
                    </ListItem>
                    <ListItem button key = {"github"} id = {"github"} className = {classes.tr} onClick={logIn}>
                        <ListItemText classes = {{primary: classes.listFormat}} primary={"Github Log In"} />
                    </ListItem>
                </Fragment>)
            }
        </List>

    );
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/ban-ts-comment
// @ts-ignore
export const SideBar = ({loggedIn, logIn, logOut, username}) => {
    const classes = useStyles();
    return (
        <div>
            <CssBaseline />
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
            >
                <div className={classes.toolbar} />
                <img style={{"gridArea" : "pic", "width": 180, "paddingBottom": 50}} src = {'../../images/math.png'}/>

                <SideBarOptions loggedIn = {loggedIn} username={username}/>

                <Divider />
                <AccountOptions loggedIn = {loggedIn} logIn={logIn} logOut={logOut}/>
            </Drawer>
        </div>
    );
}



// const AccountOptionsBase = styled.div`
//     grid-area: account;
//     position: absolute;
//     bottom: 0;
//     & > a {
//         padding: 6px 8px 6px 16px;
//         text-decoration: none;
//         font-size: 25px;
//         color: white;
//         display: block;
//         font-family: revalia;
//     }
//     & > a:hover {
//         color: #f1f1f1;
//     }
// `;
//
// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-ignore
// const AccountOptions = ({loggedIn, logIn, logOut}) => {
//
//     return(<AccountOptionsBase>
//             {loggedIn ?
//                 (<Fragment>
//                     <Button id="logout" onClick={logOut}>Log Out</Button>
//                 </Fragment>)
//                 : (<Fragment>
//                     <Button id="google" onClick={logIn}>Google Log In</Button>
//                     <Button id="gitHub" onClick={logIn}>GitHub Log In</Button>
//                 </Fragment>)
//
//             }
//         </AccountOptionsBase>
//
//     );
// }
//
// const SideBarOptionsBase = styled.div`
//     padding: 0 0 50px 0;
//     grid-area: options;
//     & > a {
//         padding: 6px 8px 6px 16px;
//         text-decoration: none;
//         font-size: 25px;
//         color: white;
//         display: block;
//         font-family: revalia;
//     }
// `;
// const SideBarOptions = ({loggedIn, username}: {loggedIn:boolean, username:string}) => {
//     return (
//         <SideBarOptionsBase>
//             <Link id="playLink" style = {{"fontSize": 35}} to="/create">Play!</Link>
//             <Link id="leaderBoard" to="/leadership">Leadership <br/> Board </Link>
//             {loggedIn ?
//             (<Link id="profile" to={`/profile/${username}`}>Profile</Link>)
//             : null}
//         </SideBarOptionsBase>
//     );
// }
//
// const SideBarBase = styled.div`
//     height: 100vh;
//     padding: 0 0 20px 0;
//     grid-area: sb;
//     display: grid;
//     grid-template-columns: auto;
//     grid-template-rows: 40% 50% 10%;
//     grid-template-areas:
//       "pic"
//       "options"
//       "account";
//     position: absolute;
//     color: white;
//     background-color: #00538f;
//     text-align: center;
//     overflow: auto;
//     box-sizing: border-box;
//     bottom: 0;
// `;
//
//
// // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/ban-ts-comment
// // @ts-ignore
// export const SideBar = ({loggedIn, logIn, logOut, username}) => {
//     return(
//         <SideBarBase>
//             <img style={{"gridArea" : "pic", "width": 180, "paddingBottom": 200}} src = {'../../images/math.png'}/>
//             <SideBarOptions loggedIn = {loggedIn} username={username}/>
//             <AccountOptions loggedIn = {loggedIn} logIn={logIn} logOut={logOut}/>
//         </SideBarBase>);
// }
