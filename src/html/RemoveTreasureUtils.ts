/// <reference types="node" />
import * as fs from 'fs';
import { MASTER_JSON } from './constants';
import { HtmlDataType } from './types/HtmlDataType';
import { backupJsonFile } from './backupUtils';

// pnpm dlx tsx src/html/RemoveTreasureUtils.ts

const stringToRemove = '_freeze\\'
const removeEntriesByFolder = (folderFragment: string): void => {
    const data: HtmlDataType[] = JSON.parse(fs.readFileSync(MASTER_JSON, 'utf8'));
    const before = data.length;
    const filtered = data.filter((e: HtmlDataType) => !(e.f && e.f.startsWith(folderFragment)));
    backupJsonFile(MASTER_JSON);
    fs.writeFileSync(MASTER_JSON, JSON.stringify(filtered, null, 2));
    console.log(`before: ${before} after: ${filtered.length} removed: ${before - filtered.length}`);
};

//removeEntriesByFolder(stringToRemove);

/**
 * Sample Output
 * Backup created: C:\ws\egangotri-react-dashboard\backup\master-data-backup-99351-Items-2026-08-15_09-02-20-038.json
before: 99351 after: 94289 removed: 5062
 */