const path = require('path');
const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const ejs = require('ejs');

const template = readFileSync(path.resolve(__dirname, './README.md.template'), 'utf-8');
const version = require(path.resolve(process.cwd(), 'package.json')).version;

const newContent = ejs.render(template, { version }, {});

const readmePath = path.resolve(process.cwd(), 'docs');

if (!existsSync(readmePath)) {
    console.log(`making dir: ${readmePath}`);
    mkdirSync(readmePath);
}

writeFileSync(`${readmePath}/README.md`, newContent);
console.log(`README.md updated with SDK version ${version}.`);
