const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'servidor/data/tienda.json');
const content = fs.readFileSync(filePath, 'utf8');
const newContent = content.replace(/"img":/g, '"imagen":');

fs.writeFileSync(filePath, newContent);
console.log('Updated tienda.json');
