const fs = require('fs');

// Check if build.config.nxlf exists, if not, create it and initialize with default values
if (!fs.existsSync('../builded') || !fs.existsSync('./build.config.nxlf')) {
    fs.mkdirSync('./build/lib/log', { recursive: true });
    fs.mkdirSync('./build/lib/export', { recursive: true });
    fs.mkdirSync('./build/patches', { recursive: true });
    fs.mkdirSync('./build/lib/import', { recursive: true });
    
    fs.writeFileSync('./builded', 'If this file exists, it just means that your projet has been bulit', 'utf-8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
    })
}