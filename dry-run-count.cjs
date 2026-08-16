const fs = require('fs');
const d = JSON.parse(fs.readFileSync('src/html/input/master-data.json', 'utf8'));
const frag = '"_freeze\\';
const m = d.filter(e => e.f && e.f.includes(frag));
console.log('total:', d.length, 'wouldRemove:', m.length, 'remaining:', d.length - m.length);
m.slice(0, 5).forEach(e => console.log('sample:', e.f));
