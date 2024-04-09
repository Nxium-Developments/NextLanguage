const fs = require('fs');

// Function to read and execute .nxl file
function executeNxlFile(filePath) {
    // Read the contents of the .nxl file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        try {
            // Execute the NXL code using eval()
            eval(data);
        } catch (e) {
            console.error('Error executing NXL code:', e);
        }
    });
}

if (!fs.existsSync('config.nxconf')) {
    const filePath = process.argv[2];

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, 'console.log(`Hello World`)', 'utf8', (err) => {
            if (err) {
                console.error(err);
                return;
            }
        })
    }

    if (fs.existsSync('config.nxconf')) {
        const filePath = fs.readFileSync('config.nxconf', 'utf8');
    
        // Execute the .nxl file
        executeNxlFile(filePath);
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
        executeNxlFile(filePath);
    }
} else {
    if (fs.existsSync('config.nxconf')) {
        const filePath = fs.readFileSync('config.nxconf', 'utf8');
    
        // Execute the .nxl file
        executeNxlFile(filePath);
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
        executeNxlFile(filePath);
    }
}