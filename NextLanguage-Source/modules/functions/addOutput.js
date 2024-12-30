const fs = require('fs');
const currenttime = require('../../build/lib/clock.js');
const path = require('path');

// Helper to add output to the terminal
module.exports = function addOutput(text) {
    console.log(text);

    if (fs.existsSync(path.join(__dirname, '../../build/log/') + currenttime + '-NXL.log')) {
        fs.appendFileSync(path.join(__dirname,'../../build/log/') + currenttime + '-NXL.log', text + '\n', 'utf8', (err) => {
            if (err) {
                console.error(err);
                return;
            }
        })
    } else {
        fs.writeFileSync(path.join(__dirname,'../../build/log/') + currenttime + '-NXL.log', `
Visit https://github.com/Nxium-Developments/NextLanguage for
more information on the configuration of this log file.
        `, 'utf8', (err) => {
            if (err) {
                console.error(err);
                return;
            }
        })

        fs.appendFileSync(path.join(__dirname,'../../build/log/') + currenttime + '-NXL.log', text + '\n', 'utf8', (err) => {
            if (err) {
                console.error(err);
                return;
            }
        })
    }
}