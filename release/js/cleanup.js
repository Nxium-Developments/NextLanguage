const fs = require('fs');
const path = require('path');

function cleanup() {
    const cleanupJsonPath = path.join(__dirname, 'cleanup.json');
    if (fs.existsSync(cleanupJsonPath)) {
        const cleanupData = JSON.parse(fs.readFileSync(cleanupJsonPath, 'utf8'));
        cleanupData.forEach(file => {
            if (file.startsWith('*')) {
                fs.readdirSync(__dirname).forEach(file => {
                    if (!file.endsWith(file.slice(1))) return;
                    const filePath = path.join(__dirname, file);
                    if (fs.lstatSync(filePath).isFile()) {
                        fs.unlinkSync(filePath);
                    }
                })
            }

            const filePath = path.join(__dirname, file);
            if (fs.lstatSync(filePath).isDirectory()) {
                fs.rmdirSync(filePath, { recursive: true });
            }

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });
    } else {
        console.error('❌ cleanup.json not found.');
    }
}

function createJSON(additionalFiles) {
    const cleanupJsonPath = path.join(__dirname, 'cleanup.json');
    if (!fs.existsSync(cleanupJsonPath)) {
        fs.writeFileSync(cleanupJsonPath, `[ "nul", "updates", "*_old", ${JSON.stringify(additionalFiles)} ]`);
    }
}

const args = process.argv.slice(2);

if (args.includes('--cleanup')) {
    cleanup();
} else if (args.includes('--create-json')) {
    createJSON(args.slice(2));
} else {
    console.log(`
========================================================
|                       Usage                          |
========================================================
- node cleanup.js --cleanup
- node cleanup.js --create-json <file1> <file2> <file3>
`);
}