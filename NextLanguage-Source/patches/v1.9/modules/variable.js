module.exports = function variable(line, parseVariable) {
    // Handle variables
    if (line.startsWith("@var")) {
        parseVariable(line); // Refer to modules/parseVariable.js
    }
}