import React from 'react';
import { Typography, Button, Box, Stack } from '@mui/material';
import { ExecResponseDetails } from './types';
import RenderJsonData from 'components/RenderJsonData';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ExecType } from './ExecLauncherUtil';

const ExecResponsePanel: React.FC<{ response: ExecResponseDetails; execType?: number }> = ({ response, execType }) => {
  if (!response || Object.keys(response).length === 0)
    return (<></>);
  else {
    const keys = Object.keys(response);
    
    // Function to get ExecType name from numeric value
    const getExecTypeName = (execTypeValue?: number): string => {
      if (!execTypeValue) return '';
      
      // Find the key in ExecType enum that matches the value
      const execTypeName = Object.keys(ExecType).find(
        (key) => ExecType[key as keyof typeof ExecType] === execTypeValue
      );
      
      return execTypeName || `Type: ${execTypeValue}`;
    };
    
    const handleCopyJson = async () => {
      try {
        await navigator.clipboard.writeText(JSON.stringify(response, null, 2));
        console.log('JSON copied to clipboard');
      } catch (err) {
        console.error('Failed to copy JSON: ', err);
      }
    };
    
    const handleCopyText = async () => {
      try {
        const formattedText = formatResponseAsText(response);
        await navigator.clipboard.writeText(formattedText);
        console.log('Text copied to clipboard');
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    };
    
    const formatResponseAsText = (resp: any): string => {
      const date = new Date().toLocaleString();
      let result = 'Backend Response\n\n';
      result += `Date: ${date}\n`;
      
      const formatObject = (obj: any, indent: string = ''): string => {
        let output = '';
        for (const [key, value] of Object.entries(obj)) {
          if (Array.isArray(value)) {
            output += `${indent}${key}:\n`;
            value.forEach((item) => {
              if (typeof item === 'object' && item !== null) {
                output += formatObject(item, indent + '  ');
              } else {
                output += `${indent}  ${item}\n`;
              }
            });
          } else if (value && typeof value === 'object') {
            output += `${indent}${key}:\n${formatObject(value, indent + '  ')}`;
          } else {
            output += `${indent}${key}: ${value}\n`;
          }
        }
        return output;
      };
      
      return result + formatObject(resp);
    };
    
    return (
      <>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Backend Resp. {getExecTypeName(execType)}</Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyJson}
          >
            Copy JSON
          </Button>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyText}
          >
            Copy Text
          </Button>
        </Stack>
        <Box>
          <RenderJsonData response={{ "date": new Date(), ...response }} />
        </Box>
      </>
    )
  }
}

export default ExecResponsePanel;