const debugOutput = require('../modules/functions/debugOutput.js');

// Advanced Code Execution Imports
const createPreload = require("../patches/v1.9/modules/nodejs/pre/createPreload.js");
const runPreload = require("../patches/v1.9/modules/nodejs/pre/runPreload.js");

const createPostload = require("../patches/v1.9/modules/nodejs/post/createPostload.js");
const runPostload = require("../patches/v1.9/modules/nodejs/post/runPostload.js");

const { getVariables, setVariable } = require('../modules/functions/temp/Variables.js');
const { getFunctions, setFunction } = require('../modules/functions/temp/Functions.js');

const Local = require('../modules/class/temp/Local.js');
const local = new Local();

const packages = local.commands;

const variable = require('../patches/v1.9/modules/variable.js');
const outputCommand = require('../patches/v1.9/modules/output.js');
const ifCommand = require('../patches/v1.9/modules/if.js');

const addOutput = require('../modules/functions/addOutput.js');
const parseVariable = require('../modules/functions/parseVariable.js');
const executeFunction = require('../modules/functions/executeFunction.js');

const safeEval = require('../modules/functions/safeEval.js');
const IfStatementHandler = require('../modules/functions/IfStatementHandler.js');
const ifHandler = IfStatementHandler(addOutput, safeEval);

const executeCall = require('../patches/v1.9/modules/func/executeCall.js');
const packageMain = require('../patches/v1.9/modules/func/packageMain.js');

// This is broken asf
// const exportCommand = require('../../build/patches/command.js');

module.exports = async function compiler(lines) {
    // Read and execute the NXL code, line by line
    for (let i = 0; i < lines.length; i++) {
        // Execute the current line
        const line = lines[i];

        // Ignore comments
        if (line.startsWith("#") || line === "") continue;

        // Handle preload scripts
        const script = await createPreload(line);
        const post = await createPostload(line);

        // Handle :package-main directive
        if (line.startsWith(":package-main")) {
            // Extract the main value using a regex
            const match = line.match(/:package-main (.+)/);
    
            // Ensure match is valid (not null or undefined)
            if (!match) continue;
    
            // Destructure the first captured group (main package path)
            const [, main] = match;
    
            // Handle root/me params for package-main
            packageMain(line, main, packages, local, debugOutput);
        }

        // Handle :package-com directive
        if (line.startsWith(":package-com")) {
            // Creates a Separator for variables given within a space
            const match = line.match(/:package-com (.+)/);
            if (!match) continue; // Checks if match is iterable

            const [, auto] = match; // Creates a separator variable
            // const read = auto.split("root/")[0]; // Creates a read path

            // // Returns the file contents (currently out of use)
            // const contents = fs.readFileSync(path.join(read), 'utf8');
            if (match) {
                local.addCommand(auto); // Adds the command to modules/localStorage.js
                debugOutput(`Command package added: ${auto}`); // Debug output
            }
        }

        // Handle :package-advanced directive
        if (line.startsWith(":package-advanced")) {
            // Creates a Separator for variables given within a space
            const match = line.match(/:package-advanced (.+)/);

            if (!match) continue; 

            const [, value] = match;       
            
            if (value === "false") {
                setPackageAdvanced("false"); // Sets an package to normal mode
                debugOutput(`Advanced mode: ${packages.advanced}`); // Debug Output
            } else {
                setPackageAdvanced("true"); // Sets an package to advanced mode
                debugOutput(`Advanced mode: ${packages.advanced}`); // Debug Output

                if (script === "true") {
                    runPreload();
                }

                if (post === "true") {
                    runPostload();
                }
            };
        }

        // Handle @var modules
        variable(line, parseVariable);

        // Handle if statements
        ifCommand(line, lines, ifHandler);

        // Handle @output modules
        outputCommand(line, addOutput, getVariables);

        // Handle functions
        if (line.startsWith("@function")) {
            // Match and extract the function name
            const functionMatch = line.match(/@function \[(.+)\]/);
            if (!functionMatch) continue; // Skip if no match is found
            const [, name] = functionMatch; // Extract the function name

            // Register the function contents
            setFunction(name, lines, line, functionMatch);

            function runFunction() {         
                // Execute the function body and get the result
                const result = executeFunction(lines, line, functionMatch).block;
                let a = 0;
                const output = result.split('\n')[a++];
                
                if (output.startsWith(":params")) {
                    // Extract the contents of :params
                    const params = result.split(':params').slice(1).join('\n').split(':end')[0].trim();

                    // Output the extracted text
                    addOutput(params);
                }

                // Check if the result contains an output directive
                if (output.startsWith(":output")) {
                    // Extract the contents of :output
                    const text = result.split(':output').slice(1).join('\n').split('\n:end')[0].trim();

                    // Output the extracted text
                    addOutput(text);
                }

                return name;
            }

            module.exports = runFunction;

            debugOutput(`Function registered: ${name}`);
        }

        // Handle @run commands separately
        if (line.startsWith("@run")) {
            // Execute the function body and get the result
            runFunction();
        }

        // Handle call commands
        if (line.startsWith(":call")) {
            // Variable Separator
            const callMatch = line.match(/:call \[(.+?)\]\/(.+?)(@.+)/);
            if (!callMatch) continue; // Checks if callmatch is iterable
  
            // Separates the contents of @call
            const [, type, name, action] = callMatch;
  
            executeCall(line, type, variables, name, action, addOutput, debugOutput);

            addOutput(`:call command is deprecated, use @output variable_name instead`);
        }

        if (line.startsWith(":windows")) {
            // Variable Separator
            const match = line.match(/:windows\((.+)\.(.+?)\)\.(.+)/)
            if (!match) continue; // Checks if match is iterable
            const [, command, args, name] = match; // Separates the contents of @call]

            // Creates a new window with the given command and arguments
            // createWindow(line, addOutput, command, args, name, windows, createWindowsProcess, electronWindow);

            addOutput(`:windows command is indevelopment`);
        }

        // Exports all of NXL code into javascript.
        if (line.startsWith(":export")) {
            // Export function logic
            // HOLY Fuck, this is broken asf, do not enable this
            // exportCommand(line);

            addOutput(`:export command is indevelopment`);
        }
        
    }
}