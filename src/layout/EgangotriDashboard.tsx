import React from 'react';
import 'layout/EgangotriDashboard.css';
import EgangotriFooter from 'layout/footer';
import EgangotriHeader from 'layout/header';
import TabPanel from 'pages/tab/tab';
import { Box } from '@mui/material';

const EgangotriDashboard:React.FC = () => {
  return (
    <Box sx={{ textAlign: "center" }}>
          <EgangotriHeader title='eGangotri Dashboard' />
          <TabPanel />
          <EgangotriFooter title='eGangotri Digital Preservation Trust. CC-0. In Public Domain' />
    </Box>
  );
}

export default EgangotriDashboard;
