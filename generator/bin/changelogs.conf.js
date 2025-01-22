const { readFileSync } = require('fs');
const path = require("path");

module.exports = function changelogs() {
  return {
    version: readFileSync(path.join(__dirname, "../../NextLanguauge-Source/package/bulit-in/versions.package"), "utf8").split("\nver: Build_")[1],
    changes: readFileSync(path.join(__dirname, "../../CHANGELOG.md"), "utf8")
  }
}
