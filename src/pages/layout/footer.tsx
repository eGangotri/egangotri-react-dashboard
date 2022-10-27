import { Box, Typography } from '@mui/material';
import React from 'react';
import 'index.css';


const EgangotriFooter: React.FC<{ title: string }> = ({ title }) => {
  return (
    <footer className='Footer'>
            {title}
    </footer>
  );
}

export default EgangotriFooter