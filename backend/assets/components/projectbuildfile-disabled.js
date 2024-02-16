const fs = require('fs');

getCurrentFilenames();
console.log("\nFile Contents Build File:",
    fs.readFileSync("./backend/assets/json/build.json", "utf8"));

fs.copyFile("./backend/assets/json/build.json", "./test/build.json", (err) => {
    if (err) {
        console.log("Error Found:", err);
    }
    else {
 
        // Get the current filenames
        // after the function
        getCurrentFilenames();
        console.log("\nFile Contents of copied_file:",
            fs.readFileSync("./test/build.json", "utf8"));
    }
});


function getCurrentFilenames() {
    console.log("\nCurrent filenames:");
    fs.readdirSync(__dirname).forEach(file => {
        console.log(file);
    });
}