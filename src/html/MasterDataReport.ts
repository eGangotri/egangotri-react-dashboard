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

const withP = data.filter((item) => "p" in item).length;
const withoutP = data.length - withP;

console.log(`Total items: ${data.length}`);
console.log(`Items with "p": ${withP}`);
console.log(`Items without "p": ${withoutP}`);

const tCounts = new Map<string, number>();
for (const item of data) {
  tCounts.set(item.t, (tCounts.get(item.t) || 0) + 1);
}
let duplicateItems = 0;
let duplicateTitles = 0;
for (const count of tCounts.values()) {
  if (count > 1) {
    duplicateTitles++;
    duplicateItems += count;
  }
}
console.log(`Duplicate "t" titles: ${duplicateTitles}`);
console.log(`Items sharing a duplicate "t": ${duplicateItems}`);

const folderTCounts = new Map<string, number>();
for (const item of data) {
  const key = `${getFolder(item)}|${item.t}`;
  folderTCounts.set(key, (folderTCounts.get(key) || 0) + 1);
}
let duplicateItemsInFolder = 0;
let duplicateTitlesInFolder = 0;
for (const count of folderTCounts.values()) {
  if (count > 1) {
    duplicateTitlesInFolder++;
    duplicateItemsInFolder += count;
  }
}
console.log(`Duplicate "t" titles within same folder: ${duplicateTitlesInFolder}`);
console.log(`Items sharing a duplicate "t" within same folder: ${duplicateItemsInFolder}`);

const dupCountByFolder = new Map<string, number>();
for (const [key, count] of folderTCounts.entries()) {
  if (count > 1) {
    const folder = key.split("|")[0];
    dupCountByFolder.set(folder, (dupCountByFolder.get(folder) || 0) + count);
  }
}
const top5 = [...dupCountByFolder.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);
console.log(`Top 5 folders with duplication:`);
for (const [folder, count] of top5) {
  console.log(`  ${folder}: ${count} duplicate items`);
}

printItemCountByFolder(data);
