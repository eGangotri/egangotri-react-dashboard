import {
    FILE_MOVER_PATH,
    EXEC_LAUNCHER_PATH,
    UPLOADS_QUEUED_PATH,
    UPLOADS_USHERED_PATH,
    LANDING_PAGE_PATH,
    EXEC_LAUNCHER_TWO_PATH,
    AI_TITLE_RENAMER_HISTORY_PATH,
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
    ARCHIVE_ITEM_AGGREGATES_PATH,
    ARCHIVE_ITEM_AGGREGATES_BY_SOURCES_PATH,
    FILE_TRANSFER_LISTING,
    GDRIVE_DWNL_LISTING,
    IMG_TO_PDF_LISTING,
    UPLOADS_USHERED_OLD_PATH,
    LANDING_PAGE_OLD_PATH,
    LAUNCH_AI_RENAMER_PATH,
    EXEC_LAUNCHER_FOUR_B_PATH,
    AI_TITLE_PDF_RENAMER_HISTORY_PATH,
    PDF_MERGE_HISTORY_TRACKER_PATH,
    PDF_MERGE_MODULE,
    LAUNCH_AI_GDRIVE_CP_RENAMER_HISTORY_PATH,
    PDF_PAGE_EXTRACTION_HISTORY_PATH
} from 'Routes/constants';

export const TOP_PANEL_MENU: TopPanelMenu[] = [{
    menuLabel: "Uploads",
    submenu: [
        {
            path: LANDING_PAGE_PATH,
            label: "Uploads Cycles",
        },
        {
            path: LANDING_PAGE_OLD_PATH,
            label: "Uploads Cycles-OLd",
        },
        {
            path: UPLOADS_USHERED_PATH,
            label: "Uploads Ushered",
        },
        {
            path: UPLOADS_USHERED_OLD_PATH,
            label: "Uploads Ushered - Old",
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
        },
        {
            path: GDRIVE_DWNL_LISTING,
            label: 'G-Drive Download List',
        },
        {
            path: IMG_TO_PDF_LISTING,
            label: 'Img to Pdf Conversion List',
        }]
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
        },
        {
            path: EXEC_LAUNCHER_TWO_C_PATH,
            label: 'Archive Download List',
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
            path: TIFF_2_PDF,
            label: 'Tiff 2 Pdf',
        },
        {
            path: FILE_TRANSFER_LISTING,
            label: 'File Transfer List',
        },
        {
            path: PDF_MERGE_MODULE,
            label: 'Pdf Merge Module',
        },
        {
            path: EXEC_LAUNCHER_FOUR_B_PATH,
            label: 'Excel Renamer',
        }
    ]
}, {
    menuLabel: "AI",
    submenu: [

        {
            path: LAUNCH_AI_RENAMER_PATH,
            label: 'File AI Renaming',
        },
        {
            path: LAUNCH_AI_GDRIVE_CP_RENAMER_HISTORY_PATH,
            label: 'GDrive CP AI Renaming History',
        },

        {
            path: AI_TITLE_RENAMER_HISTORY_PATH,
            label: 'AI File Renaming History',
        },
        {
            path: AI_TITLE_PDF_RENAMER_HISTORY_PATH,
            label: 'AI Title & PDF Renaming History',
        },
        {
            path: PDF_PAGE_EXTRACTION_HISTORY_PATH,
            label: 'Pdf Extraction History',
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
        },
        {
            path: ARCHIVE_ITEM_AGGREGATES_BY_SOURCES_PATH,
            label: 'Archives by Sources',
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
}
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
