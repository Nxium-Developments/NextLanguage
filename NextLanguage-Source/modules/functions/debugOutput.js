const addOutput = require('./addOutput.js');
const Debug = require('../class/debug/Debug.js');
const debug = new Debug();

// Debug Output Modules
module.exports = function debugOutput(text) {
    // Check if debug mode is enabled
    if (debug === false) return;

    // Output provided text as debug info
    if (text) {
        addOutput(`Debug Info: ${text}`);
    }
}