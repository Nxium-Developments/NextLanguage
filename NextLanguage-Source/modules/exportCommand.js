const { copyFileSync, readFileSync, existsSync } = require('fs');
const path = require('path');

const exporter = require('../patches/v1.9/exporter.js');
const mainPath = path.join(__dirname, "../../../CONFIG");

if (!existsSync(mainPath)) return;

const mainConfig = readFileSync(mainPath, 'utf-8');
const mainFile = path.join(__dirname, "../../../../" + mainConfig);
const dest = path.join(__dirname, "../imports/" + mainConfig);

module.exports = function exportCommand(line) {
    // Copy the main configuration file to the imports folder
    copyFileSync(mainFile, dest);
    const contents = readFileSync(dest, 'utf8');

    exporter(contents)
}