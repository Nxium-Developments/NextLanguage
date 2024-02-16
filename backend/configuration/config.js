// config.js

const fs = require('fs');

// Read input from file
const inputFile = 'input.nxl';
fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // Tokenize and parse input
    const tokens = lex(data);
    parse(tokens);
});

function getCurrentFilenames() {
    console.log("\nCurrent filenames:");
    fs.readdirSync(__dirname).forEach(file => {
        console.log(file);
    });
}
