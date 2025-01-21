const fs = require('fs');

const path = require('path');
const template = require('./v1.8/returns.js').returns().template.indexFile;

if (!fs.existsSync(config)) {

    const filePath = process.argv[2];
    const content = path.join(__dirname, '../../' + filePath);

    // Checks if the provided argument is empty or not.
    if (!filePath) {
        console.error('A: Please provide the path to the .nxl file as an argument.');
        process.exit(1);
    };

    // Writes the main file contents
    fs.writeFileSync(content, template, 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });

    // Checks if the logs folder has been bulit
    if (!fs.existsSync(path.join(__dirname, '../build/log/') + 'Startup.log')) {
        fs.mkdirSync(path.join(__dirname, '../build/log/'))
        fs.writeFileSync(path.join(__dirname, '../build/log/') + 'Startup.log', 'Initialized build.', 'utf8', (err) => {
            if (err) {
                console.error(err);
                return;
            }
        })
    }
}