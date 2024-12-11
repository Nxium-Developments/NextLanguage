const run = require('./v1.8-rebulid.js');
const fs = require('fs');

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