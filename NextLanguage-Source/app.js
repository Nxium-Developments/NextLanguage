const fs = require('fs');
const date = require('date-and-time');


const now = new Date();
const pattern = date.compile('YYYY-MM-DD');
const currenttime = date.format(now, pattern);

function executeNxlFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        try {
            eval(data);
        } catch (e) {
            console.error('Error executing NXL code:', e);
        } try {
            eval(data);
        } catch (b) {
            console.error('Error executing NXL code:', b);
        }
    });
}

function patches_main() {
    require('./patches/v1.6-patch_vdetection-err.js');
}

if (!fs.existsSync('../config.nxconf')) {
    const filePath = process.argv[2];

    fs.writeFile('../config.nxconf', filePath, 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
    })

        
    if (!filePath) {
        console.error('Please provide the path to the .nxl file as an argument.');
        process.exit(1);
    }

    fs.writeFileSync('../' + filePath, 'console.log(`Hello World`)', 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
    })

    const currenttime = date.format(now, pattern); 

    fs.copyFileSync('init.js', '../init.js')

    fs.copyFileSync('./.README/enable.bat', '../enable.bat')
    
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

    if (fs.existsSync('../config.nxconf')) {
        const filePath = fs.readFileSync('../config.nxconf', 'utf8');
    
        executeNxlFile(filePath);
    }
}

patches_main();