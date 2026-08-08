const fs = require('fs');
const c = fs.readFileSync('types/database.ts', 'utf8');
const hasAliases = c.includes('export type GalleryItem');
console.log(hasAliases ? 'aliases present' : 'MISSING');
console.log('Lines:', c.split('\n').length);
