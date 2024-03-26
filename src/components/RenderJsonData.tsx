import React from 'react';
import { ExecResponseDetails } from 'scriptsThruExec/types';
import './styles.css';
import { Box } from '@mui/material';
import { ERROR_RED, SUCCESS_GREEN } from 'constants/colors';

// Assuming your JSON response might have various structures
interface ApiResponse {
  response: ExecResponseDetails | ExecResponseDetails[]
}

const RenderJsonData: React.FC<ApiResponse> = ({ response }) => {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const renderJson = (json: any) => {
    if (Array.isArray(json)) {
      return (
        <ul>
          {json.map((item, index) => (
            <li key={index}>{renderJson(item)}</li>
          ))}
        </ul>
      );
    } else if (typeof json === 'object' && json !== null) {
      return (
        <ul>
          {Object.entries(json).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {renderJson(value)}
            </li>
          ))}
        </ul>
      );
    }
    else if (typeof json === 'boolean' && json !== null) {
      return (
        <span style={{ color: json.toString() === 'true' ? SUCCESS_GREEN : ERROR_RED }}>
          {json.toString()}
        </span>
      );
    }
    else {
      return <span>{json}</span>;
    }
  };

  return <div>{renderJson(response)}</div>;
};

export default RenderJsonData;
