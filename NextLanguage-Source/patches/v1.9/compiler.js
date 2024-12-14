const {
    addOutput,
    ifHandler,
    debugOutput,
    parseVariable,
    executeFunction,
} = require('./storage/functions.js');

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

const { 
    debugMode,
    packageAdvancedCommand,
    variable,
    outputCommand,
    ifCommand 
} = require('./storage/storage.js');

const createWindow = require('../../modules/createWindow.js');
const varMain = require('./modules/parts/varMain.js');
const packageMain = require('./modules/parts/packageMain.js');
const electronWindow = require('./modules/nodejs/electronWindow.js');
const exportCommand = require('../../build/patches/command.js');

module.exports = function compiler(lines) {
    // Read and execute the NXL code, line by line
    for (let i = 0; i < lines.length; i++) {
        // Execute the current line
        const line = lines[i];

        // Ignore comments
        if (line.startsWith("#") || line === "") continue;

        // Handle :debug-mode directive
        debugMode(line, addOutput);

        // Handle :package-main directive
        if (line.startsWith(":package-main")) {
            // Extract the main value using a regex
            const match = line.match(/:package-main (.+);/);
    
            // Ensure match is valid (not null or undefined)
            if (!match) continue;
    
            // Destructure the first captured group (main package path)
            const [, main] = match;
    
            // Handle root/me params for package-main
            packageMain(line, main, packages);
        }

        // Handle :package-com directive
        if (line.startsWith(":package-com")) {
            // Creates a Separator for variables given within a space
            const match = line.match(/:package-com (.+);/);
            if (!match) continue; // Checks if match is iterable

            const [, auto] = match; // Creates a separator variable
            // const read = auto.split("root/")[0]; // Creates a read path

            // // Returns the file contents (currently out of use)
            // const contents = fs.readFileSync(path.join(read), 'utf8');
            if (match) {
                addPackageCommand(main); // Adds the command to modules/localStorage.js
                debugOutput(line, `Command package added: ${main}`); // Debug output
            }
        }

        // Handle :package-advanced
        packageAdvancedCommand(line, packages)

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
  
            varMain(line, type, variables, name, action);
        }

        if (line.startsWith(":windows")) {
            // Variable Separator
            const match = line.match(/:windows\((.+)\.(.+?)\)\.(.+)/)
            if (!match) continue; // Checks if match is iterable
            const [, command, args, name] = match; // Separates the contents of @call]

            // Creates a new window with the given command and arguments
            createWindow(line, addOutput, command, args, name, windows, createWindowsProcess, electronWindow);
        }

        // Exports all of NXL code into javascript.
        if (line.startsWith(":export")) {
            // Export function logic
            exportCommand(line);
        }
        
    }
}