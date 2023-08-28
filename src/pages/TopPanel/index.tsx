import React from 'react';
import { NavLink } from 'react-router-dom';
import { Grid } from '@mui/material';
import {
  FILE_MOVER_PATH, GRADLE_LAUNCHER_PATH, UPLOADS_QUEUED_PATH,
  UPLOADS_USHERED_PATH,
  LANDING_PAGE_PATH
} from 'Routes';
import { useLocation } from "react-router-dom";
import './topPanel.css';

const TopPanel: React.FC = () => {
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");

  const activeClass = (_route: string) => {
    return splitLocation[1] === _route ? "active" : ""
  }
  return (
    <Grid container spacing={1} columns={{ sm: 6, md: 18 }} direction="row" sx={{ margin: "20px 0",backgroundColor:"lightgrey" }}>
      <Grid item xs={1} sm={1} md={2}><NavLink to={LANDING_PAGE_PATH} className={activeClass(LANDING_PAGE_PATH)}>Uploads Cycles</NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={UPLOADS_USHERED_PATH} className={activeClass(UPLOADS_USHERED_PATH)} >Uploads Ushered</NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={UPLOADS_QUEUED_PATH} className={activeClass(UPLOADS_QUEUED_PATH)}>Uploads Queued</NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={GRADLE_LAUNCHER_PATH} className={activeClass(GRADLE_LAUNCHER_PATH)}>Gradle Launcher</NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={FILE_MOVER_PATH} className={activeClass(FILE_MOVER_PATH)}>File Mover</NavLink></Grid>
    </Grid>
  );
};

export default TopPanel;

