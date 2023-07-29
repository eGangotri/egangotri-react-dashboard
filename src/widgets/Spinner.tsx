import React from 'react';
import './Spinner.css';
import { Box } from '@mui/material';

const Spinner = () => {
  return (
    <Box component="span"  className="spinner-container">
      <Box component="span" className="spinner"></Box>
    </Box>
  );
};

export default Spinner;