const addOutput = require('./addOutput.js');
const Debug = require('../class/Debug.js');
const debug = new Debug().debugMode;

// Debug Output Modules
module.exports = function debugOutput(text) {
    // Check if debug mode is enabled
    if (debug === false) return;

    // Output provided text as debug info
    if (text) {
        addOutput(`Debug Info: ${text}`);
    }
}