import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Menu, MenuItem, Box, Button, Breadcrumbs, Link } from '@mui/material';
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

const createNavLink = (path: string, label: string, index: number) => (
  <NavLink key={`nav-${label}-${index}`} to={path} style={{ textDecoration: 'none', color: 'inherit' }}>
    <MenuItem onClick={handleCloseMenu}>{label}</MenuItem>
  </NavLink>
);

return (
  <span>
    <AppBar position="static" className='mt-4 mb-4 mr-4'>
      <Toolbar>
        <Box sx={{ display: 'flex', gap: 2 }} >
          {TOP_PANEL_MENU.map((_panelMenu: TopPanelMenu, menuIndex: number) => (
            <React.Fragment key={`menu-${_panelMenu.menuLabel}-${menuIndex}`}>
              <Button
                onClick={(event) => handleOpenMenu(event, _panelMenu.menuLabel)}
                color="inherit"
              >
                {_panelMenu.menuLabel}
              </Button>
              <Menu
                id={_panelMenu.menuLabel}
                anchorEl={anchorEl}
                open={menuName === _panelMenu.menuLabel}
                onClose={handleCloseMenu}
              >
                {
                  _panelMenu.submenu.map((item: Submenu, itemIndex: number) => 
                    createNavLink(item.path, item.label, itemIndex)
                  )
                }
              </Menu>
            </React.Fragment>
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
