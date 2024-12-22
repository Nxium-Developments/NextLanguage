const fs = require('fs');
const { postloadPath } = require('../../../../v1.8/contents.js');
const file = fs.readFileSync(postloadPath, 'utf8')

module.exports = function runPostload() {
    if (fs.existsSync(postloadPath)) {
        eval(file);
    } else {
        throw new Error('Preload script not found. (Evaluation and Execution Step Interrupted)');
    }
}