/// <reference types="node" />
import * as fs from 'fs';
import * as path from 'path';
import { INPUT_PATH, MASTER_JSON, FINAL_HTML_PATH, TEMPLATE_PATH } from './constants';



function getUniqueBackupPath(filePath: string): string {
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .replace('T', '_')
    .replace('Z', '');
  const base = filePath.replace(/\.html$/i, '');

  let candidate = `${base}-backup-${timestamp}.html`;
  if (!fs.existsSync(candidate)) return candidate;

  for (let i = 1; i < Number.MAX_SAFE_INTEGER; i++) {
    candidate = `${base}-backup-${timestamp}-${i}.html`;
    if (!fs.existsSync(candidate)) return candidate;
  }
  throw new Error('Could not find a unique backup path');
}

export function injectGDriveDataIntoTemplate(): void {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    throw new Error(`Template not found: ${TEMPLATE_PATH}`);
  }
  if (!fs.existsSync(MASTER_JSON)) {
    throw new Error(`Data not found: ${MASTER_JSON}`);
  }

  const rawData = JSON.parse(fs.readFileSync(MASTER_JSON, 'utf-8'));
  if (!Array.isArray(rawData)) {
    throw new Error('data.json must contain a JSON array');
  }

  const html = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
  const marker = 'state.allData = [];'; // matches the assignment in the template
  const markerIndex = html.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(`Marker "${marker}" not found in template`);
  }

  const dataJson = JSON.stringify(rawData, null, 2);
  const injectedHtml =
    html.slice(0, markerIndex) +
    `state.allData = ${dataJson};` +
    html.slice(markerIndex + marker.length);

  if (fs.existsSync(FINAL_HTML_PATH)) {
    const backupPath = getUniqueBackupPath(FINAL_HTML_PATH);
    fs.renameSync(FINAL_HTML_PATH, backupPath);
    console.log(`Backed up existing ${FINAL_HTML_PATH} -> ${backupPath}`);
  }

  fs.writeFileSync(FINAL_HTML_PATH, injectedHtml);
  console.log(`Created ${FINAL_HTML_PATH} with ${rawData.length} items`);
}

//injectGDriveData();
// pnpm dlx tsx ./src/html/injectGDriveData.ts
