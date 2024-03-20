const fs = require('fs');

function getCurrentFilenames() {
  console.log("\nCurrent filenames:");
  fs.readdirSync(__dirname).forEach(file => {
      console.log(file);
  });
}

module.exports = getCurrentFilenames();