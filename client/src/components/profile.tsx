"use strict";

import React, { ReactElement, useEffect, useState } from "react";
import styled from "styled-components";
import { AnswerInput, InfoBlock, InfoData, InfoLabels, ShortP } from "./shared";
import PersonIcon from "@material-ui/icons/Person";
import { ButtonGroup, Button } from "@material-ui/core";

interface UserInfo {
  id: number;
  name: string;
  primary_email: string;
  color: string;
}
interface Stat extends Array<string | number> {
  0: string;
  1: number;
}

const ProfileBlockBase = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  color: white;
`;

const ProfileBlock = ({ userInfo }: { userInfo: UserInfo }) => {
  console.log(userInfo);
  const [edit, setEdit] = useState(false);
  const [editText, setEditText] = useState("Edit Profile");
  const [profile, updateProfile] = useState<UserInfo>(userInfo);

  useEffect(() => {
    updateProfile(userInfo);
  }, [userInfo]);

  const onChange = (ev: { target: { id: string; value: any } }) => {
    updateProfile({
      ...profile,
      [ev.target.id]: ev.target.value,
    });
  };

  const saveProfile = async () => {
    console.log(JSON.stringify(profile));
    const res = await fetch("/api/v1/session/updateProfile", {
      method: "POST",
      body: JSON.stringify(profile),
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });
    if (res.ok) {
      const data: { data: UserInfo } = await res.json();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      updateProfile(data);
    } else {
      console.log("Failed to update info");
    }
  };

  const onClick = (): void => {
    if (edit) {
      saveProfile().then((_) => console.log("Tried to save profile"));
      setEdit(false);
      setEditText("Edit Profile");
    } else {
      setEdit(true);
      setEditText("Save Profile");
    }
  };

  return (
    <ProfileBlockBase>
      <div style={{ flex: 1, position: "relative" }}>
        <PersonIcon
          style={{
            gridArea: "img",
            width: "100%",
            height: "100%",
            fill: profile.color ? profile.color : "white",
          }}
        />
      </div>
      <InfoBlock style={{ flex: 5, position: "relative" }}>
        <InfoLabels>
          <p>Name:</p>
          <p>Email Address:</p>
          <p>Color:</p>
        </InfoLabels>
        <InfoData style={{ position: "relative" }}>
          {edit ? (
            <AnswerInput
              id="name"
              type="text"
              name="name"
              onChange={onChange}
              value={profile.name}
              style={{ margin: "0.5em", height: "1.5em", position: "relative" }}
            />
          ) : (
            <ShortP>{profile.name ? profile.name : "--"}</ShortP>
          )}
          <ShortP>
            {profile.primary_email ? profile.primary_email : "--"}
          </ShortP>
          {edit ? (
            <AnswerInput
              id="color"
              type="text"
              name="color"
              onChange={onChange}
              value={profile.color}
              style={{ margin: "0.5em", height: "1.5em", position: "relative" }}
            />
          ) : (
            <ShortP>{profile.color ? profile.color : "--"}</ShortP>
          )}
          <ButtonGroup
            color="primary"
            variant="contained"
            aria-label="contained primary button group"
          >
            <Button style={{ width: "fit-content" }} onClick={onClick}>
              {editText}
            </Button>
          </ButtonGroup>
        </InfoData>
      </InfoBlock>
    </ProfileBlockBase>
  );
};

const StatsBoxBase = styled.div`
  flex: 1;
  padding: 1em;
  margin: 1em;
  height: 50%;
  display: flex-container;
  justify-content: center;
  text-align: center;
  background: white;
  justify-content: center;
  border: 3px solid black;
  border-radius: 100px;
`;

const StatBox = ({ stat }: { stat: (string | number)[] }): ReactElement => {
  return (
    <StatsBoxBase>
      <div style={{ flex: 1, fontWeight: "bold" }}>{stat[0]}</div>
      <div style={{ flex: 2 }}>{stat[1]}</div>
    </StatsBoxBase>
  );
};
const StatsBlockBase = styled.div`
  flex: 2;
  display: flex;
  padding: 1em;
  justify-content: center;
  margin-top: 2em;
`;

const StatsBlock = ({ mode }: { mode: string }): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  useEffect(() => {
    getStats().then((stats: Stat[]) => {
      updateStats(stats);
      console.log(stats);
      console.log("here is profile update");
      console.log(statsBoxes);
    });
  }, [mode]);

  const getStats = async (): Promise<Stat[]> => {
    console.log("changing stats");
    const res = await fetch(`api/v1/game/stats/${mode.toString()}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });
    if (res.ok) {
      const data = await res.json();
      return [
        ["Number of Games", data.num_games],
        ["Win Ratio", data.win_rate.toFixed(2)],
        ["Number of Questions", data.num_questions],
        ["Accuracy Ratio", data.accuracy.toFixed(2)],
        ["Speed", data.speed.toFixed(2)],
      ];
    } else {
      console.log("Did not work!");
      return [
        ["Number of Games", 0],
        ["Win Ratio", 0],
        ["Number of Questions", 0],
        ["Accuracy Ratio", 0],
        ["Speed", 0],
      ];
    }
  };

  //<[string, number][]>
  const [stats, updateStats] = useState<Stat[]>([
    ["Number of Games", 0],
    ["Win Ratio", 0],
    ["Number of Questions", 0],
    ["Accuracy Ratio", 0],
    ["Speed", 0],
  ]);

  const [statsBoxes, updateStatBoxes] = useState<ReactElement[]>([]);

  useEffect(() => {
    console.log(stats);
    console.log(stats.map((stat, i) => <StatBox key={i} stat={stat} />));
    updateStatBoxes(stats.map((stat, i) => <StatBox key={i} stat={stat} />));
    console.log("executed here");
    console.log(statsBoxes);
  }, [stats]);
  //   const statsBoxes = stats.map((stat, i) => <StatBox key={i} stat={stat} />);
  return <StatsBlockBase>{statsBoxes}</StatsBlockBase>;
};

const ProfilePageBase = styled.div`
  grid-area: main;
  display: flex-container;
  flex-direction: column;
  justify-content: center;
  padding: 1em;
`;

export const Profile = ({
  currentUser,
  onLoggedIn,
}: {
  currentUser: UserInfo;
  onLoggedIn: () => void;
}): ReactElement => {
  const defaultMode = "Normal";
  const modes = ["Normal", "Probability", "Standardized Test", "Comparison"];
  const [mode, setMode] = useState(defaultMode);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const modeChange = (ev) => {
    setMode(ev.target.id);
  };

  const modeButtons = modes.map((m) => (
    <Button key={m} onClick={modeChange} id={m}>
      {m}
    </Button>
  ));

  useEffect(() => {
    onLoggedIn();
  }, []);

  return (
    <ProfilePageBase>
      <ProfileBlock userInfo={currentUser} />
      <ButtonGroup
        style={{ position: "absolute", right: "3em" }}
        color="primary"
        variant="contained"
        aria-label="contained primary button group"
      >
        {modeButtons}
      </ButtonGroup>
      <StatsBlock mode={mode} />
    </ProfilePageBase>
  );
};
