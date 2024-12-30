const { preloadContent } = require('./preloadContent.js');
const { preloadPath } = require("../../../../v1.8/contents.js");
const { existsSync, writeFileSync } = require('fs');
const debugOutput = require('../../../../../modules/functions/debugOutput.js');

module.exports = async function createPreload(line) {
    // Create the preload script if it doesn't exist
    if (!existsSync(preloadPath)) {
        console.warn('Preload script not found. Creating one at:', preloadPath);
        writeFileSync(preloadPath, preloadContent, 'utf-8');

        debugOutput(line, `Running preload script as default (No commands nested/nor listed)`);
        return "false";
    } else {
        return "true";
    }
}