const run = require('../../package/start.js');
const fs = require('fs');
const path = require('path');

const { config } = require('./contents.js');

if (fs.existsSync(config)) {
    const filePath = fs.readFileSync(config, 'utf8');

    // Execute the .nxl file
    run(filePath);
} else if (!fs.existsSync(config)) {
    const filePath = process.argv[2];

    if (!filePath) {
        console.error('Please provide the path to the .nxl file as an argument.');
        process.exit(1);
    } else if (!fs.existsSync(config)) {
        if (!fs.existsSync(config)) {
            fs.writeFileSync(config, path.join(__dirname, '../../../' + filePath), 'utf8', (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
        }
    }

    // Execute the .nxl file
    run(filePath);
}