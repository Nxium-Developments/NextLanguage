

module.exports = function debug(line) {
    // Handle debug command
    if (line.startsWith("@debug")) {
        // Refer to modules/debugOutput.js
        debugOutput(line.split("@debug")[1].trim());
    }
}