/// <reference types="node" />
import * as fs from 'fs';
import * as path from 'path';
import { BACKUP_DIR } from './constants';

export const backupJsonFile = (jsonFilePath: string): string => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').replace('Z', '');
    let itemCountLabel = '';
    try {
        const parsed = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
        if (Array.isArray(parsed)) {
            itemCountLabel = `${parsed.length}-Items-`;
        }
    } catch {
        // if unreadable/unparseable, skip the count in the filename
    }
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    const backupFileName = path.basename(jsonFilePath).replace(/\.json$/i, `-backup-${itemCountLabel}${timestamp}.json`);
    const backupPath = path.join(BACKUP_DIR, backupFileName);
    fs.copyFileSync(jsonFilePath, backupPath);
    console.log(`Backup created: ${backupPath}`);
    return backupPath;
};
