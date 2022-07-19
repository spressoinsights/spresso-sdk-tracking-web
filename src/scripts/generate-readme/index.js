const path = require('path');
const { readFileSync, writeFileSync } = require('fs');
const ejs = require('ejs');


const template = readFileSync(path.resolve(__dirname, './README.md.template'), 'utf-8');
const version = require('../../../package.json').version;

const newContent = ejs.render(template, { version }, {});

writeFileSync(path.resolve(__dirname, '../../../README.md'), newContent);
console.log(`README.md updated with SDK version ${version}.`); 