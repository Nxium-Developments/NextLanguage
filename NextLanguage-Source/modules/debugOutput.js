const addOutput = require('./addOutput');
const { getPackages } = require('./localStorage');
const debug = getPackages().debugMode;

// Debug Output Modules
module.exports = function debugOutput(line, text) {
    // Check if debug mode is enabled
    if (debug === null) return;

    // Parse debug message from the line
    const debugMatch = line.match(/output:debug\((.+?)\)/);
    if (debugMatch) {
        const [, debugText] = debugMatch;
        addOutput(`Debug: ${debugText}`);
    }

    // Output provided text as debug info
    if (text) {
        addOutput(`Debug Info: ${text}`);
    }
}