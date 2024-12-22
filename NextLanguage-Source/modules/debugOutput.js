const addOutput = require('./addOutput.js');
const { getPackages } = require('./localStorage');
const debug = getPackages().debugMode;

// Debug Output Modules
module.exports = function debugOutput(line, text) {
    // Check if debug mode is enabled
    if (debug === false) return;

    // Output provided text as debug info
    if (text) {
        addOutput(`Debug Info: ${text}`);
    }
}