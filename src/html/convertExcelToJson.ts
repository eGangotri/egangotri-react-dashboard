/// <reference types="node" />
import * as fs from 'fs';
import { readFile, utils } from 'xlsx';
import { GDriveExcelItem } from './types/GDriveExcelItem';
import { HtmlDataType } from './types/HtmlDataType';
import { INPUT_PATH, MASTER_JSON, REQUIRED_HTML_DATA_KEYS } from './constants';
import { injectGDriveDataIntoTemplate } from './injectGDriveData';

/**
 * pnpm run excelToHTML
 * add your latest Google Drive excel with name latest-XX.xlsx as input Folder
 * in call at bottom to 
 * const json = excelToJson('latest-XX.xlsx');
 * Make sure its a Google Drive Excel
 */


const excelToJson = (xlsxFileName: string) => {
    const excelPath = process.argv[2] || `${INPUT_PATH}${xlsxFileName}`;
    if (!fs.existsSync(excelPath)) {
        console.error(`Error: Excel file not found at ${excelPath}`);
        process.exit(1);
    }
    const outputJsonPath = `${excelPath.replace(/\.xlsx$/i, '')}.json`;

    const workbook = readFile(excelPath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = utils.sheet_to_json(worksheet);
    if (jsonData.length === 0) {
        console.error(`Error: No data rows found in ${excelPath}. Exiting.`);
        process.exit(1);
    }
    fs.writeFileSync(outputJsonPath, JSON.stringify(jsonData, null, 2));

    console.log(`Converted ${excelPath} -> ${outputJsonPath}`);
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


const validateHtmlDataItems = (raw: unknown, jsonPath: string): HtmlDataType[] => {
    if (!Array.isArray(raw) || raw.length === 0) {
        throw new Error(`${jsonPath} must contain a non-empty JSON array of html-data items`);
    }
    raw.forEach((item, idx) => {
        const missing = REQUIRED_HTML_DATA_KEYS.filter((key) => !(key in item));
        // if (missing.length > 0) {
        //     throw new Error(`${jsonPath}: item at index ${idx} is missing required field(s): ${missing.join(', ')}`);
        // }
    });
    return raw as HtmlDataType[];
};

const backupJsonFile = (jsonFilePath: string): string => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').replace('Z', '');
    const backupPath = jsonFilePath.replace(/\.json$/i, `-backup-${timestamp}.json`);
    fs.copyFileSync(jsonFilePath, backupPath);
    console.log(`Backup created: ${backupPath}`);
    return backupPath;
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

    const master = validateHtmlDataItems(JSON.parse(fs.readFileSync(masterJsonPath, 'utf-8')), masterJsonPath);
    const injectable = validateHtmlDataItems(JSON.parse(fs.readFileSync(injectableDataPath, 'utf-8')), injectableDataPath);

    const existingCount = master.length;
    const indexByLink = 
    new Map<string, number>(master.map((item, idx) => [item.l, idx]));

    let overwritten = 0;
    let added = 0;
    for (const item of injectable) {
        const existingIdx = indexByLink.get(item.l);
        if (existingIdx !== undefined) {
            master[existingIdx] = item;
            overwritten++;
        } else {
            indexByLink.set(item.l, injectable.length);
            master.push(item);
            added++;
        }
    }

    backupJsonFile(masterJsonPath);
    fs.writeFileSync(masterJsonPath, JSON.stringify(injectable, null, 2));

    console.log('--- Merge Report ---');
    console.log(`Target file:            ${injectableDataPath}`);
    console.log(`Source file:            ${masterJsonPath}`);
    console.log(`Existing items (before): ${existingCount}`);
    console.log(`Source items processed:  ${injectable.length}`);
    console.log(`New items written:       ${added}`);
    console.log(`Overwritten (dup link):  ${overwritten}`);
    console.log(`Total items (after):     ${injectable.length}`);

    return { existingCount, sourceCount: master.length,
         added, overwritten, totalAfter: master.length };
};

const json = excelToJson('latest.xlsx');
const htmlJson = gDriveExcelJsonToHtmlDataJson(json);
const result = mergeHtmlDataJsonFiles(MASTER_JSON,htmlJson)
console.log(result)
injectGDriveDataIntoTemplate();

//{"t": "Sanskrit Vangmaya Ka Brihat Itihas Volume 16 - Jyotisha - Ramachandra Pandey 2012.pdf", "l": "https://drive.google.com/file/d/1vNyKeufNjz5-z8DfrmID8SOhKFwpHWM4/view?usp=drivesdk", "s": "144.04 MB",  "f": "Treasures\\src_up_sansthan", "th": ""}