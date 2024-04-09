const fs = require('fs');

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
        }
    });
}

if (!fs.existsSync('../config.nxconf')) {
    const filePath = process.argv[2];

    fs.writeFileSync(filePath, 'console.log(`Hello World`)', 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
    })

    fs.copyFileSync('init.js', '../init.js')

    fs.copyFileSync('./.README/enable.bat', '../enable.bat')

    fs.mkdirSync('../logs/ready.temp')
    fs.writeFileSync('../logs/initialize.log', `
    Visit https://github.com/Nxium-Developments/NextLanguage for
    more information on the configuration of this log file.

    Initialized Successfully`, 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
    })

    if (fs.existsSync('../config.nxconf')) {
        const filePath = fs.readFileSync('../config.nxconf', 'utf8');
    
        executeNxlFile(filePath);
    } else if (!fs.existsSync('../config.nxconf')) {
        const filePath = process.argv[2];
    
        if (!filePath) {
            console.error('Please provide the path to the .nxl file as an argument.');
            process.exit(1);
        } else if (!fs.existsSync('../config.nxconf')) {
            if (!fs.existsSync('../config.nxconf')) {
                fs.writeFile('../config.nxconf', filePath, 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
            }
        }
    
        executeNxlFile(filePath);
    }
} else {
    if (fs.existsSync('../config.nxconf')) {
        const filePath = fs.readFileSync('../config.nxconf', 'utf8');
    
        executeNxlFile(filePath);
    } else if (!fs.existsSync('../config.nxconf')) {
        const filePath = process.argv[2];
    
        if (!filePath) {
            console.error('Please provide the path to the .nxl file as an argument.');
            process.exit(1);
        } else if (!fs.existsSync('../config.nxconf')) {
            if (!fs.existsSync('../config.nxconf')) {
                fs.writeFile('../config.nxconf', filePath, 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
            }
        }
    
        executeNxlFile(filePath);
    }
}