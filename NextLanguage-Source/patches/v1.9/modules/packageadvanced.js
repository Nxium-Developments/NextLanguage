module.exports = function packageAdvancedCommand(line, packages) {
    // Handle :package-advanced directive
    if (line.startsWith(":package-advanced")) {
        // Creates a Separator for variables given within a space
        const match = line.match(/:package-advanced (.+);/);

        if (match) {
            setPackageAdvanced("true"); // Sets an package to advanced mode
            debugOutput(line, `Advanced mode: ${packages.advanced}`); // Debug Output
        } else {
            setPackageAdvanced("false"); // Sets an package to normal mode
            debugOutput(line, `Advanced mode: ${packages.advanced}`); // Debug Output
        }
    }
}