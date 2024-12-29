const addOutput = require('../../../../modules/functions/addOutput');
const debugOutput = require('../../../../modules/functions/debugOutput');
const install = require('../../../../modules/updateCheck.js');
const Plugin = require('../../../../package/bulit-in/Secure/default.js');

const path = require('path');
const fs = require('fs');

const Local = require('../../../../modules/class/temp/Local');
const data = new Local();

const packages = data.commands;

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
                data.main(packages.main);
            } else {
                addOutput("No main file set in BUILD CONFIG");
            }

            debugOutput(`Main package set to: ${main}`);
        }

        if (line.startsWith("PACKAGES-LIST")) {
            const match = line.match(/PACKAGES-LIST (.+)/);
            if (!match) continue;
            const [, packages] = match;

            packages.forEach((package) => {
                data.addCommand(package);
                debugOutput(`Command package added: ${package}`);
            });
        }

        if (line.startsWith("PRELOAD-PATH")) {
            const match = line.match(/PRELOAD-PATH: (.+)/);
            if (!match) continue;
            const [, path] = match;

            packages.preloadPath = path;
            debugOutput(`Preload path set to: ${path}`);
        }

        if (line.startsWith("POSTLOAD-PATH")) {
            const match = line.match(/POSTLOAD-PATH: (.+)/);
            if (!match) continue;
            const [, path] = match;

            packages.postloadPath = path;
            debugOutput(`Postload path set to: ${path}`);
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

        if (line.startsWith("PLUGINS")) {
            const match = line.match(/PLUGINS: (.+)\@(.+)/);
            if (!match) continue;
            const [, name, plugins] = match;

            debugOutput(`Enabling plugin: ${name}`);
            if (name === "Secure ") { eval(plugins) } else {
                const extractPath = plugins.match(/require(.+)\'\)\);/);
                if (!extractPath) continue;
                const [, path ] = extractPath
                const output = fs.readFileSync(path, 'utf8');
                Plugin(output, name);
            };            
        }
    }
}