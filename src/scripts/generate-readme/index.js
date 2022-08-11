const path = require('path');
const { readFileSync, writeFileSync } = require('fs');
const ejs = require('ejs');

const template = readFileSync(path.resolve(__dirname, './README.md.template'), 'utf-8');
const version = require(path.resolve(process.cwd(), 'package.json')).version;

const newContent = ejs.render(template, { version }, {});

writeFileSync(path.resolve(process.cwd(), 'docs/README.md'), newContent);
console.log(`README.md updated with SDK version ${version}.`); 