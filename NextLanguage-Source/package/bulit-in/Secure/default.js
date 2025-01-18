module.exports = function Plugin(file, name, signature) {
    const addOutput = require('../../../build/lib/output/addOutput.js');
    const debugOutput = require('../../../build/lib/output/debugOutput.js');

    const Information = require(signature);
    const ExtractInfo = Information()
    const packname = ExtractInfo.name
    const packenabled = ExtractInfo.enabled
    const author = ExtractInfo.author

    // This is currently running unsignned code.
    // Fix this by implementing proper signature verification.
    // const isSigned = await verifySignature(path.join(__dirname, file));
    if (packname === name) {
        if (packenabled === true) {
            debugOutput(`Loaded Plugin: ${name}`);
            eval(`const path = require('path');

            const addOutput = require('../../../build/lib/output/addOutput.js');
            const debugOutput = require('../../../build/lib/output/debugOutput.js');
        
            const Local = require('../../../build/lib/memoryStore/Local.js');
            const Package = require('../../../modules/class/Packages.js');
            
            const package = new Package;
            const local = new Local;
        
            const { getVariables, setVariable } = require('../../../build/lib/memoryStore/temp/Variables.js');
            const { getFunctions, setFunction } = require('../../../build/lib/memoryStore/temp/Functions.js');
            ${file}
            Service()`); // Load the plugin (file)
        } else {
            addOutput(`Failed to load Plugin: ${name}`);
            addOutput(`Reason: Plugin is disabled by: ${author}`);
        }
    } else {
        addOutput(`Failed to load Plugin: ${name}`);
        addOutput(`Reason: Unable to find package within Signed Registry`);
    }
}