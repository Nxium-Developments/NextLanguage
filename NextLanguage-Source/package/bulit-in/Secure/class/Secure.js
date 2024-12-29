const addOutput = require('../../../../modules/functions/addOutput.js');
const debugOutput = require('../../../../modules/functions/debugOutput.js');

module.exports = class Secure {
    constructor() {}

    addOutput(message) {
        addOutput(message);
    };

    debugOutput(message) {
        debugOutput(message);
    };
}