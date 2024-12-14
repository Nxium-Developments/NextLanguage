const fs = require('fs');

// Check if build.config.nxlf exists, if not, create it and initialize with default values
if (!fs.existsSync('./build.config.nxlf')) {
    fs.mkdirSync('./build/lib/log', { recursive: true });
    fs.mkdirSync('./build/lib/export', { recursive: true });
    fs.mkdirSync('./build/patches', { recursive: true });
    fs.mkdirSync('./build/import', { recursive: true });
    
    fs.writeFileSync('./build.config.nxlf', 'true', 'utf-8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
    })
}