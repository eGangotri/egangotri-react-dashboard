import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AppBar, Toolbar, Menu, MenuItem, Typography, Box, Button } from '@mui/material';
import {
  FILE_MOVER_PATH,
  EXEC_LAUNCHER_PATH,
  UPLOADS_QUEUED_PATH,
  UPLOADS_USHERED_PATH,
  LANDING_PAGE_PATH,
  EXEC_LAUNCHER_TWO_PATH,
  EXEC_LAUNCH_FOUR_B_PATH,
  TIFF_2_PDF,
  AI_TEXT_IDENTIFIER,
  EXEC_LAUNCHER_THREE_PATH,
  EXEC_LAUNCHER_FOUR_PATH,
  SEARCH_ARCHIVE_DB_PATH,
  SEARCH_G_DRIVE_DB_PATH,
  G_DRIVE_LISTING_MAKER_PATH,
  G_DRIVE_UPLOAD_INTEGRITY_CHECK_PATH,
  EXEC_LAUNCHER_TWO_B_PATH,
  EXEC_LAUNCHER_TWO_C_PATH,
  RENAME_PDFS,
  EXEC_LAUNCHER_ZIP_PATH
} from 'Routes';

const TopPanel: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuName, setMenuName] = useState<string | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, menu: string) => {
    setAnchorEl(event.currentTarget);
    setMenuName(menu);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuName(null);
  };

  const createNavLink = (path: string, label: string) => (
    <NavLink to={path} style={{ textDecoration: 'none', color: 'inherit' }}>
      <MenuItem onClick={handleCloseMenu}>{label}</MenuItem>
    </NavLink>
  );

  return (
    <span>
      <AppBar position="static" className='mt-4 mb-4 mr-4'>
        <Toolbar>
          <Box sx={{ display: 'flex', gap: 2 }} >
            {/* Uploads Menu */}
            <Button
              onClick={(event) => handleOpenMenu(event, 'Uploads')}
              color="inherit"
            >
              Uploads
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={menuName === 'Uploads'}
              onClose={handleCloseMenu}
            >
              {createNavLink(LANDING_PAGE_PATH, 'Uploads Cycles')}
              {createNavLink(UPLOADS_USHERED_PATH, 'Uploads Ushered')}
              {createNavLink(UPLOADS_QUEUED_PATH, 'Uploads Queued')}
            </Menu>

            {/* GDrive Menu */}
            <Button
              onClick={(event) => handleOpenMenu(event, 'GDrive')}
              color="inherit"
            >
              GDrive
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={menuName === 'GDrive'}
              onClose={handleCloseMenu}
            >
              {createNavLink(EXEC_LAUNCHER_PATH, 'G-Drive Util')}
              {createNavLink(EXEC_LAUNCHER_ZIP_PATH, 'Zip-to-Pdf')}
            </Menu>

            {/* Archive Menu */}
            <Button
              onClick={(event) => handleOpenMenu(event, 'Archive')}
              color="inherit"
            >
              Archive
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={menuName === 'Archive'}
              onClose={handleCloseMenu}
            >
              {createNavLink(EXEC_LAUNCHER_TWO_PATH, 'archive.org Uploads')}
              {createNavLink(EXEC_LAUNCHER_TWO_B_PATH, 'archive.org Non-Upload Work')}
              {createNavLink(EXEC_LAUNCHER_TWO_C_PATH, 'archive.org Data & Data Integrity')}
            </Menu>

            {/* FileUtils Menu */}
            <Button
              onClick={(event) => handleOpenMenu(event, 'FileUtils')}
              color="inherit"
            >
              FileUtils
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={menuName === 'FileUtils'}
              onClose={handleCloseMenu}
            >
              {createNavLink(EXEC_LAUNCHER_THREE_PATH, 'Files-Util')}
              {createNavLink(EXEC_LAUNCHER_FOUR_PATH, 'Refine File Data-1')}
              {createNavLink(EXEC_LAUNCH_FOUR_B_PATH, 'File-Renaming via Excel')}
              {createNavLink(TIFF_2_PDF, 'Tiff 2 Pdf')}
            </Menu>

            <Button
              onClick={(event) => handleOpenMenu(event, 'DB')}
              color="inherit"
            >
              DB
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={menuName === 'DB'}
              onClose={handleCloseMenu}
            >
              {createNavLink(SEARCH_ARCHIVE_DB_PATH, 'Search Archive DB')}
              {createNavLink(SEARCH_G_DRIVE_DB_PATH, 'Search G-Drive DB')}
            </Menu>

            <Button
              onClick={(event) => handleOpenMenu(event, 'G-Drive-Listing-Upload')}
              color="inherit"
            >
              G-Drive-Listing-Upload
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={menuName === 'G-Drive-Listing-Upload'}
              onClose={handleCloseMenu}
            >
              {createNavLink(G_DRIVE_LISTING_MAKER_PATH, 'G-Drive Listing Maker')}
              {createNavLink(G_DRIVE_UPLOAD_INTEGRITY_CHECK_PATH, 'G-Drive Upload Integrity Check')}
              {createNavLink(RENAME_PDFS, 'Rename Pdfs')}
            </Menu>

            <Button
              onClick={(event) => handleOpenMenu(event, 'Misc')}
              color="inherit"
            >
              Misc
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={menuName === 'Misc'}
              onClose={handleCloseMenu}
            >
              {createNavLink(AI_TEXT_IDENTIFIER, 'AI-Text-Identify')}
              {createNavLink(RENAME_PDFS, 'Rename Pdfs')}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </span>
  );
};

export default TopPanel;
