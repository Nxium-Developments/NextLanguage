const fs = require('fs');
 
const data = require('../assets/json/data.json');
 
fs.writeFile(__dirname, "./build.json", data, (err) => {
  if (err)
    console.log(err);
  else {
    console.log("File written successfully\n");
    console.log("The written has the following contents:");
    console.log(fs.readFileSync(__dirname, "./build.json", "utf8"));
  }
});