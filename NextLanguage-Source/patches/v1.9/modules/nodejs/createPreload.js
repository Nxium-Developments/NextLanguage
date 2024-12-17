const { preloadContent } = require('../../storage/preloadContent');
const preloadPath = path.join(__dirname, '../../../../../preload.js');
const { existsSync, writeFileSync } = require('fs');

module.exports = function createPreload() {
    // Create the preload script if it doesn't exist
    if (!existsSync(preloadPath)) {
        console.warn('Preload script not found. Creating one at:', preloadPath);
        writeFileSync(preloadPath, preloadContent, 'utf-8');

        return true;
    }
}

module.exports = preloadPath;