const fs = require('fs');

const currenttime = require('./v1.8/clock.js');
const { contents } = require('./v1.8/contents.js');

if (!fs.existsSync('../../CONFIG')) {

    const filePath = process.argv[2];

    // Checks if the provided argument is empty or not.
    if (!filePath) {
        console.error('Please provide the path to the .nxl file as an argument.');
        process.exit(1);
    }

    // Writes the configuration File
    fs.writeFile('../../CONFIG', filePath, 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
    })

    // Writes the main file contents
    fs.writeFileSync('../../CONFIG' + filePath, contents, 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
    })
    
    // Writes unnesscary logs.
    fs.writeFileSync('./build/lib/log/' + 'NXL_Startup-Initization.log', `
    Visit https://github.com/Nxium-Developments/NextLanguage for
    more information on the configuration of this log file.

    Initialized Successfully` + `
    
    < ---------------------------------------------------------------- >

    Log File: ./build/lib/log/${currenttime}-NXL_Startup.log

    `, 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
    })
}