'use strict';

import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import PersonIcon from "@material-ui/icons/Person";
import {withStyles, makeStyles, Theme} from "@material-ui/core";
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

const createData = (rank: number, name: string, color: string, points: number) => ({rank, name, color, points});

const rows = [
    createData(1, 'Sam', 'red', 0),
    createData(2, 'Tim', 'pink',0),
    createData(3, 'Evan', 'blue',0),
    createData(4, 'Irisa', 'green',0),
];

const useStyles = makeStyles((theme: Theme) => ({
    backDrop: {
        backdropFilter: "blur(0px)",
    },
    table: {
        width: '90%',
        marginTop: "11vh",
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
        width: "10%",
    },
    picStyle : {
        width: "10%",
        height: "100%",
    },
}));


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
    return(<LeaderBoardBlockBase className = {classes.backDrop}>
        <Header> LEADERSHIP BOARD </Header>
        <TableContainer className={classes.table}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow className={classes.tableHeader}>
                        <StyledTableCell align="left">Rank</StyledTableCell>
                        <StyledTableCell align="right"></StyledTableCell>
                        <StyledTableCell align="left">Name</StyledTableCell>
                        <StyledTableCell align="left">Points</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.rank}>
                            <StyledTableCell component="th" scope="row" className = {classes.rankStyle}>
                                {row.rank}
                            </StyledTableCell>
                            <StyledTableCell align="right" className = {classes.picStyle}>
                                <PersonIcon style={{ "width": "100%", "height": "100%", "fill": row.color }}/>
                            </StyledTableCell>
                            <StyledTableCell align = "left">{row.name}</StyledTableCell>
                            <StyledTableCell align="left">{row.points}</StyledTableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </LeaderBoardBlockBase>)

}