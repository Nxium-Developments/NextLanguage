const debugOutput = require("./debugOutput");
const functions = require('../modules/localStorage');

// Helper to execute functions
module.exports = function executeFunction(line, name, param) {
    if (functions[name]) {
      const fn = functions[name];
      if (typeof fn === "function") fn(param);
    } else {
      debugOutput(line, `Error: Function '${name}' not found.`);
    }
  }