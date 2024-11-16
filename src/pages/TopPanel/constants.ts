
export interface Submenu {
    path: string;
    label: string;
}

export interface TopPanelMenu {
    menuLabel: string;
    submenu: Submenu[];
}

export const getMenuLabels = (topPanelMenu: TopPanelMenu[], path: string) => {
    for (const menu of topPanelMenu) {
        for (const item of menu.submenu) {
            if (item.path === `/${path}`) {
                return [menu.menuLabel, item.label];
            }
        }
    }
    return [topPanelMenu[0].menuLabel, topPanelMenu[0].submenu[0].label];
}
