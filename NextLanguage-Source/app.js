const fs = require('fs');
const run = require('./patches/v1.8/rebulid.js');

function patches_main() {
    require('./patches/v1.8/builder.js')
    require('./patches/v1.6-patch_vdetection-err.js');
    require('./patches/v1.7-startup.js');
    require('./patches/v1.8/configuration.js');
}

patches_main();