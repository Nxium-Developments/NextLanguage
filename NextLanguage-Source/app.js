const fs = require('fs');
const path = require('path');

const enableDevelopment = require("./package/bulit-in/Debugger/default.js");

// new enableDevelopment("function-state")

async function patches_main() {
    require('./patches/initials.js');
    require('./patches/v1.8/configuration.js');
    require('./patches/v1.8/returns.js');
}

patches_main();