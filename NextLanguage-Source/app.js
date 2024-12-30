const fs = require('fs');
const run = require('./package/start.js');

function patches_main() {
    require('./patches/v1.7-startup.js');
    require('./patches/v1.8/configuration.js');
}

if (fs.existsSync('../CONFIG')) {
    const filePath = fs.readFileSync('../CONFIG', 'utf8');

    run(filePath);
}

patches_main();