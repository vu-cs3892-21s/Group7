'use strict';

import React, {useEffect, useState} from 'react';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import styled from "styled-components";
import PersonIcon from "@material-ui/icons/Person";
import {withStyles, makeStyles, Theme} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: "rgb(204, 204, 204, 0.1)",
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 20,
        backgroundColor:"rgb(45, 93, 128, 0.55)"
    },
}))(TableCell);


const theme = createMuiTheme({
    overrides: {
        MuiTab: {
            root: {
                "&.Mui-selected": {
                    background: "rgb(204, 204, 204, 0.2)",
                    border: "none",
                    outline: "none",
                }
            }
        }
    }
});

const useStyles = makeStyles((theme: Theme) => ({
    backDrop: {
        backdropFilter: "blur(2.5px)",
    },
    indicator: {
        background: "none",
    },
    tabs: {
        flexGrow: 1,
        width: 500,
        marginTop: "23vh",
        marginLeft: "auto",
        marginRight: "auto",
        background: "transparent",
        color: "white",
        borderBottom: "0.01px solid white",
    },
    table: {
        width: '80%',
        marginTop: "1vh",
        marginLeft: "auto",
        marginRight: "auto",
        borderSpacing: '0 10px',
        borderCollapse: 'separate',
        "& .MuiTable-root": {
            borderSpacing: '0 10px',
            borderCollapse: 'separate',
        },
        "& .MuiTableCell-root": {
            height: "7vh",
            border: "none",
            color: "white",
            fontSize: "25px",
            fontFamily: "'Revalia', 'sans-serif'",
        },
    },
    tableHeader: {
        backgroundColor: "rgb(204, 204, 204, 0.1)",
        "& .MuiTableCell-root": {
            height: "4vh",
            border: "none",
            color: "white",
            fontSize: "25px",
            fontFamily: "'Revalia', 'sans-serif'",
        },
    },
    rankStyle: {
        width: "15%",
    },
    picStyle : {
        width: "19%",
        height: "100%",
    },
}));

const createData = (rank: number, name: string, color: string, points: number) => ({rank, name, color, points});

const rows = [
    createData(1, 'Sam', 'red', 0),
    createData(2, 'Tim', 'pink',0),
    createData(3, 'Evan', 'blue',0),
    createData(4, 'Irisa', 'green',0),
];

//Add data to tables
const TableComponent = () => {
    const classes = useStyles();
    return <TableContainer className={classes.table}>
        <Table className={classes.table}>
            <TableHead>
                <TableRow className={classes.tableHeader}>
                    <StyledTableCell align="center">Rank</StyledTableCell>
                    <StyledTableCell align="right"></StyledTableCell>
                    <StyledTableCell align="left">Player</StyledTableCell>
                    <StyledTableCell align="center">Points</StyledTableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.rank}>
                        <StyledTableCell component="th" scope="row" align="center" className = {classes.rankStyle}>
                            {row.rank}
                        </StyledTableCell>
                        <StyledTableCell align="right" className = {classes.picStyle}>
                            <PersonIcon style={{ "width": "50%", "height": "100%", "fill": row.color }}/>
                        </StyledTableCell>
                        <StyledTableCell align ="left" >{row.name}</StyledTableCell>
                        <StyledTableCell align="center">{row.points}</StyledTableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
};

interface TabPanelProps {
    children: React.ReactNode;
    index: any;
    value: any;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const a11yProps = (index: any) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const LeaderBoardBlockBase = styled.div`
  width: 100%;
  height:100%;
  position:fixed;
  justify-content:center;
`;

const Header = styled.h1`
    color: white;
    line-height: 30vh;
    width: 100%;
    position: fixed;
    text-align: center;
    font-family: 'Playfair Display', 'serif';
`;

export const LeadershipBoard = ({currentUser} : {currentUser:string}) => {

    // const [leadershipInfo, setLeadershipInfo] = useState({
    //     users: ["Sam", "Tim", "Evan", "Irisa"],
    //     correct: [4, 3, 2, 1]
    // });
    //
    // useEffect(() => {
    //     async function setLeadershipBoard() {
    //         const res = await fetch(`/api/v1/game/getUsers`);
    //         if (res.ok) {
    //             const data = await res.json();
    //             setLeadershipInfo({
    //                 users: data.users,
    //                 correct: data.correct
    //             });
    //         }
    //     }
    //     setLeadershipBoard();
    // }, []);
    //
    // const makeRows = () => {
    //     let i = 0;
    //     while(i < leadershipInfo.users.length) {
    //         rows.append({i + 1, leadershipInfo.users[i], leadershipInfo.correct[i]})
    //     }
    // }

    const classes = useStyles();
    const [value, setValue] = useState(0);

    const handleChange = (
        event: any,
        newValue: React.SetStateAction<number>
    ): void => {
        setValue(newValue);
    };

    return(
        <LeaderBoardBlockBase className = {classes.backDrop}>
            <Header> LEADERSHIP BOARD </Header>

            <ThemeProvider theme={theme}>
                <Box className={classes.tabs}>
                    <Tabs value={value} onChange={handleChange} className={classes.tabs} classes={{ indicator: classes.indicator }}>
                        <Tab label="Me and My Friends" {...a11yProps(0)} />
                        <Tab label="Local" {...a11yProps(1)} />
                        <Tab label="Global" {...a11yProps(2)} />
                    </Tabs>
                </Box>
            </ThemeProvider>
            <TabPanel value={value} index={0}>
                {TableComponent()}
            </TabPanel>
            <TabPanel value={value} index={1}>
                {TableComponent()}
            </TabPanel>
            <TabPanel value={value} index={2}>
                {TableComponent()}
            </TabPanel>
        </LeaderBoardBlockBase>)
};