const debugMode = require('../../../v1.9/modules/debugmode.js');
const variable = require('../../../v1.9/modules/variable.js');
const outputCommand = require('../../../v1.9/modules/output.js');
const ifCommand = require('../../../v1.9/modules/if.js');

const addOutput = require('../../../../modules/addOutput');
const parseVariable = require('../../../../modules/parseVariable');
const {
    getPackages,
    setPackageMain,
    addPackageCommand,
} = require('../../../../modules/localStorage.js');

const packages = getPackages();
const debugOutput = require('../../../../modules/debugOutput');
const install = require('../../../../modules/updateCheck.js');

module.exports = async function runConfig(lines) {
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
                packages.main = main;
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
            const match = line.match(/PRELOAD-PATH: (.+)/);
            if (!match) continue;
            const [, path] = match;

            packages.preloadPath = path;
            debugOutput(line, `Preload path set to: ${path}`);
        }

        if (line.startsWith("POSTLOAD-PATH")) {
            const match = line.match(/POSTLOAD-PATH: (.+)/);
            if (!match) continue;
            const [, path] = match;

            packages.postloadPath = path;
            debugOutput(line, `Postload path set to: ${path}`);
        }

        if (line.startsWith("CHECK-FOR-UPDATES")) {
            const match = line.match(/CHECK-FOR-UPDATES: (.+)/);
            if (!match) continue;
            const [, value] = match;

            if (value === "true") {
                install();
            } else {
                // Add no-update command
                addOutput("Not checking for updates. Update Box set to false.");
            }
        }
    }
}