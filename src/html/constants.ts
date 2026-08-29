import { GDriveExcelItem } from "./types/GDriveExcelItem";
import { HtmlDataType } from "./types/HtmlDataType";
import * as path from 'path';

export const INPUT_PATH = path.join(process.cwd(), `./src/html/input/`);
export const MASTER_JSON = path.join(INPUT_PATH, 'master-data.json');
export const BACKUP_DIR = path.join(INPUT_PATH, 'backup');

//pnpm run excelToHTML
const injectAbleExcel = "latest-78.xlsx" //start with  80.
export const LATEST_INJECTABLE_EXCEL =  path.join(INPUT_PATH, injectAbleExcel);

export const TEMPLATE_PATH = path.join(INPUT_PATH, 'GDrive_Explorer_Ultra-tmplt.html');
export const FINAL_HTML_PATH = path.join(INPUT_PATH, 'GDrive_Explorer_Ultra.html');

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
