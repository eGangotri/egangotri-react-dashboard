import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Grid } from '@mui/material';
import {
  FILE_MOVER_PATH, EXEC_LAUNCHER_PATH, UPLOADS_QUEUED_PATH,
  UPLOADS_USHERED_PATH,
  LANDING_PAGE_PATH,
  EXEC_LAUNCHER_TWO_PATH,
  TALLY_UPLOADED_DATA,
  TIFF_2_PDF,
  AI_TEXT_IDENTIFIER,
  EXEC_LAUNCHER_THREE_PATH,
  EXEC_LAUNCHER_FOUR_PATH,
  SEARCH_DB_PATH
} from 'Routes';
import { useLocation } from "react-router-dom";
import './topPanel.css';
import Tiff2Pdf from 'scriptsThruExec/Tiff2Pdf';

const TopPanel: React.FC = () => {
  const border = "1px solid black";
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");

  const activeClass = (_route: string) => {
    return splitLocation[1] === _route ? "active" : "" ;
  }
  return (
    <Grid container spacing={1} columns={{ sm: 6, md: 18 }} direction="row" sx={{ margin: "20px 0" }}>
      <Grid item xs={1} sm={1} md={2}><NavLink to={LANDING_PAGE_PATH} className={activeClass(LANDING_PAGE_PATH)}><Box className="menuItem">Uploads Cycles</Box></NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={UPLOADS_USHERED_PATH} className={activeClass(UPLOADS_USHERED_PATH)} ><Box className="menuItem">Uploads Ushered</Box></NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={UPLOADS_QUEUED_PATH} className={activeClass(UPLOADS_QUEUED_PATH)}><Box className="menuItem">Uploads Queued</Box></NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={EXEC_LAUNCHER_PATH} className={activeClass(EXEC_LAUNCHER_PATH)}><Box className="menuItem menuItem_special">Script Launcher(G-Drive)</Box></NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={EXEC_LAUNCHER_TWO_PATH} className={activeClass(EXEC_LAUNCHER_TWO_PATH)}><Box className="menuItem menuItem_special2">Script Launcher (archive.org)</Box></NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={EXEC_LAUNCHER_THREE_PATH} className={activeClass(EXEC_LAUNCHER_THREE_PATH)}><Box className="menuItem">Script Launcher (Files-Related)</Box></NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={EXEC_LAUNCHER_FOUR_PATH} className={activeClass(EXEC_LAUNCHER_FOUR_PATH)}><Box className="menuItem">Script Launcher (Rest)</Box></NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={TALLY_UPLOADED_DATA} className={activeClass(TALLY_UPLOADED_DATA)}><Box className="menuItem">Tally Upload Database</Box></NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={TIFF_2_PDF} className={activeClass(TIFF_2_PDF)}><Box className="menuItem">Tiff 2 Pdf</Box></NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={AI_TEXT_IDENTIFIER} className={activeClass(AI_TEXT_IDENTIFIER)}><Box className="menuItem">AI-Text-Identify</Box></NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={SEARCH_DB_PATH} className={activeClass(SEARCH_DB_PATH)}><Box className="menuItem">Search DB</Box></NavLink></Grid>
    </Grid>
  );
};

export default TopPanel;

