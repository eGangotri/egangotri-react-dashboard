//pnpm dlx tsx src/html/MasterDataReport.ts
import * as fs from "fs";
import { MASTER_JSON } from "./constants";
import { HtmlDataType } from "./types/HtmlDataType";

const data: HtmlDataType[] = JSON.parse(fs.readFileSync(MASTER_JSON, "utf-8"));

const getFolder = (item: HtmlDataType): string =>
  item.folder || (item.f || "").split("\\")[0];

const printItemCountByFolder = (items: HtmlDataType[]) => {
  const folderCounts = new Map<string, number>();
  for (const item of items) {
    const folder = getFolder(item);
    folderCounts.set(folder, (folderCounts.get(folder) || 0) + 1);
  }
  console.log(`Item count by folder (${folderCounts.size} folders):`);
  for (const [folder, count] of [...folderCounts.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${folder}: ${count}`);
  }
};

const countByKey = (items: HtmlDataType[], keyFn: (item: HtmlDataType) => string) => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyFn(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
};

const summarizeDuplicates = (counts: Map<string, number>) => {
  let duplicateKeys = 0;
  let duplicateItems = 0;
  for (const count of counts.values()) {
    if (count > 1) {
      duplicateKeys++;
      duplicateItems += count;
    }
  }
  return { duplicateKeys, duplicateItems };
};

const printDuplicationStats = (items: HtmlDataType[]) => {
  const withP = items.filter((item) => "p" in item).length;
  console.log(`Total items: ${items.length}`);
  console.log(`Items with "p": ${withP}`);
  console.log(`Items without "p": ${items.length - withP}`);

  const tDups = summarizeDuplicates(countByKey(items, (item) => item.t));
  console.log(`Duplicate "t" titles: ${tDups.duplicateKeys}`);
  console.log(`Items sharing a duplicate "t": ${tDups.duplicateItems}`);

  const folderTDups = summarizeDuplicates(countByKey(items, (item) => `${getFolder(item)}|${item.t}`));
  console.log(`Duplicate "t" titles within same folder: ${folderTDups.duplicateKeys}`);
  console.log(`Items sharing a duplicate "t" within same folder: ${folderTDups.duplicateItems}`);
};

const printTopFoldersWithDuplication = (items: HtmlDataType[], topN = 5) => {
  const folderTCounts = countByKey(items, (item) => `${getFolder(item)}|${item.t}`);
  const dupCountByFolder = new Map<string, number>();
  for (const [key, count] of folderTCounts.entries()) {
    if (count > 1) {
      const folder = key.split("|")[0];
      dupCountByFolder.set(folder, (dupCountByFolder.get(folder) || 0) + count);
    }
  }
  const topFolders = [...dupCountByFolder.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);
  console.log(`Top ${topN} folders with duplication:`);
  for (const [folder, count] of topFolders) {
    console.log(`  ${folder}: ${count} duplicate items`);
  }
};

printDuplicationStats(data);
printTopFoldersWithDuplication(data);
printItemCountByFolder(data);
