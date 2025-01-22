const { readFileSync } = require('fs');
const path = require("path");

module.exports = function changelogs() {
  return {
    version: readFileSync(path.join(__dirname, "../../NextLanguauge-Source/package/bulit-in/versions.package")).split("\n")
  }
}
