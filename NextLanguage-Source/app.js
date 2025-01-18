const fs = require('fs');
const path = require('path');

const run = require('./package/start.js');
const config = require('./patches/v1.8/returns.js').returns().path.config;

async function patches_main() {
    await require('./patches/initials.js');
    require('./patches/v1.8/configuration.js');
    require('./patches/v1.8/returns.js');

    if (fs.existsSync(config)) {
        const filePath = fs.readFileSync(config, 'utf8');
        run(filePath);
    }
}

patches_main();