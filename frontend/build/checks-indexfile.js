const fs = require('fs');

getCurrentFilenames();
console.log("\nFile Contents Build File:",
    fs.readFileSync("./data/index.nxl", "utf8"));

fs.copyFile("./data/index.nxl", "../index.nxl", (err) => {
    if (err) {
        console.log("Error Found:", err);
    }
    else {
 
        // Get the current filenames
        // after the function
        getCurrentFilenames();
        console.log("\nFile Contents of copied_file:",
            fs.readFileSync("../index.nxl", "utf8"));
    }
});


function getCurrentFilenames() {
    console.log("\nCurrent filenames:");
    fs.readdirSync(__dirname).forEach(file => {
        console.log(file);
    });
}