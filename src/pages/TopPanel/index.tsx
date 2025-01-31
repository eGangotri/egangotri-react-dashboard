import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Menu, MenuItem, Typography, Box, Button, Breadcrumbs, Link } from '@mui/material';

import { getMenuLabels, Submenu, TOP_PANEL_MENU, TopPanelMenu } from './constants';



const TopPanel: React.FC = () => {
 
const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
const [menuName, setMenuName] = useState<string | null>(null);
const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
const location = useLocation();

useEffect(() => {
  const path = location.pathname.split('/').filter(x => x);
  const _breadcrumbs = getMenuLabels(TOP_PANEL_MENU, path);
  setBreadcrumbs(_breadcrumbs);
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
    <MenuItem key={label} onClick={handleCloseMenu}>{label}</MenuItem>
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
                key={menuName}
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
