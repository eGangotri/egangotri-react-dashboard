import React from 'react';
import { Typography } from '@mui/material';
import { ExecResponse } from './types';
import RenderJsonData from 'components/RenderJsonData';
import { isNumber, toInteger } from 'lodash';

const ExecResponsePanel: React.FC<ExecResponse> = ({ response }) => {
  if (!response || Object.keys(response).length === 0)
    return (<></>);
  else {
    const keys = Object.keys(response);
    return (
      <>
        <Typography>Backend Resp.</Typography>
        {<div>
          <RenderJsonData response={response} />
        </div>}
      </>
    )
  }
}

export default ExecResponsePanel;