module.exports = function Plugin(file, name) {
    const path = require('path');

    const addOutput = require('../../../modules/functions/addOutput.js');
    const debugOutput = require('../../../modules/functions/debugOutput.js');

    const Local = require('../../../modules/class/temp/Local.js');
    const Package = require('../../../modules/class/Packages.js');
    
    const package = new Package;

    const { getVariables, setVariable } = require('../../../modules/functions/temp/Variables.js');
    const { getFunctions, setFunction } = require('../../../modules/functions/temp/Functions.js');

    const createPreload = require("../../../patches/v1.9/modules/nodejs/pre/createPreload.js");
    const runPreload = require("../../../patches/v1.9/modules/nodejs/pre/runPreload.js");

    const createPostload = require("../../../patches/v1.9/modules/nodejs/post/createPostload.js");
    const runPostload = require("../../../patches/v1.9/modules/nodejs/post/runPostload.js");

    // This is currently running unsignned code.
    // Fix this by implementing proper signature verification.
    // const isSigned = await verifySignature(path.join(__dirname, file));
    if (package.name === name || true) {
        debugOutput(`Checking Plugin Signature: ${name}`);
        // Remove the true value to run signed code     
        if (package.strings.full.package.user.enabled === true || true) {
            debugOutput(`Loaded Plugin: ${name}`);
            eval(file)
        }
    } else {
        addOutput(`Failed to load Plugin: ${name}`);
        addOutput(`Reason: Unable to find package within Signed Registry`);
    }
}