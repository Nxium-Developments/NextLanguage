const fs = require('fs');
const path = require('path');
const runConfig = require('./v1.9-v1.8/utils/config_compiler');
const configurationFile = require('./v1.9-v1.8/config_data');

async function readConfig(file, contents) {
    const response = fs.readFileSync(file, 'utf8');
    const nxlCode = await response;

    // Parse and execute the NXL code
    const lines = nxlCode.split("\n").map(line => line.trim());

    runConfig(lines, contents);
}

// TODO: Create a config file. And update config function.
function config()  {
    if (fs.existsSync(path)) {
        const path = path.join(__dirname, '../../../BUILD_CONFIG');
        const contents = fs.readFileSync(configPath, 'utf-8');
        readConfig(path, contents);
    } else {
        fs.writeFileSync(path.join(__dirname, '../../../BUILD_CONFIG'), configurationFile, 'utf-8', (err) => {
            if (err) {
                console.error(err);
                return;
            }
        })
    }
}

config();