const addOutput = require('../../modules/addOutput');
const safeEval = require('../../modules/safeEval');
const IfStatementHandler = require('../../modules/IfStatementHandler');
const ifHandler = IfStatementHandler(addOutput, safeEval);
const debugOutput = require('../../modules/debugOutput');
const parseVariable = require('../../modules/parseVariable');
const executeFunction = require('../../modules/executeFunction');

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
} = require('../../modules/localStorage.js');
const packages = getPackages();
const variables = getVariables();
const functions = getFunctions();

module.exports = function compiler(lines) {
    // Read and execute the NXL code, line by line
    for (let i = 0; i < lines.length; i++) {
        // Execute the current line
        const line = lines[i];

        // Ignore comments
        if (line.startsWith("#") || line === "") continue;

        // Depreated debug mode
        if (line.startsWith(":debug-mode")) {
          const match = line.match(/:debug-mode (.+)/);
          if (match) {
            //   debug = main.toLowerCase() === "on";
            //   addOutput(`Debug mode ${debug ? "enabled" : "disabled"}.`);
            //   if (main.toLowerCase() === "on") {
            //       setPackageDebugMode(debug);
            //   }

            addOutput(`Debug mode ${match[1].toLowerCase() === "on" ? "is deprecated" : "disabled"}.`);
          }
          continue;
        }

        // Handle :package-main directive
        if (line.startsWith(":package-main")) {
            // Creates a separates a variable
            const match = line.match(/:package-main (.+);/);

            // Checks if match is iterable
            if (!match) continue;

            // Separates a variable
            const [, main] = match;

            // Sets the main package
            if (main === "root/me") {
                setPackageMain(main); // Sets the main package
                // Debugging for Developers
                debugOutput(line, `Main package set to: ${packages.main}`);
            } else {
                const read = main.split("root/")[0]; // Creates a read path
                // Returns the file contents
                const contents = fs.readFileSync(path.join(read), 'utf8');
                if (match) {
                    addPackageCommand(main); // Adds the command to modules/localStorage.js
                    debugOutput(line, `Command package added: ${main}`); // Debug output
                }
            }
        }

        // Handle :package-com directive
        if (line.startsWith(":package-com")) {
            // Creates a Separator for variables given within a space
            const match = line.match(/:package-com (.+);/);
            if (!match) continue; // Checks if match is iterable

            const [, auto] = match; // Creates a separator variable
            const read = auto.split("root/")[0]; // Creates a read path

            // Returns the file contents (currently out of use)
            const contents = fs.readFileSync(path.join(read), 'utf8');
            if (match) {
                addPackageCommand(main); // Adds the command to modules/localStorage.js
                debugOutput(line, `Command package added: ${main}`); // Debug output
            }
        }

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

        // Handle variables
        if (line.startsWith("@var")) {
            parseVariable(line); // Refer to modules/parseVariable.js
        }

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

        // Handle output command
        if (line.startsWith("@output")) {
            // Separates the contents of @output
            const text = line.split("@output")[1].trim();
            // Checks if the text contains a variable reference
            const variable = getVariables(text);
            if (variable) { // If so, output the variable contents
              addOutput(variable);

              return; // Removes double outputs
            }

            // If not, output the text
            addOutput(text);
        }

        // Handle call commands
        if (line.startsWith(":call")) {
            // Variable Separator
            const callMatch = line.match(/:call \[(.+?)\]\/(.+?)(@.+)/);
            if (!callMatch) continue; // Checks if callmatch is iterable
  
            // Separates the contents of @call
            const [, type, name, action] = callMatch;
  
            if (type === "@var") { // Checks if the type is a variable
                const variable = variables[name];
                if (variable) { // And if the variable is stated to output its contents
                    if (action === "@output") {
                        // Tells the user that this is a legacy function
                        addOutput(`:call Variable function is deprecated, use @output variable_name instead`);
                        debugOutput(line, `Variable Output (${name}): ${variable.value}`); // Added for debugging only.
                    }
                } else { // If the variable is not found, output an error
                    debugOutput(line, `Error: Variable '${name}' not found.`);
                }
            } else if (type === "@function") { // If the type is a function
                // Execute the function, refer to modules/executeFunction.js
                executeFunction(line, name, line.split("(")[1].split(")")[0]);
            }
        }

        if (line.startsWith("@if")) {                 
          // Refer to modules/IfStatementHandler.js
          ifHandler.parseIfStatement(line, lines);
        }
    }
}