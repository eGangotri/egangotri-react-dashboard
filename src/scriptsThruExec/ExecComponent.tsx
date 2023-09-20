// RowComponent.tsx
import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

type Props = {
  placeholder?: string;
  buttonText?: string;
};

const ExecComponent: React.FC<Props> = ({ placeholder = 'Comma Separated Profile Codes', buttonText = 'Click me' }) => {
  return (
    <Box display="flex" alignItems="center" gap={4} mb={2}>
      <TextField variant="outlined" placeholder={placeholder} />
      <Button variant="contained" color="primary">
        {buttonText}
      </Button>
    </Box>
  );
};

export default ExecComponent;
