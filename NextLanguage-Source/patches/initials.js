const fs = require('fs');

const path = require('path');
const config = require('./v1.8/returns.js').returns().path.config;

if (!fs.existsSync(config)) {

    const filePath = process.argv[2];
    const content = path.join(__dirname, '../../' + filePath)

    // Checks if the provided argument is empty or not.
    if (!filePath) {
        console.error('A: Please provide the path to the .nxl file as an argument.');
        process.exit(1);
    }

    // Writes the configuration File
    fs.writeFile(config, content, 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
    })

    // Writes the main file contents
    fs.writeFileSync('../' + filePath, contents, 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
    })

    // Checks if the logs folder has been bulit
    if (!fs.existsSync(path.join(__dirname, '../../build/log') + 'Startup.log')) {
        fs.mkdirSync(path.join(__dirname, '../../build/log'))
        fs.writeFileSync(path.join(__dirname, '../../build/log') + 'Startup.log', 'utf8', (err) => {
            if (err) {
                console.error(err);
                return;
            }
        })
    }
}