/// <reference types="node" />
import * as fs from 'fs';
import { readFile, utils } from 'xlsx';
import { GDriveExcelItem } from './types/GDriveExcelItem';
import { HtmlDataType } from './types/HtmlDataType';
import { FINAL_HTML_PATH, LATEST_INJECTABLE_EXCEL, MASTER_JSON, PUBLIC_HTML_PATH, REQUIRED_GDRIVE_KEYS, REQUIRED_HTML_DATA_KEYS } from './constants';
import { injectGDriveDataIntoTemplate } from './injectGDriveData';
import { backupJsonFile } from './backupUtils';
import { faLaptopHouse } from '@fortawesome/free-solid-svg-icons';

/**
 * pnpm run excelToHTML
 * add your latest Google Drive excel with name latest.xlsx as input Folder
 * in call at bottom to 
 * const json = excelToJson('latest.xlsx');
 * Make sure its a Google Drive Excel
 */


const excelToJson = (xlsxFileName: string) => {
    if (!fs.existsSync(xlsxFileName)) {
        console.error(`Error: Excel file not found at ${xlsxFileName}`);
        process.exit(1);
    }
    const outputJsonPath = `${xlsxFileName.replace(/\.xlsx$/i, '')}.json`;

    const workbook = readFile(xlsxFileName);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = utils.sheet_to_json(worksheet);
    if (jsonData.length === 0) {
        console.error(`Error: No data rows found in ${xlsxFileName}. Exiting.`);
        process.exit(1);
    }
    fs.writeFileSync(outputJsonPath, JSON.stringify(jsonData, null, 2));

    console.log(`Converted ${xlsxFileName} -> ${outputJsonPath}`);
    return outputJsonPath
}

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

const folderFromF = (f: string): string => (f ?? '').split('\\')[0];

const gDriveExcelJsonToHtmlDataJson = (inputJsonPath: string) => {
    const parsed = JSON.parse(fs.readFileSync(inputJsonPath, 'utf-8'));
    const items = validateGDriveExcelItems(parsed);
    const missingPages = items.filter((item) => item["No. of Pages"] === undefined || item["No. of Pages"] === null || String(item["No. of Pages"]).trim() === "");
    if (missingPages.length > 0) {
        console.log(`Cancelling entire operation: ${missingPages.length} item(s) in ${inputJsonPath} have no "No. of Pages" value. First offending title: ${missingPages[0]["Title in Google Drive"]}`);
        process.exit(1);
    }
    const htmlData: HtmlDataType[] = items.map((item) => ({
        t: item["Title in Google Drive"],
        l: item["Link to File Location"],
        p: String(item["No. of Pages"]),
        s: item["Size with Units"],
        sb: item["Size in Bytes"],
        f: item["Folder Name"],
        folder: folderFromF(item["Folder Name"]),
        th: item["Thumbnail"],
        c: item["Created Time"],
    }));

    const outputJsonPath = inputJsonPath.replace(/\.json$/, '-htmlData.json');
    fs.writeFileSync(outputJsonPath, JSON.stringify(htmlData, null, 2));
    console.log(`Converted ${items.length} items: ${inputJsonPath} -> ${outputJsonPath}`);
    return outputJsonPath;
}


const validateHtmlDataItems = (raw: unknown, jsonPath: string, throwError = false): HtmlDataType[] => {
    if (!Array.isArray(raw) || raw.length === 0) {
        throw new Error(`${jsonPath} must contain a non-empty JSON array of html-data items`);
    }
    raw.forEach((item, idx) => {
        const missing = REQUIRED_HTML_DATA_KEYS.filter((key) => !(key in item));
        if (missing.length > 0 && throwError) {
            throw new Error(`${jsonPath}: item at index ${idx} is missing required field(s): ${missing.join(', ')}`);
        }
    });
    return raw as HtmlDataType[];
};

/**
 * Merges items from sourceJsonPath into injectableDataPath (both absolute paths of
 * html-data JSON files, e.g. master-data.json). A backup of the target file is
 * taken before writing. Items whose "l" (link) already exists in the target
 * overwrite the existing entry; new links are appended. Prints a report.
 */
const mergeHtmlDataJsonFiles = ( masterJsonPath: string, injectableDataPath: string,) => {
    [ masterJsonPath, injectableDataPath,].forEach((p) => {
        if (!fs.existsSync(p)) {
            throw new Error(`File not found: ${p}`);
        }
    });

    const master = validateHtmlDataItems(JSON.parse(fs.readFileSync(masterJsonPath, 'utf-8')), masterJsonPath, false);
    const injectable = validateHtmlDataItems(JSON.parse(fs.readFileSync(injectableDataPath, 'utf-8')), injectableDataPath, true);

    const existingCount = master.length;
    const indexByLinkForMaster = 
    new Map<string, number>(master.map((item, idx) => [item.l, idx]));

    let overwritten = 0;
    let added = 0;
    for (const item of injectable) {
        const existingIdx = indexByLinkForMaster.get(item.l);
        if (existingIdx !== undefined) {
            master[existingIdx] = item;
            overwritten++;
        } else {
            indexByLinkForMaster.set(item.l, master.length);
            master.push(item);
            added++;
        }
    }

    for (const item of master) {
        if (!item.folder) {
            item.folder = folderFromF(item.f);
        }
    }

    backupJsonFile(masterJsonPath);
    fs.writeFileSync(masterJsonPath, JSON.stringify(master, null, 2));

    console.log('--- Merge Report ---');
    console.log(`Master-JSON Path:                             ${masterJsonPath}`);
    console.log(`Injectable Path:                              ${injectableDataPath}`);
    console.log(`Existing items (before) in Master-JSON:  ${existingCount}`);
    console.log(`Injectable items processed:              ${injectable.length}`);
    console.log(`New items written:                       ${added}`);
    console.log(`Overwritten (dup link):                  ${overwritten}`);
    console.log(`Total items (after) in Master-JSON:      ${master.length}`);

    return { existingCount, sourceCount: injectable.length,
         added, overwritten, totalAfter: master.length };
};

/**
 * Creates a public/shareable copy of GDrive_Explorer_Ultra.html as
 * GDrive_Explorer_Ultra-v0.html, with every Google Drive link removed:
 * - each item's "l" (file link) and "th" (thumbnail, which embeds the file id) are dropped
 * - the clickable title anchor is rendered as plain text instead
 * The -v0 file is always overwritten; no backup is taken.
 */
const createPublicHtmlWithoutGDriveLinks = () => {
    if (!fs.existsSync(FINAL_HTML_PATH)) {
        throw new Error(`Html not found: ${FINAL_HTML_PATH}. Run injectGDriveDataIntoTemplate() first.`);
    }

    const html = fs.readFileSync(FINAL_HTML_PATH, 'utf-8');
    const dataMatch = html.match(/state\.allData = (\[[\s\S]*?\n\]);/);
    if (!dataMatch) {
        throw new Error(`Could not locate "state.allData = [...];" in ${FINAL_HTML_PATH}`);
    }

    const allData = JSON.parse(dataMatch[1]) as HtmlDataType[];
    const publicData = allData.map(({ l, th, ...rest }) => ({ ...rest, l: '', th: '' }));

    let publicHtml = html.replace(dataMatch[0], `state.allData = ${JSON.stringify(publicData, null, 2)};`);

    const titleAnchor = '<a href="${item.l}" target="_blank" class="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline leading-tight block mb-1">${hTitle}</a>';
    if (!publicHtml.includes(titleAnchor)) {
        throw new Error(`Could not locate the title anchor markup in ${FINAL_HTML_PATH}; template markup may have changed`);
    }
    publicHtml = publicHtml.split(titleAnchor).join(
        '<span class="text-sm font-semibold text-gray-800 leading-tight block mb-1">${hTitle}</span>'
    );

    if (/drive\.google\.com|docs\.google\.com/.test(publicHtml)) {
        throw new Error(`Google Drive links still present in generated public html; aborting write of ${PUBLIC_HTML_PATH}`);
    }

    fs.writeFileSync(PUBLIC_HTML_PATH, publicHtml);
    console.log(`Created ${PUBLIC_HTML_PATH} with ${publicData.length} items (no GDrive links)`);
    return PUBLIC_HTML_PATH;
};

const json = excelToJson(LATEST_INJECTABLE_EXCEL);
const htmlJson = gDriveExcelJsonToHtmlDataJson(json);
const result = mergeHtmlDataJsonFiles(MASTER_JSON,htmlJson)
console.log(result)
injectGDriveDataIntoTemplate();
createPublicHtmlWithoutGDriveLinks();

// * pnpm run excelToHTML

//{"t": "Sanskrit Vangmaya Ka Brihat Itihas Volume 16 - Jyotisha - Ramachandra Pandey 2012.pdf", "l": "https://drive.google.com/file/d/1vNyKeufNjz5-z8DfrmID8SOhKFwpHWM4/view?usp=drivesdk", "s": "144.04 MB",  "f": "Treasures\\src_up_sansthan", "th": ""}