import { GDriveExcelItem } from "./types/GDriveExcelItem";
import { HtmlDataType } from "./types/HtmlDataType";
import * as path from 'path';

export const INPUT_PATH = path.join(process.cwd(), `./src/html/input/`);
export const MASTER_PATH = path.join(process.cwd(), `./src/html/master/`);
export const MASTER_JSON = path.join(MASTER_PATH, 'master-data.json');
export const BACKUP_DIR = path.join(INPUT_PATH, 'backup');

//pnpm run excelToHTML
const injectAbleExcel = "latest-82.xlsx" //start with 83 80-82/84/85 done/ 60-69 need to be redone
export const LATEST_INJECTABLE_EXCEL =  path.join(INPUT_PATH, injectAbleExcel);

export const TEMPLATE_PATH = path.join(MASTER_PATH, 'GDrive_Explorer_Ultra-tmplt.html');
export const FINAL_HTML_PATH = path.join(MASTER_PATH, 'GDrive_Explorer_Ultra.html');
// Public/shareable version of FINAL_HTML_PATH with all Google Drive links stripped out.
// Always overwritten, never backed up.
export const PUBLIC_HTML_PATH = path.join(MASTER_PATH, 'GDrive_Explorer_Ultra-v0.html');

export const REQUIRED_GDRIVE_KEYS: (keyof GDriveExcelItem)[] = [
    'S.No',
    'Title in Google Drive',
    'Link to File Location',
    'No. of Pages',
    'Size with Units',
    'Size in Bytes',
    'Folder Name',
    'Thumbnail',
    'Created Time',
];


export const REQUIRED_HTML_DATA_KEYS: (keyof HtmlDataType)[] = ['t', 'l', 's', 'f', 'th'];
