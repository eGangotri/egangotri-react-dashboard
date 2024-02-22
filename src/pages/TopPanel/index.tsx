import React from 'react';
import { NavLink } from 'react-router-dom';
import { Grid } from '@mui/material';
import {
  FILE_MOVER_PATH, EXEC_LAUNCHER_PATH, UPLOADS_QUEUED_PATH,
  UPLOADS_USHERED_PATH,
  LANDING_PAGE_PATH,
  EXEC_LAUNCHER_TWO_PATH,
  TALLY_UPLOADED_DATA,
  TIFF_2_PDF,
  AI_TEXT_IDENTIFIER
} from 'Routes';
import { useLocation } from "react-router-dom";
import './topPanel.css';
import Tiff2Pdf from 'scriptsThruExec/Tiff2Pdf';

const TopPanel: React.FC = () => {
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");

  const activeClass = (_route: string) => {
    return splitLocation[1] === _route ? "active" : ""
  }
  return (
    <Grid container spacing={1} columns={{ sm: 6, md: 18 }} direction="row" sx={{ margin: "20px 0" }}>
      <Grid item xs={1} sm={1} md={2}><NavLink to={LANDING_PAGE_PATH} className={activeClass(LANDING_PAGE_PATH)}>Uploads Cycles</NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={UPLOADS_USHERED_PATH} className={activeClass(UPLOADS_USHERED_PATH)} >Uploads Ushered</NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={UPLOADS_QUEUED_PATH} className={activeClass(UPLOADS_QUEUED_PATH)}>Uploads Queued</NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={EXEC_LAUNCHER_PATH} className={activeClass(EXEC_LAUNCHER_PATH)}>Script Launcher</NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={EXEC_LAUNCHER_TWO_PATH} className={activeClass(EXEC_LAUNCHER_TWO_PATH)}>Script Launcher-2</NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={TALLY_UPLOADED_DATA} className={activeClass(TALLY_UPLOADED_DATA)}>Tally Upload Database</NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={TIFF_2_PDF} className={activeClass(TIFF_2_PDF)}>Tiff 2 Pdf</NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={AI_TEXT_IDENTIFIER} className={activeClass(AI_TEXT_IDENTIFIER)}>AI Identify Text</NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={FILE_MOVER_PATH} className={activeClass(FILE_MOVER_PATH)}>File Mover</NavLink></Grid>
    </Grid>
  );
};

export default TopPanel;

