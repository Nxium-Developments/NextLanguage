const fs = require('fs');

getCurrentFilenames();
console.log("\nFile Contents Build File:",
    fs.readFileSync("./data/build.json", "utf8"));

fs.copyFile("./data/build.json", "../build.json", (err) => {
    if (err) {
        console.log("Error Found:", err);
    }
    else {
 
        // Get the current filenames
        // after the function
        getCurrentFilenames();
        console.log("\nFile Contents of copied_file:",
            fs.readFileSync("../build.json", "utf8"));
    }
});


function getCurrentFilenames() {
    console.log("\nCurrent filenames:");
    fs.readdirSync(__dirname).forEach(file => {
        console.log(file);
    });
}