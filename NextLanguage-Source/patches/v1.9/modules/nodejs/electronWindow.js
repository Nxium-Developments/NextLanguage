// In the main process
const { BrowserWindow } = require('electron');
const path = require('path');
const { existsSync, writeFileSync } = require('fs');
const { indexFileContents, preloadContent } = require('../../storage/preloadContent');
const preloadPath = path.join(__dirname, '../../../../../preload.js');

// Create the preload script if it doesn't exist
if (!existsSync(preloadPath)) {
    console.warn('Preload script not found. Creating one at:', preloadPath);
    writeFileSync(preloadPath, preloadContent, 'utf-8');
}

// Set the window dimensions based on the file size
// const win = new BrowserWindow({
//     webPreferences: {
//         preload: preloadPath, // Use the correct preload script path
//     },
// });

module.exports = async function electronWindow(filepath, width, height) {
    const indexFilePath = path.join(__dirname, '../../../../../', filepath);

    // Create the index file if it doesn't exist
    if (!existsSync(indexFilePath)) {
        console.warn('Index file not found. Creating one at:', indexFilePath);
        writeFileSync(indexFilePath, indexFileContents, 'utf-8');
    }

    // Set the window dimensions
    win.setSize(width, height)

    // Load the index file into the window
    win.loadFile(indexFilePath).catch((err) => {
        console.error('Failed to load the index file:', err);
    });
};
