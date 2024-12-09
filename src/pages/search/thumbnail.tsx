import React, { useState, useEffect, useRef } from 'react';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Popover } from '@mui/material';
import { ellipsis } from 'widgets/ItemTooltip';

const generateArchiveThumbnailFromId = (identifier: string) => {
  return `https://archive.org/services/img/${identifier}`;
}

const generateThumbnail = (params: any) => {
  console.log(`params: ${params?.row?.identifierTruncFile}`);
  if (params?.row?.identifierTruncFile) {
    return `https://drive.google.com/thumbnail?id=${params.row.identifierTruncFile}`;
  }
  return generateArchiveThumbnailFromId(params.row.identifier);
}

const generateAltText = (params: any) => {
  console.log(`generateAltText:params: ${params?.row?.titleGDrive}`);
  if (params?.rows?.titleGDrive) {
    return params.row.titleGDrive;
  }
  return params.row.originalTitle;
}

const renderThumbnailCell = (params: GridRenderCellParams) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const thumbnailRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setAnchorEl(null);
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? 'thumbnail-popover' : undefined;

  return (
    <div
      ref={thumbnailRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      <Box>
        <img
          alt={generateAltText(params)}
          src={generateThumbnail(params)}
          className="w-full h-auto"
          referrerPolicy="no-referrer"
        />
      </Box>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        disableRestoreFocus
        PaperProps={{
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave,
          sx: {
            pointerEvents: 'auto',
            marginLeft: '8px',
          },
        }}
        slotProps={{
          root: {
            sx: {
              pointerEvents: 'none',
            },
          },
        }}
      >
        <div className="w-92 h-92 border border-gray-300 bg-white shadow-lg overflow-hidden">
          <img
            src={generateThumbnail(params)}
            alt={generateAltText(params)}
            className="w-full h-full object-cover"
          />
        </div>
      </Popover>
    </div>
  );
};

export default renderThumbnailCell;

