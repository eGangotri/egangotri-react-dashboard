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
    EXEC_LAUNCHER_ZIP_PATH,
    G_DRIVE_ITEM_LIST_PATH,
    G_DRIVE_ITEM_AGGREGATES_PATH,
    ARCHIVE_ITEM_LIST_PATH,
    ARCHIVE_ITEM_AGGREGATES_PATH
} from 'Routes/constants';

export const TOP_PANEL_MENU: TopPanelMenu[] = [{
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
    ]
},
{
    menuLabel: "Archive-DB",
    submenu: [
        {
            path: SEARCH_ARCHIVE_DB_PATH,
            label: 'Search Archive DB',
        },
        {
            path: ARCHIVE_ITEM_LIST_PATH,
            label: 'Archive Items List',
        },
        {
            path: ARCHIVE_ITEM_AGGREGATES_PATH,
            label: 'Archives by Profile',
        }
    ],
},
{
    menuLabel: "G-Drive-DB",
    submenu: [
        {
            path: G_DRIVE_LISTING_MAKER_PATH,
            label: 'G-Drive Listing Maker',
        },
        {
            path: G_DRIVE_UPLOAD_INTEGRITY_CHECK_PATH,
            label: 'G-Drive Upload Integrity Check',
        },
        {
            path: SEARCH_G_DRIVE_DB_PATH,
            label: 'Search G-Drive DB',
        },
        {
            path: G_DRIVE_ITEM_LIST_PATH,
            label: 'G-Drive Listing',
        },
        {
            path: G_DRIVE_ITEM_AGGREGATES_PATH,
            label: 'G-Drive by Source',
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
export interface Submenu {
    path: string;
    label: string;
}

export interface TopPanelMenu {
    menuLabel: string;
    submenu: Submenu[];
}

export const getMenuLabels = (topPanelMenu: TopPanelMenu[], _path: string[]) => {
    const path = _path?.join().split(",").join("/")
    let _defaultMenu = [topPanelMenu[0].menuLabel, topPanelMenu[0].submenu[0].label];
    if (!path) return _defaultMenu;

    for (const menu of topPanelMenu) {
        for (const item of menu.submenu) {
            if (item.path != "/" && ("/" + path).includes(item.path)) {
                return [menu.menuLabel, item.label];
            }
        }
    }
    return _defaultMenu;
}
