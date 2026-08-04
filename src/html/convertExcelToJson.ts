/// <reference types="node" />
import * as fs from 'fs';
import * as path from 'path';
import { readFile, utils } from 'xlsx';
import { GDriveExcelItem } from './types/GDriveExcelItem';
import { HtmlDataType } from './types/HtmlDataType';

/**
 * pnpm run excelToHTML
 * add your latest Google Drive excel with name latest-XX.xlsx as input Folder
 * in call at bottom to 
 * const json = excelToJson('latest-XX.xlsx');
 * Make sure its a Google Drive Excel

 * 
 */
const excelToJson = (xlsxFileName:string) => {
    const excelPath = process.argv[2] || path.join(process.cwd(), `./src/html/input/${xlsxFileName}`);
    if (!fs.existsSync(excelPath)) {
        console.error(`Error: Excel file not found at ${excelPath}`);
        process.exit(1);
    }
    const outputJsonPath = `${excelPath.replace(/\.xlsx$/i, '')}.json`;

    const workbook = readFile(excelPath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = utils.sheet_to_json(worksheet);
    fs.writeFileSync(outputJsonPath, JSON.stringify(jsonData, null, 2));

    console.log(`Converted ${excelPath} -> ${outputJsonPath}`);
    return outputJsonPath
}

const REQUIRED_GDRIVE_KEYS: (keyof GDriveExcelItem)[] = [
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

const validateGDriveExcelItems = (raw: unknown): GDriveExcelItem[] => {
    if (!Array.isArray(raw) || raw.length === 0) {
        throw new Error('The excel/json headers are not of type GDriveExcelItem. Are you by mistake using a Local Hard Drive Data Excel, We need Google Drive Excel');
    }
    const first = raw[0];
    const missing = REQUIRED_GDRIVE_KEYS.filter((key) => !(key in first));
    if (missing.length > 0) {
        throw new Error('The excel/json headers are not of type GDriveExcelItem. Are you by mistake using a Local Hard Drive Data Excel, We need Google Drive Excel');
    }
    return raw as GDriveExcelItem[];
};

const gDriveExcelJsonToHtmlDataJson = (inputJsonPath: string) => {
    const parsed = JSON.parse(fs.readFileSync(inputJsonPath, 'utf-8'));
    const items = validateGDriveExcelItems(parsed);
    const htmlData: HtmlDataType[] = items.map((item) => ({
        t: item["Title in Google Drive"],
        l: item["Link to File Location"],
        p: String(item["No. of Pages"]),
        s: item["Size with Units"],
        sb: item["Size in Bytes"],
        f: item["Folder Name"],
        th: item["Thumbnail"],
        c: item["Created Time"],
    }));

    const outputJsonPath = inputJsonPath.replace(/\.json$/, '-htmlData.json');
    fs.writeFileSync(outputJsonPath, JSON.stringify(htmlData, null, 2));
    console.log(`Converted ${items.length} items: ${inputJsonPath} -> ${outputJsonPath}`);
    return outputJsonPath;
}

const backupHtmlFile = (htmlFilePath: string) => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const backupPath = htmlFilePath.replace(/\.html$/, `-backup-${today}.html`);
    fs.copyFileSync(htmlFilePath, backupPath);
    console.log(`Backup created: ${backupPath}`);
}

// Find the bounds of the state.allData array in the HTML,
// skipping over string literals so brackets inside JSON strings are ignored.
const findAllDataBounds = (html: string, htmlFilePath: string) => {
    const marker = 'state.allData = [';
    const startIdx = html.indexOf(marker);
    if (startIdx === -1) {
        throw new Error(`Could not find "${marker}" in ${htmlFilePath}`);
    }

    let depth = 1;
    let inString = false;
    for (let i = startIdx + marker.length; i < html.length; i++) {
        const ch = html[i];
        if (inString) {
            if (ch === '\\') i++; // skip escaped char
            else if (ch === '"') inString = false;
        } else if (ch === '"') {
            inString = true;
        } else if (ch === '[') {
            depth++;
        } else if (ch === ']') {
            depth--;
            if (depth === 0) {
                return { arrayStartIdx: startIdx + marker.length - 1, endIdx: i };
            }
        }
    }
    throw new Error(`Could not find closing "]" of state.allData in ${htmlFilePath}`);
}

const extractExistingLinks = (existingData: string): Set<string> =>
    new Set([...existingData.matchAll(/"l"\s*:\s*"([^"]*)"/g)].map((m) => m[1]));

const filterOutDuplicates = (items: HtmlDataType[], existingLinks: Set<string>): HtmlDataType[] => {
    const newItems = items.filter((item) => !existingLinks.has(item.l));
    const skipped = items.length - newItems.length;
    if (skipped > 0) {
        console.log(`Skipped ${skipped} items with duplicate links`);
    }
    return newItems;
}

// Strip outer [ ] from the new items' JSON and inject before the closing bracket
const injectItemsIntoHtml = (html: string, endIdx: number, newItems: HtmlDataType[]): string => {
    const itemsJson = JSON.stringify(newItems, null, 2).slice(1, -1).trimEnd();
    return html.slice(0, endIdx) + ',\n' + itemsJson + '\n' + html.slice(endIdx);
}

const injectHtmlJsonIntoGDriveExplorer = (htmlJsonPath: string) => {
    const htmlFilePath = path.join(process.cwd(), './src/html/input/GDrive_Explorer_Ultra.html');

    const items: HtmlDataType[] = JSON.parse(fs.readFileSync(htmlJsonPath, 'utf-8'));
    const html = fs.readFileSync(htmlFilePath, 'utf-8');

    const { arrayStartIdx, endIdx } = findAllDataBounds(html, htmlFilePath);
    const existingLinks = extractExistingLinks(html.slice(arrayStartIdx, endIdx + 1));
    const newItems = filterOutDuplicates(items, existingLinks);

    if (newItems.length === 0) {
        console.log(`No new items to inject into ${htmlFilePath}`);
        return;
    }

    backupHtmlFile(htmlFilePath);
    const updatedHtml = injectItemsIntoHtml(html, endIdx, newItems);
    fs.writeFileSync(htmlFilePath, updatedHtml);
    console.log(`Injected ${newItems.length} items into state.allData of ${htmlFilePath}`);
}

const json = excelToJson('latest-94.xlsx');
const htmlJson = gDriveExcelJsonToHtmlDataJson(json);
injectHtmlJsonIntoGDriveExplorer(htmlJson);

//{"t": "Sanskrit Vangmaya Ka Brihat Itihas Volume 16 - Jyotisha - Ramachandra Pandey 2012.pdf", "l": "https://drive.google.com/file/d/1vNyKeufNjz5-z8DfrmID8SOhKFwpHWM4/view?usp=drivesdk", "s": "144.04 MB",  "f": "Treasures\\src_up_sansthan", "th": ""}