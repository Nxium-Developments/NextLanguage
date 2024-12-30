const fs = require('fs');
const compiler = require('./interpreter');
const path = require('path');

module.exports = async function run(file) {
    const response = fs.readFileSync(file, 'utf8');
    const nxlCode = await response;

    // Parse and execute the NXL code
    const lines = nxlCode.split("\n").map(line => line.trim());

    compiler(lines);
};