const fs = require('fs');

getCurrentFilenames();
console.log("\nFile Contents Build File:",
    fs.readFileSync("./backend/build/database/index.nxl", "utf8"));

fs.copyFile("./backend/build/database/index.nxl", "./data/index.nxl", (err) => {
    if (err) {
        console.log("Error Found:", err);
    }
    else {
 
        // Get the current filenames
        // after the function
        getCurrentFilenames();
        console.log("\nFile Contents of Code:",
            fs.readFileSync("./data/index.nxl", "utf8"));
    }
});


function getCurrentFilenames() {
    console.log("\nCurrent filenames:");
    fs.readdirSync(__dirname).forEach(file => {
        console.log(file);
    });
}