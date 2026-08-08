const fs = require('fs');
const path = require('path');

const outputFile = 'C:/Users/rajni/.gemini/antigravity/brain/b1164f88-4c56-4763-80c5-07ac4dcb01af/.system_generated/steps/1294/output.txt';
const destFile = path.join(__dirname, '..', 'types', 'database.ts');

const raw = fs.readFileSync(outputFile, 'utf8');
const parsed = JSON.parse(raw);
fs.writeFileSync(destFile, parsed.types, 'utf8');
console.log('database.ts updated —', parsed.types.length, 'bytes written');
