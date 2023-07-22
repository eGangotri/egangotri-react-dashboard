import React from 'react';
import { Link } from 'react-router-dom';
import { Grid } from '@mui/material';
import {
  FILE_MOVER_PATH, GRADLE_LAUNCHER_PATH, UPLOADS_QUEUED_PATH,
  UPLOADS_USHERED_PATH,
  LANDING_PAGE_PATH
} from 'Routes';

const TopPanel: React.FC = () => {
  return (
    <Grid container spacing={1} columns={{ sm: 6, md: 18 }} direction="row" sx={{ margin: "20px 0" }}>
      <Grid item xs={1} sm={1} md={2}><Link to={LANDING_PAGE_PATH}>Uploads Cycles</Link></Grid>
      <Grid item xs={1} sm={1} md={2}><Link to={UPLOADS_USHERED_PATH}>Uploads Ushered</Link></Grid>
      <Grid item xs={1} sm={1} md={2}><Link to={UPLOADS_QUEUED_PATH}>Uploads Queued</Link></Grid>
      <Grid item xs={1} sm={1} md={2}><Link to={GRADLE_LAUNCHER_PATH}>Gradle Launcher</Link></Grid>
      <Grid item xs={1} sm={1} md={2}><Link to={FILE_MOVER_PATH}>File Mover</Link></Grid>
    </Grid>
  );
};

export default TopPanel;

