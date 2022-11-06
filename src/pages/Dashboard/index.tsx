import React from 'react';
import 'index.css';
import EgangotriFooter from 'pages/layout/footer';
import EgangotriHeader from 'pages/layout/header';
import TabPanel from 'pages/tab/tab';
import { Box } from '@mui/material';

const Dashboard:React.FC = () => {
  return (
    <Box>
          <EgangotriHeader title='eGangotri Dashboard' />
          <Box className="Main">
          <TabPanel/>
          </Box>
          <EgangotriFooter title='eGangotri Digital Preservation Trust. CC-0. In Public Domain' />
    </Box>
  );
}

export default Dashboard;
