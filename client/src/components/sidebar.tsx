'use strict';

import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

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

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
        <Box mt={20} mb={20}>
            {loggedIn ?
                <Link to={"/create"}>
                    <ListItem button key = {"createLink"}>
                        <ListItemText classes = {{primary: classes.playFormat}} primary={"PLAY!"}/>
                </ListItem>
            </Link> : null}
            {loggedIn ?
            <Link to={"/leadership"}>
            <ListItem button key = {"Leadership Board"}>
                <ListItemText classes = {{primary: classes.listFormat}} primary={"Leadership Board"} />
            </ListItem>
            </Link>: null}
            {loggedIn ?
                <Link to={`/profile/${username}`}>
                    <ListItem button key = {"profile"}>
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
                    <ListItem button key = {"logout"} onClick={logOut}>
                        <ListItemText classes = {{primary: classes.listFormat}} primary={"LOG OUT"} />
                    </ListItem>
                </Fragment>)
                : (<Fragment>
                    <ListItem id = {"google"} button key = {"google"} onClick = {logIn}>
                        <ListItemText classes = {{primary: classes.listFormat}} primary={"GOOGLE LOG IN"} />
                    </ListItem>
                    <ListItem id = {"github"} button key = {"github"} onClick={logIn}>
                        <ListItemText classes = {{primary: classes.listFormat}} primary={"GITHUB LOG IN"} />
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
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    return (
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
                </div>


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

