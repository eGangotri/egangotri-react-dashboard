import React from 'react';
import { Typography } from '@mui/material';
import { ExecResponse } from './types';

const ExecResponsePanel: React.FC<ExecResponse> = ({ response }) => {
  const keys = Object.keys(response);

  return (
    <>
      <Typography>Backend Resp.</Typography>
      {keys.map((key: string) => (
        <div key={key}>
          <Typography>{key} {`${JSON.stringify(response[key])}`}</Typography>
        </div>
      ))}
    </>
  )
}

export default ExecResponsePanel;