const addOutput = require('../../build/lib/output/addOutput.js');
const debugOutput = require('../../build/lib/output/debugOutput.js');

/** PLUGIN IMPORTS */
const Plugin = require('../../package/bulit-in/Secure/default.js');
const SecureService = require('../../package/bulit-in/Secure/package.js');
const { DebugService } = require('../../package/bulit-in/Debugger/package.js');

/** NODEJS IMPORTS */
const path = require('path');
const fs = require('fs');

const packages = require('../../patches/v1.8/returns.js').packages;
const run = require('../../package/start.js');

module.exports = async function runConfig(lines) {
    // Read and execute the NXL code, line by line
    for (let i = 0; i < lines.length; i++) {
        // Execute the current line
        const line = lines[i];

        // Ignore comments
        if (line.startsWith("#") || line === "") continue;

        if (line.startsWith("PACKAGES")) {
            const match = line.match(/PACKAGES: \@(.+?) (.+)/);
            if (!match) continue;
            const [, args, path] = match;

            // Set main package
            if (args === "main") {
                debugOutput(`Setting package: ${path}`);
                run(path);
            }

            if (args === "others") {
                run(path);
            }
        }

        if (line.startsWith("PLUGINS")) {
            const match = line.match(/PLUGINS: (.+)\@(.+)\s\@(.+)/);
            if (!match) continue;
            const [, name, plugins, sign] = match;
            const rename = name.replace(' ', '');

            // IF DISABLING THIS SECURE PLUGIN METHOD IS
            // WHAT U WANT TO DO. TO REMIND YOU THAT, DISABLING THIS
            // MAY FIRST CAUSE UNINTENDED SIDE EFFECTS. AND MAY THEN
            // CRASH NEXTLANGUAGE ENTIRELY. I RECOMMEND U NOT DISABLE THIS.
            debugOutput(`Enabling plugin: ${name}`);
            if (rename === "Secure") { eval(plugins); SecureService(); 
            } else if (rename === "Debugger") { eval(plugins); DebugService(); } else if (name) {
                // Import the plugin, Secure
                const enabled = require('../../package/bulit-in/Secure/package.js').secured;
                
                // Path Verification
                const string = plugins.replace('path: ', '');
                const file = path.join(__dirname, `../../../${string}`);

                // Signature Verification
                const info = sign.replace('sign: ', '');
                const signed = path.join(__dirname, `../../../${info}`);

                // Reads the Plugin file
                const output = fs.readFileSync(file, 'utf8');

                // Check if the plugin is enabled in the build config
                if (enabled !== null) {
                    debugOutput(`Plugin ${name} was sucessfully installed`);
                    debugOutput(`Loading plugin: ${name}`);
                    Plugin(output, rename, signed);
                } else {
                    addOutput(`Failed to load plugin: ${name}`);
                    addOutput(`Reason: Unable to load the bulit-in Secure Plugin`);
                }
            };            
        }
    }
}