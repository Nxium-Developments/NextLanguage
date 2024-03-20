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
            // Execute the JavaScript code using eval()
            eval(data);
        } catch (e) {
            console.error('Error executing JavaScript code:', e);
        }
    });
}

// Usage: Pass the path to the .nxl file as a command line argument
const filePath = process.argv[2];
if (!filePath) {
    console.error('Please provide the path to the .nxl file as an argument.');
    process.exit(1);
}

// Execute the .nxl file
executeNxlFile(filePath);

module.exports = {
    executeNxlFile
}