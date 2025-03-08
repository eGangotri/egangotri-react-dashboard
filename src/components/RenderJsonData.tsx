import React, { useState } from 'react';
import { ExecResponseDetails } from 'scriptsThruExec/types';
import './styles.css';
import { Box, Button, Popover, Typography } from '@mui/material';
import { ERROR_RED, SUCCESS_GREEN } from 'constants/colors';
import { ContentCopy } from "@mui/icons-material";

// Assuming your JSON response might have various structures
interface ApiResponse {
  response: ExecResponseDetails | ExecResponseDetails[]
}
const MAX_DISPLAYABLE = 150;
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
      const text = json.toString();
      if (text.length > MAX_DISPLAYABLE) {
        return <ExpandableText text={text} />;
      }
      return <span>{text}</span>;
    }
  };
  return <div>{renderJson(response)}</div>;
};

interface ExpandableTextProps {
  text: string;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <span>{text.slice(0, 50)}...</span>
      <Button
        onClick={handleClick}
        size="small"
        sx={{ ml: 1, textTransform: 'none', fontSize: '0.8rem' }}
      >
        Show More
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, maxWidth: '500px', maxHeight: '400px' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
              borderBottom: '1px solid #ddd',
              pb: 1
            }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={handleCopy}
              sta
              rtIcon={<ContentCopy fontSize="small" />}
              sx={{ mt: 1 }}
            >
              Copy
            </Button>     
              <Button
              size="medium"
              onClick={handleClose}
              sx={{ minWidth: 'auto', p: 0.5 }}
            >
              X
            </Button>
          </Box>

          <Box sx={{ overflow: 'auto', mb: 2 }}>
            <Typography component="div">{text}</Typography>
          </Box>

        </Box>
      </Popover>
    </Box>
  );
};

export default RenderJsonData;
