const {
    addOutput,
    ifHandler,
    debugOutput,
    parseVariable,
    executeFunction,
} = require('../../../v1.9/storage/functions.js');

const { 
    debugMode,
    packageAdvancedCommand,
    variable,
    outputCommand,
    ifCommand 
} = require('../../../v1.9/storage/storage.js');

const {
    getVariables,
    getFunctions,
    getPackages,
    setVariable,
    setFunction,
    setPackageMain,
    addPackageCommand,
    setPackageAdvanced,
    setPackageDebugMode,
    createWindowsProcess,
    getWindows,
  } = require('../../../../modules/localStorage.js');

  const packages = getPackages();
  const variables = getVariables();
  const functions = getFunctions();

module.exports = async function runConfig(lines, contents) {
    // Read and execute the NXL code, line by line
    for (let i = 0; i < lines.length; i++) {
        // Execute the current line
        const line = lines[i];

        // Ignore comments
        if (line.startsWith("#") || line === "") continue;

        if (line.startsWith("PACKAGE-MAIN")) {
            const match = line.match(/PACKAGE-MAIN (.+)/);
            if (!match) continue;
            const [, main] = match;

            if (main === "root/me") {
                packages.main = contents;
                setPackageMain(packages.main);
            } else {
                addOutput("No main file set in BUILD CONFIG");
            }

            debugOutput(line, `Main package set to: ${main}`);
        }

        if (line.startsWith("PACKAGES-LIST")) {
            const match = line.match(/PACKAGES-LIST (.+)/);
            if (!match) continue;
            const [, packages] = match;

            packages.forEach((package) => {
                addPackageCommand(package);
                debugOutput(line, `Command package added: ${package}`);
            });
        }

        if (line.startsWith("PRELOAD-PATH")) {
            const match = line.match(/PRELOAD-PATH (.+)/);
            if (!match) continue;
            const [, path] = match;

            packages.preloadPath = path;
            debugOutput(line, `Preload path set to: ${path}`);
        }

        if (line.startsWith("POSTLOAD-PATH")) {
            const match = line.match(/POSTLOAD-PATH (.+)/);
            if (!match) continue;
            const [, path] = match;

            packages.postloadPath = path;
            debugOutput(line, `Postload path set to: ${path}`);
        }
    }
}