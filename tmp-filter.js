const fs = require('fs');
const raw = fs.readFileSync(path, 'utf8');
const d = JSON.parse(raw);

if (!Array.isArray(d)) {
  console.log('Not an array. Top-level keys:', Object.keys(d));
  process.exit(1);
}

console.log('Total objects:', d.length);
const targets = new Set(['Treasures62', 'Treasures61']);
const toRemove = d.filter(o => targets.has(o.folder) && !('p' in o));
console.log('Objects to remove (folder 61/62 without "p"):', toRemove.length);
console.log('Sample:', JSON.stringify(toRemove.slice(0, 2), null, 2));

const filtered = d.filter(o => !(targets.has(o.folder) && !('p' in o)));
fs.writeFileSync(MASTER_JSON, JSON.stringify(filtered, null, 2));
console.log('Remaining objects:', filtered.length);
