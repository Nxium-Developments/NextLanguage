const { preloadContent } = require('./postloadContent.js');
const { postloadPath } = require('../../v1.8/contents.js');
const { existsSync, writeFileSync } = require('fs');

module.exports = function createPreload() {
    // Create the preload script if it doesn't exist
    if (!existsSync(postloadPath)) {
        console.warn('Preload script not found. Creating one at:', postloadPath);
        writeFileSync(postloadPath, postloadContent, 'utf-8');

        return true;
    }
}