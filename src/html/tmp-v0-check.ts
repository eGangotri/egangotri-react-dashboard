//pnpm dlx tsx ./src/html/tmp-v0-check.ts

import * as fs from 'fs';
import { FINAL_HTML_PATH, PUBLIC_HTML_PATH } from './constants';
const html = fs.readFileSync(FINAL_HTML_PATH, 'utf-8');
const dataMatch = html.match(/state\.allData = (\[[\s\S]*?\n\]);/);
console.log('dataMatch found:', !!dataMatch);
const allData = JSON.parse(dataMatch![1]);
console.log('items:', allData.length);
const publicData = allData.map(({ l, th, ...rest }: any) => ({ ...rest, l: '', th: '' }));
let publicHtml = html.replace(dataMatch![0], `state.allData = ${JSON.stringify(publicData, null, 2)};`);
const titleAnchor = '<a href="${item.l}" target="_blank" class="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline leading-tight block mb-1">${hTitle}</a>';
console.log('anchor found:', publicHtml.includes(titleAnchor));
publicHtml = publicHtml.split(titleAnchor).join('<span class="text-sm font-semibold text-gray-800 leading-tight block mb-1">${hTitle}</span>');
console.log('gdrive links remaining:', /drive\.google\.com|docs\.google\.com/.test(publicHtml));
fs.writeFileSync(PUBLIC_HTML_PATH, publicHtml);
console.log('wrote', PUBLIC_HTML_PATH);
