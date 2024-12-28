const fs = require('fs');
const { postloadPath } = require('../../../../v1.8/contents.js');

module.exports = function runPostload() {
    if (fs.existsSync(postloadPath)) {
        const file = fs.readFileSync(postloadPath, 'utf8')
        eval(file);
    } else {
        throw new Error('Preload script not found. (Evaluation and Execution Step Interrupted)');
    }
}