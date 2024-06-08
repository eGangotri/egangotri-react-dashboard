import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Grid } from '@mui/material';
import {
  FILE_MOVER_PATH, EXEC_LAUNCHER_PATH, UPLOADS_QUEUED_PATH,
  UPLOADS_USHERED_PATH,
  LANDING_PAGE_PATH,
  EXEC_LAUNCHER_TWO_PATH,
  EXEC_LAUNCH_FOUR_B_PATH,
  TIFF_2_PDF,
  AI_TEXT_IDENTIFIER,
  EXEC_LAUNCHER_THREE_PATH,
  EXEC_LAUNCHER_FOUR_PATH,
  SEARCH_ARCHIVE_DB_PATH,
  SEARCH_G_DRIVE_DB_PATH,
  G_DRIVE_LISTING_MAKER_PATH,
  G_DRIVE_UPLOAD_INTEGRITY_CHECK_PATH,
  EXEC_LAUNCHER_TWO_B_PATH,
  EXEC_LAUNCHER_TWO_C_PATH
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
      <Grid item xs={1} sm={1} md={2}><NavLink to={EXEC_LAUNCHER_TWO_PATH} className={activeClass(EXEC_LAUNCHER_TWO_PATH)}><Box className="menuItem menuItem_special2"> archive.org Uploads</Box></NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={EXEC_LAUNCHER_TWO_B_PATH} className={activeClass(EXEC_LAUNCHER_TWO_B_PATH)}><Box className="menuItem">archive.org Non-Upload Work</Box></NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={EXEC_LAUNCHER_TWO_C_PATH} className={activeClass(EXEC_LAUNCHER_TWO_C_PATH)}><Box className="menuItem">archive.org Data & Data Integrity</Box></NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={EXEC_LAUNCHER_THREE_PATH} className={activeClass(EXEC_LAUNCHER_THREE_PATH)}><Box className="menuItem">Script Launcher (Files-Related)</Box></NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={EXEC_LAUNCHER_FOUR_PATH} className={activeClass(EXEC_LAUNCHER_FOUR_PATH)}><Box className="menuItem">Script Launcher (Rest)</Box></NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={EXEC_LAUNCH_FOUR_B_PATH} className={activeClass(EXEC_LAUNCH_FOUR_B_PATH)}><Box className="menuItem">Refine File Data</Box></NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={TIFF_2_PDF} className={activeClass(TIFF_2_PDF)}><Box className="menuItem">Tiff 2 Pdf</Box></NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={AI_TEXT_IDENTIFIER} className={activeClass(AI_TEXT_IDENTIFIER)}><Box className="menuItem">AI-Text-Identify</Box></NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={SEARCH_ARCHIVE_DB_PATH} className={activeClass(SEARCH_ARCHIVE_DB_PATH)}><Box className="menuItem">Search Archive DB</Box></NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={SEARCH_G_DRIVE_DB_PATH} className={activeClass(SEARCH_ARCHIVE_DB_PATH)}><Box className="menuItem">Search G-Drive DB</Box></NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={G_DRIVE_LISTING_MAKER_PATH} className={activeClass(G_DRIVE_LISTING_MAKER_PATH)}><Box className="menuItem">G-Drive Listing Maker</Box></NavLink></Grid>
      <Grid item xs={1} sm={1} md={2}><NavLink to={G_DRIVE_UPLOAD_INTEGRITY_CHECK_PATH} className={activeClass(G_DRIVE_UPLOAD_INTEGRITY_CHECK_PATH)}><Box className="menuItem">G-Drive Upload Integrity Check</Box></NavLink></Grid>
    </Grid>
  );
};

export default TopPanel;

