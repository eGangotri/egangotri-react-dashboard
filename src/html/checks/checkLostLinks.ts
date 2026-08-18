import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

//pnpm dlx tsx src/html/checks/checkLostLinks.ts 1-3
// pnpm dlx tsx src/html/checks/checkLostLinks.ts 1-3 Treasure
// pnpm dlx tsx src/html/checks/checkLostLinks.ts 'Treasures 2'

const MASTER_DATA_PATH = path.resolve(__dirname, '../input/master-data.json');
const OUTPUT_DIR = path.resolve(__dirname, '../output');

interface MasterDataItem {
    t: string;
    l?: string;
    f?: string;
    [key: string]: unknown;
}

interface ScrapeResult {
    items: unknown[];
    count: number;
    total: number;
}

// Function 1: extract all "t" values (stripping the trailing .pdf extension) along with "f"
export function getArrayOfTitles(): Array<{ title: string; folder: string }> {
    const raw = fs.readFileSync(MASTER_DATA_PATH, 'utf-8');
    const data: MasterDataItem[] = JSON.parse(raw);
    return data
        .filter((item) => typeof item.t === 'string')
        .map((item) => ({
            title: item.t.replace(/\.pdf$/i, '').trim(),
            folder: typeof item.f === 'string' ? item.f : '',
        }));
}

// Function 2: encode title, hit archive.org scrape API, collect totals, save to Excel
export async function searchArchiveAndExport(range?: string, folderPrefix?: string): Promise<void> {
    let allTitles = getArrayOfTitles();
    if (folderPrefix) {
        const prefixLower = folderPrefix.toLowerCase();
        allTitles = allTitles.filter(({ folder }) => folder.toLowerCase().startsWith(prefixLower));
        console.log(`Folder filter "${folderPrefix}*" matched ${allTitles.length} items`);
        if (allTitles.length === 0) {
            console.warn('No items matched the folder filter. Exiting.');
            return;
        }
    }
    const [start, end] = parseRange(range, allTitles.length);
    const titles = allTitles.slice(start - 1, end);
    console.log(`Processing ${titles.length} of ${allTitles.length} titles (range ${start}-${end})`);

    const rows: Array<{ Title: string; Folder: string; 'Main-Folder': string; EncodedUrl: string; Total: number | string }> = [];

    for (let i = 0; i < titles.length; i++) {
        const { title, folder } = titles[i];
        const query = encodeURIComponent(sanitizeForLucene(title)).replace(/%20/g, '+');
        const url = `https://archive.org/services/search/v1/scrape?q=${query}&total_only=true`;
        const total = await fetchTotalWithRetry(url, title);
        rows.push({ Title: title, Folder: folder, 'Main-Folder': getMainFolder(folder), EncodedUrl: url, Total: total });
        console.log(`${start + i}. ${title} -> ${total}`);
        await sleep(300);
    }

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filterTag = folderPrefix ? `-${folderPrefix.replace(/[^\w-]+/g, '_')}` : '';
    const outputPath = path.join(OUTPUT_DIR, `archive-search-results-${start}-${end}${filterTag}-${timestamp}.xlsx`);

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
    const summarySheet = XLSX.utils.json_to_sheet(buildSummaryRows(rows));
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    XLSX.writeFile(workbook, outputPath);
    console.log(`Saved ${rows.length} rows to ${outputPath}`);
}

// Strips Lucene query operators (-, :, (), [], etc.) that make archive.org's scrape API
// silently return 0 matches; e.g. a hyphen acts as a NOT operator
function sanitizeForLucene(title: string): string {
    return title
        .replace(/[+\-!(){}\[\]^"~*?:\\/&|]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fetches the scrape total with retries; also retries when total is 0 once, since
// transient archive.org hiccups/throttling can produce false zeros
// Errors are stored as -1
async function fetchTotalWithRetry(url: string, title: string, maxAttempts = 3): Promise<number | string> {
    let total: number | string = -1;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            const json = (await res.json()) as ScrapeResult;
            total = json.total;
            if (total !== 0 || attempt >= 2) {
                return total;
            }
            console.warn(`Got 0 for "${title}", retrying to rule out a transient miss...`);
        } catch (err) {
            console.error(`Attempt ${attempt} failed for "${title}":`, (err as Error).message);
        }
        await sleep(1000 * attempt);
    }
    return total;
}

// Builds summary rows grouped by Main-Folder: total items in master-data.json per main folder,
// plus counts of processed items by their archive.org Total (0, 1, 2, 3, 4, 5+)
function buildSummaryRows(
    rows: Array<{ 'Main-Folder': string; Total: number | string }>,
): Array<Record<string, string | number>> {
    const masterCounts = new Map<string, number>();
    for (const { folder } of getArrayOfTitles()) {
        const main = getMainFolder(folder);
        masterCounts.set(main, (masterCounts.get(main) ?? 0) + 1);
    }

    const groups = new Map<string, { errors: number; 0: number; 1: number; 2: number; 3: number; 4: number; '5+': number }>();
    for (const row of rows) {
        const main = row['Main-Folder'];
        if (!groups.has(main)) {
            groups.set(main, { errors: 0, 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, '5+': 0 });
        }
        const counts = groups.get(main)!;
        const total = row.Total;
        if (typeof total === 'number') {
            if (total < 0) {
                counts.errors++;
            } else if (total >= 5) {
                counts['5+']++;
            } else {
                counts[total as 0 | 1 | 2 | 3 | 4]++;
            }
        }
    }

    return Array.from(groups.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([main, counts]) => ({
            'Main-Folder': main,
            'Total Items in Master Data': masterCounts.get(main) ?? 0,
            'Error Count': counts.errors,
            'Count Total=0': counts[0],
            'Count Total=1': counts[1],
            'Count Total=2': counts[2],
            'Count Total=3': counts[3],
            'Count Total=4': counts[4],
            'Count Total>=5': counts['5+'],
        }));
}

// Extracts the first parent segment of a path, e.g. "Treasures 2\\src_amit" -> "Treasures 2"
function getMainFolder(folder: string): string {
    if (!folder) {
        return '';
    }
    return folder.split(/[\\/]/)[0].trim();
}

// Parses "20-50" style ranges; clamps to [1, length]; defaults to full range
function parseRange(range: string | undefined, length: number): [number, number] {
    if (!range) {
        return [1, length];
    }
    const match = range.match(/^(\d+)\s*-\s*(\d+)$/);
    if (!match) {
        console.warn(`Invalid range "${range}", processing everything`);
        return [1, length];
    }
    let start = Math.max(1, parseInt(match[1], 10));
    let end = Math.min(length, parseInt(match[2], 10));
    if (start > end) {
        [start, end] = [Math.max(1, Math.min(start, length)), end || length];
        if (start > end) {
            start = 1;
            end = length;
        }
    }
    return [start, end];
}

// CLI entry: pnpm dlx tsx src/html/checks/checkLostLinks.ts [range] [folderPrefix]
// e.g. pnpm dlx tsx src/html/checks/checkLostLinks.ts 1-10
//      pnpm dlx tsx src/html/checks/checkLostLinks.ts 1-10 Treasures-2
//      pnpm dlx tsx src/html/checks/checkLostLinks.ts Treasures-5   (range optional)
//      pnpm dlx tsx src/html/checks/checkLostLinks.ts 1-10 "Treasures 9"   (quoted, spaces ok)
//      pnpm dlx tsx src/html/checks/checkLostLinks.ts 1-10 Treasures 9     (unquoted also works)
const cliArgs = process.argv.slice(2);
let rangeArg: string | undefined;
const folderPrefixParts: string[] = [];
for (const arg of cliArgs) {
    if (/^\d+\s*-\s*\d+$/.test(arg) && rangeArg === undefined) {
        rangeArg = arg;
    } else {
        folderPrefixParts.push(arg);
    }
}
// Join remaining args so unquoted prefixes with spaces (e.g. Treasures 9) work,
// and strip surrounding single/double quotes if the shell passed them through.
let folderPrefixArg: string | undefined = folderPrefixParts.length > 0 ? folderPrefixParts.join(' ') : undefined;
if (folderPrefixArg) {
    folderPrefixArg = folderPrefixArg.replace(/^(['"])(.*)\1$/, '$2').trim() || undefined;
}
searchArchiveAndExport(rangeArg, folderPrefixArg).catch((err) => {
    console.error(err);
    process.exit(1);
});
