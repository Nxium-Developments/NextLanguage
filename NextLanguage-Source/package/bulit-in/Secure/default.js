module.exports = function Plugin(file) {
    const path = require('path');

    const addOutput = require('../../../modules/functions/addOutput.js');
    const debugOutput = require('../../../modules/functions/debugOutput.js');

    const Local = require('../../../modules/class/temp/Local.js');

    const { getVariables, setVariable } = require('../../../modules/functions/temp/Variables.js');
    const { getFunctions, setFunction } = require('../../../modules/functions/temp/Functions.js');

    const createPreload = require("../../../patches/v1.9/modules/nodejs/pre/createPreload.js");
    const runPreload = require("../../../patches/v1.9/modules/nodejs/pre/runPreload.js");

    const createPostload = require("../../../patches/v1.9/modules/nodejs/post/createPostload.js");
    const runPostload = require("../../../patches/v1.9/modules/nodejs/post/runPostload.js");
    eval(file)
}