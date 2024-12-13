const fs = require('fs');
const run = require('./rebulid.js');
const path = require('path');

const contents = require('./contents.js');

if (!fs.existsSync('config.nxconf')) {
    const filePath = process.argv[2];

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, contents, 'utf8', (err) => {
            if (err) {
                console.error(err);
                return;
            }
        })
    }

    if (fs.existsSync('config.nxconf')) {
        const filePath = fs.readFileSync('config.nxconf', 'utf8');
    
        // Execute the .nxl file
        run(filePath);
    } else if (!fs.existsSync('config.nxconf')) {
        const filePath = process.argv[2];
    
        if (!filePath) {
            console.error('Please provide the path to the .nxl file as an argument.');
            process.exit(1);
        } else if (!fs.existsSync('config.nxconf')) {
            if (!fs.existsSync('config.nxconf')) {
                fs.writeFile('config.nxconf', filePath, 'utf8', (err) => {
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
}