//node src/html/countMasterData.js
const fs = require("fs");
const path = require("path");

const data = JSON.parse(fs.readFileSync(path.join(__dirname, "input","master-data.json"), "utf8"));

const withP = data.filter((item) => "p" in item).length;
const withoutP = data.length - withP;

console.log(`Total items: ${data.length}`);
console.log(`Items with "p": ${withP}`);
console.log(`Items without "p": ${withoutP}`);

const tCounts = new Map();
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

const folderTCounts = new Map();
for (const item of data) {
  const folder = item.folder || (item.f || "").split("\\")[0];
  const key = `${folder}|${item.t}`;
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

const dupCountByFolder = new Map();
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

//node countMasterData.js