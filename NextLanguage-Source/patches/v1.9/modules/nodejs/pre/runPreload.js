const fs = require('fs');
const { preloadPath } = require('../../../../v1.8/contents.js');
const file = fs.readFileSync(preloadPath, 'utf8')

module.exports = function runPreload() {
    if (fs.existsSync(preloadPath)) {
        eval(file);
    } else {
        throw new Error('Preload script not found. (Evaluation and Execution Step Interrupted)');
    }
}