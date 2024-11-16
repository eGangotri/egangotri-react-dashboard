import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Menu, MenuItem, Typography, Box, Button, Breadcrumbs, Link } from '@mui/material';
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
import { getMenuLabels, Submenu, TopPanelMenu } from './constants';

const TopPanel: React.FC = () => {
  const TOP_PANEL_MENU: TopPanelMenu[] = [{
    menuLabel: "Uploads",
    submenu: [
      {
        path: LANDING_PAGE_PATH,
        label: "Uploads Cycles",
      },
      {
        path: UPLOADS_USHERED_PATH,
        label: "Uploads Ushered",
      },
      {
        path: UPLOADS_QUEUED_PATH,
        label: "Uploads Queued",
      }
    ]
  },
  {
    menuLabel: "GDrive",
    submenu: [
      {
        path: EXEC_LAUNCHER_PATH,
        label: 'G-Drive Util',
      },
      {
        path: EXEC_LAUNCHER_ZIP_PATH,
        label: 'Zip-to-Pdf',
      }],
  },
  {
    menuLabel: "Archive",
    submenu: [
      {
        path: EXEC_LAUNCHER_TWO_PATH,
        label: 'archive.org Uploads',
      },
      {
        path: EXEC_LAUNCHER_TWO_B_PATH,
        label: 'archive.org Non-Upload Work',
      },
      {
        path: EXEC_LAUNCHER_TWO_C_PATH,
        label: 'archive.org Data & Data Integrity',
      }
    ]
  },
  {
    menuLabel: "FileUtils",
    submenu: [
      {
        path: EXEC_LAUNCHER_THREE_PATH,
        label: 'Files-Util',
      },
      {
        path: EXEC_LAUNCHER_FOUR_PATH,
        label: 'Refine File Data-1',
      },
      {
        path: EXEC_LAUNCH_FOUR_B_PATH,
        label: 'File-Renaming via Excel',
      },
      {
        path: TIFF_2_PDF,
        label: 'Tiff 2 Pdf',
      }
    ]},
    {
    menuLabel: "DB",
    submenu: [
      {
        path: SEARCH_ARCHIVE_DB_PATH,
        label: 'Search Archive DB',
      },
      {
        path: SEARCH_G_DRIVE_DB_PATH,
        label: 'Search G-Drive DB',
      }
    ],
  },
    {
    menuLabel: "G-Drive-Listing-Upload",
    submenu: [
      {
        path: G_DRIVE_LISTING_MAKER_PATH,
        label: 'G-Drive Listing Maker',
      },
      {
        path: G_DRIVE_UPLOAD_INTEGRITY_CHECK_PATH,
        label: 'G-Drive Upload Integrity Check',
      }
    ],
  },
  {
  menuLabel: "Misc",
  submenu: [
    {
      path: AI_TEXT_IDENTIFIER,
      label: 'AI-Text-Identify',
    },
    {
      path: RENAME_PDFS,
      label: 'Rename Pdfs',
    }
  ],
},
  ];
const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
const [menuName, setMenuName] = useState<string | null>(null);
const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
const location = useLocation();

useEffect(() => {
  const path = location.pathname.split('/').filter(x => x);
  const _breadcrumbs = getMenuLabels(TOP_PANEL_MENU, path[0]);
  setBreadcrumbs(_breadcrumbs);
  console.log(`breadcrumbs: ${breadcrumbs} path: ${path}`);
}, [location]);

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
          {TOP_PANEL_MENU.map((_panelMenu: TopPanelMenu) => (
            <>
              <Button
                key={_panelMenu.menuLabel}
                onClick={(event) => handleOpenMenu(event, _panelMenu.menuLabel)}
                color="inherit"
              >
                {_panelMenu.menuLabel}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={menuName === _panelMenu.menuLabel}
                onClose={handleCloseMenu}
              >
                {
                  _panelMenu.submenu.map((item: Submenu) => {
                    return (createNavLink(item.path, item.label)
                    )
                  }
                  )}
              </Menu>
            </>
          ))}

        </Box>
      </Toolbar>
    </AppBar>
    <Breadcrumbs aria-label="breadcrumb" className="py-4 my-4">
      {breadcrumbs.map((crumb, index) => (
        <Link key={index} color="inherit" href="#">
          {crumb}
        </Link>
      ))}
    </Breadcrumbs>
  </span>
);
};

export default TopPanel;
