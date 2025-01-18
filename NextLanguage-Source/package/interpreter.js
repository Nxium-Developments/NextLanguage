const centralParse = require('../modules/centralized/parser.js');
const parseScript = require('../modules/centralized/executor.js');

// Main Compiler Function
module.exports = async function compiler(lines) {
    const main = centralParse(lines);
    await parseScript(main);
};
