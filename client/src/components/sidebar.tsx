'use strict';

import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

// import styled from 'styled-components';
// import { Button } from './shared';


import { createStyles, Theme, makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';



const drawerWidth = "100%";

//const drawerWidth = 180;


export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
    //     drawer: {
    //         width: drawerWidth,
    //         flexShrink: 0,
    //         height:"100vh,"
    //     },
    //     drawerPaper: {
    //         width: drawerWidth,
    //         background: "#00538F",
    //         height: "100vh",
    //     },
    //     toolbar: theme.mixins.toolbar,
    //     playFormat: {
    //         color: "white",
    //         textAlign: "center",
    //         fontSize:'35px',
    //     },
    //     listFormat: {
    //         color: "white",
    //         textAlign: "center",
    //         fontSize:'22px',
    //     },
    //     tr: {
    //         '&:hover': {
    //             background: "#B5CEF3",
    //         },
    //     },
    //
    // }),

        root: {
            display: 'flex',
        },
        appBar: {
            height:"9vh",
            background: "transparent",
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginRight: drawerWidth,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginLeft: theme.spacing(2),
        },
        hide: {
            display: 'none',
        },
        header:{
            marginTop: "20px",
            paddingRight: "90vw",
            paddingLeft: "10px",
            fontSize:'15px',
            fontFamily: "'Playfair Display', serif",
            width: "20vw",
            fontWeight: "bold"
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            height:"100vh,"
        },
        drawerPaper: {
            // width: drawerWidth,
            // // background: "#00538F",
            // background: "transparent",
            // // background: "#bbccfd",
            // height: "100vh",
            width: '100vw',
            height: '100vh',
            backgroundImage: `url(https://hdwallpaperim.com/wp-content/uploads/2017/09/16/50906-low_poly-wireframe-poly.jpg)`,
            backgroundSize: 'cover'
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: 0,
        },
        playFormat: {
            color: "white",
            textAlign: "center",
            fontSize:'40px',
            fontFamily: "'Playfair Display', serif",
        },
        listFormat: {
            color: "white",
            textAlign: "center",
            fontSize:'27px',
            fontFamily: "'Playfair Display', serif",
        },
        chevronIcon: {
            color: "white",
            height: "4vh",
            width: "4vh",
        },
        buttonFormat :{
            background: "transparent",
            border: "none",
            textAlign: "center",
            height: 0,
        },
    }),

);

const SideBarOptions = ({loggedIn, username}: {loggedIn:boolean, username:string}) => {
    const classes = useStyles();
    return (

        <Box mt={35} mb={32}>
            <Link to={"/create"}>
            {/*<ListItem button key = {"playlink"} className = {classes.tr}>*/}
            <ListItem button key = {"createLink"}>
                <ListItemText classes = {{primary: classes.playFormat}} primary={"PLAY!"}/>

        //<Box mt={10} mb={28}>
         //   <Link to={"/create"}>
         //   <ListItem button key = {"createlink"} className = {classes.tr}>
         //       <ListItemText classes = {{primary: classes.playFormat}} primary={"Play!"}/>

            </ListItem>
            </Link>
            <Link to={"/game/123"}>
                <ListItem button key = {"gamelink"} className = {classes.tr}>
                    <ListItemText classes = {{primary: classes.listFormat}} primary={"Game Page"}/>
                </ListItem>
            </Link>
            <Link to={"/leadership"}>
            <ListItem button key = {"Leadership Board"}>
                <ListItemText classes = {{primary: classes.listFormat}} primary={"LEADERSHIP BOARD"} />
            </ListItem>
            </Link>
            {loggedIn ?
                <Link to={`/profile/${username}`}>
                    <ListItem button key = {"profile"}>
                        <ListItemText classes = {{primary: classes.listFormat}} primary={"PROFILE"} />
                    </ListItem>
                </Link>
                : null
            }
        </Box>
    );
}

const AccountOptions = ({loggedIn, logIn, logOut}) => {
    const classes = useStyles();
    return(<List>
            {loggedIn ?
                (<Fragment>
                    <ListItem button key = {"logout"} onClick={logOut}>
                        <ListItemText classes = {{primary: classes.listFormat}} primary={"LOG OUT"} />
                    </ListItem>
                </Fragment>)
                : (<Fragment>
                    <ListItem button key = {"google"} onClick = {logIn}>
                        <ListItemText classes = {{primary: classes.listFormat}} primary={"GOOGLE LOG IN"} />
                    </ListItem>
                    <ListItem button key = {"github"} onClick={logIn}>
                        <ListItemText classes = {{primary: classes.listFormat}} primary={"GITHUB LOG IN"} />
                    </ListItem>
                </Fragment>)
            }
        </List>

    );
}

export const SideBar = ({loggedIn, logIn, logOut, username}) => {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    return (
        // <div>
        //     <CssBaseline />
        //     <Drawer
        //         className={classes.drawer}
        //         variant="permanent"
        //         classes={{
        //             paper: classes.drawerPaper,
        //         }}
        //         anchor="left"
        //     >
        //         <div className={classes.toolbar} />
        //         <img style={{"gridArea" : "pic", "width": 180, "paddingBottom": 200}} src = {'/images/math.png'}/>
        //         <SideBarOptions loggedIn = {loggedIn} username={username}/>
        //
        //         <Divider />
        //         <AccountOptions loggedIn = {loggedIn} logIn={logIn} logOut={logOut}/>
        //     </Drawer>
        // </div>
        <div className={classes.root} style = {divStyle}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <Typography className = {classes.header}>MENTAL MATH</Typography>
                    <IconButton style = {{"textAlign": "right"}}
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon style = {{"justifyContent": "right"}}/>
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="right"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >

                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronRightIcon className = {classes.chevronIcon}/> : <ChevronLeftIcon />}
                    </IconButton>
                    {/*<img style={{"gridArea" : "pic", "width": 180, "paddingBottom": 200}} src = {require('/images/math.png')}/>*/}
                </div>

                //<div className={classes.toolbar} />
               // <img style={{"gridArea" : "pic", "width": 180, "paddingBottom": 50}} src = {'../../images/math.png'}/>


                <button onClick = {handleDrawerClose} className = {classes.buttonFormat}>
                    <SideBarOptions loggedIn = {loggedIn} username={username}/>

                <AccountOptions loggedIn = {loggedIn} logIn={logIn} logOut={logOut}/>
                </button>
            </Drawer>
        </div>
    );
}


const divStyle = {
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(https://hdwallpaperim.com/wp-content/uploads/2017/09/16/50906-low_poly-wireframe-poly.jpg)`,
    backgroundSize: 'cover',
};




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
