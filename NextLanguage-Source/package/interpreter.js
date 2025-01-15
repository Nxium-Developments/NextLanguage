const centralParse = require('../modules/centralized-parser/parser.js');
const parseScript = require('../modules/centralized-parser/executor.js');

// Main Compiler Function
module.exports = async function compiler(lines) {
    const main = centralParse(lines);
    await parseScript(main);

    console.log(main)
};
