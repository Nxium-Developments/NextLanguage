const createPreload = require("./nodejs/createPreload");

module.exports = async function packageAdvancedCommand(line, packages) {
    const script = await createPreload();

    // Handle :package-advanced directive
    if (line.startsWith(":package-advanced")) {
        // Creates a Separator for variables given within a space
        const match = line.match(/:package-advanced (.+);/);

        if (match) {
            setPackageAdvanced("true"); // Sets an package to advanced mode
            
            if (script === true) {
                debugOutput(line, `Running preload script as default (No commands nested/nor listed)`);
            }

            debugOutput(line, `Advanced mode: ${packages.advanced}`); // Debug Output
        } else {
            setPackageAdvanced("false"); // Sets an package to normal mode
            debugOutput(line, `Advanced mode: ${packages.advanced}`); // Debug Output
        }
    }
}