import React from 'react';
import { Typography } from '@mui/material';
import { ExecResponse } from './types';
import RenderJsonData from 'components/RenderJsonData';

const ExecResponsePanel: React.FC<ExecResponse> = ({ response }) => {
  if (!response || Object.keys(response).length === 0)
    return (<></>);
    else {
      const keys = Object.keys(response);
      return (
        <>
          <Typography>Backend Resp.</Typography>
          {keys.map((key: string) => (
            <div key={key}>
              <Typography>{key} {`${JSON.stringify(response[key])}`}</Typography>
            </div>
          ))}
          {/* <div>
          <h1>JSON Data</h1>
          <RenderJsonData data={response} />
        </div> */}
        </>
      )
    }
}

export default ExecResponsePanel;