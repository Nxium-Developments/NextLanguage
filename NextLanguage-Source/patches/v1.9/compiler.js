const debugOutput = require('../../modules/debugOutput.js');

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
} = require('../../modules/localStorage.js');
const packages = getPackages();
const variables = getVariables();
const functions = getFunctions();
const windows = getWindows();

const debugMode = require('./modules/debugmode.js');
const variable = require('./modules/variable.js');
const outputCommand = require('./modules/output.js');
const ifCommand = require('./modules/if.js');

const addOutput = require('../../modules/addOutput');
const parseVariable = require('../../modules/parseVariable');
const executeFunction = require('../../modules/executeFunction');

const safeEval = require('../../modules/safeEval');
const IfStatementHandler = require('../../modules/IfStatementHandler');
const ifHandler = IfStatementHandler(addOutput, safeEval);

const createWindow = require('../../modules/createWindow.js');
const executeCall = require('./modules/func/executeCall.js');
const packageMain = require('./modules/func/packageMain.js');

// Electron Window
const electronWindow = require('./modules/nodejs/electronWindow.js');

// Advanced Code Execution Imports
const createPreload = require("./modules/nodejs/pre/createPreload");
const runPreload = require("./modules/nodejs/pre/runPreload");

const createPostload = require("./modules/nodejs/post/createPostload");
const runPostload = require("./modules/nodejs/post/runPostload");

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
            packageMain(line, main, packages, setPackageMain, addPackageCommand, debugOutput);
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
                addPackageCommand(auto); // Adds the command to modules/localStorage.js
                debugOutput(line, `Command package added: ${auto}`); // Debug output
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
                debugOutput(line, `Advanced mode: ${packages.advanced}`); // Debug Output
            } else {
                setPackageAdvanced("true"); // Sets an package to advanced mode
                debugOutput(line, `Advanced mode: ${packages.advanced}`); // Debug Output

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
          // Creates a Separator for variables given within a space
          const functionMatch = line.match(/@function \[(.+?)\]/);
          if (!functionMatch) continue; // Checks if match is iterable
          const [, name] = functionMatch; // Separates a variable

          // Register the function contents
          setFunction(name, functionMatch)

          // Executes the function
          executeFunction(lines, line, name, functionMatch);
          debugOutput(line, `Function '${name}' registered.`); // Debug Output
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