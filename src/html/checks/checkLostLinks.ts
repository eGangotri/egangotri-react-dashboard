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
    items: Array<{ identifier: string }>;
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

/**
 * Transforms an input raw title string into Internet Archive's normalized title format.
 * 
 * @param input - Raw title string (e.g., "Geeta Govinda of Jaya Deva_6127_1861_Devanagari - Sahitya_Part10")
 * @returns Cleaned title string (e.g., "Geeta Govinda Of Jaya Deva 6127 1861 Devanagari Sahitya Part 10")
 */
function cleanArchiveTitle(input: string): string {
  return input
    // 1. Separate transitions from letters into numbers (e.g., "Part10" -> "Part 10");
    // digit-to-letter transitions like "14th" are left untouched
    .replace(/([a-zA-Z])(?=\d)/g, '$1 ')
    // 1a. Separate transitions from numbers into uppercase letters (e.g., "25Shlf" -> "25 Shlf");
    // lowercase suffixes like "4th", "5th" are left untouched
    .replace(/(\d)(?=[A-Z])/g, '$1 ')
    // 1b. Insert a space after a dot when an uppercase letter follows
    // (e.g., "Dr.Gokul" -> "Dr. Gokul", "K.C" -> "K. C"); "Dr.gokul" stays untouched
    .replace(/\.(?=[A-Z])/g, '. ')
    // 1c. Split camelCase/PascalCase words at lowercase-to-uppercase transitions
    // (e.g., "PanchangaVijayaKalpa" -> "Panchanga Vijaya Kalpa")
    .replace(/([a-z])(?=[A-Z])/g, '$1 ')
    // 2. Replace hyphens, underscores, and punctuation symbols with a single space
    .replace(/[-_]/g, ' ')
    // 3. Collapse multiple spaces into a single space and trim edges
    .replace(/\s+/g, ' ')
    .trim()
    // 4. Convert to Title Case (capitalizes the first letter of every word)
    .replace(/\b\w/g, (char) => char.toUpperCase());
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
    console.log(`Processing ${titles.length} of ${allTitles.length} titles (range ${start}-${end})\n`);

    const rows: Array<{ Title: string; Folder: string; 'Main-Folder': string; Total: number | string; 'Cleaned Title': string; EncodedUrl: string; Identifiers: string }> = [];

    for (let i = 0; i < titles.length; i++) {
        const { title, folder } = titles[i];
        const cleanedTitle = cleanArchiveTitle(title);
        const query = encodeURIComponent(sanitizeForLucene(cleanedTitle)).replace(/%20/g, '+');
        const url = `https://archive.org/services/search/v1/scrape?q=${query}&fields=identifier`;
        //console.log(`url: ${url}`)
        const { total, identifiers } = await fetchTotalWithRetry(url, title);
        rows.push({ Title: title, Folder: folder, 'Main-Folder': getMainFolder(folder), Total: total, 'Cleaned Title': cleanedTitle, EncodedUrl: url, Identifiers: identifiers.join(', ') });
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
    console.log(`\nSaved ${rows.length} rows to ${outputPath}`);
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

// Fetches actual matched identifiers (not total_only) so the total is grounded in real items;
// archive.org's reported total can be stale/inconsistent between calls, so the count of
// returned identifiers is used as the authoritative number. Errors are stored as -1.
async function fetchTotalWithRetry(url: string, title: string, maxAttempts = 3): Promise<{ total: number; identifiers: string[] }> {
    let result = { total: -1, identifiers: [] as string[] };
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            const json = (await res.json()) as ScrapeResult;
            const identifiers = (json.items ?? []).map((item) => item.identifier);
            result = { total: identifiers.length, identifiers };
            if (json.total !== identifiers.length) {
                console.warn(`Inconsistent response for "${title}": reported total=${json.total} but ${identifiers.length} item(s) returned; using ${identifiers.length}`);
            }
            if (result.total !== 0 || attempt >= 2) {
                return result;
            }
            console.warn(`Got 0 for "${title}", retrying to rule out a transient miss...`);
        } catch (err) {
            console.error(`Attempt ${attempt} failed for "${title}":`, (err as Error).message);
        }
        await sleep(1000 * attempt);
    }
    return result;
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
