const path = require('path');
const { existsSync, mkdirSync } = require('fs');
const { copySync } = require('fs-extra');

const sourceDir = path.resolve(process.cwd(), 'static');
const destDir = path.resolve(process.cwd(), 'docs/static');

try {
    if (!existsSync(destDir)) {
        console.log(`making dir: ${destDir}`);
        mkdirSync(destDir);
    }

    copySync(sourceDir, destDir);
    console.log('Copied `static` dir.');
} catch (error) {
    console.error(error);
}
