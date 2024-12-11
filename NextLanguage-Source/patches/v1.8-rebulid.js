const fs = require('fs');

module.exports = async function run(file) {
    const response = fs.readFileSync(file, 'utf8');
    const nxlCode = await response;
  
    // Define storage for variables and functions
    const variables = {};
    const functions = {};
  
    // Helper to add output to the terminal
    function addOutput(text) {
      console.log(text);
    }

    function debugOutput(line, text) {
        const debugMatch = line.match(/output:debug\((.+?)\)/);
        if (!debugMatch) return;
        
        const [, debugText] = debugMatch;
        addOutput(`Debug: ${debugText}`);
        
        if (debugText === "true") {
            addOutput("Debug mode enabled.");

            // Add debug outputs to the terminal
            addOutput(text);
        } else {
            addOutput("Debug mode disabled.");
        }
    }
  
    // Helper to parse variables
    function parseVariable(line) {
      const variableMatch = line.match(/@var \[(.+?)\]:\s?\((.+?)\)(.+)/);
      if (!variableMatch) return;
  
      const [, name, type, value] = variableMatch;
  
      let parsedValue = value.trim();
      if (type.toLowerCase() === "negative") {
        parsedValue = parseFloat(value.replace("(negative)", "-"));
      } else if (type.toLowerCase() === "percent" || type.toLowerCase() === "percentage") {
        parsedValue = parseFloat(value.replace("%", ""));
      } else if (type.toLowerCase() === "int" || type.toLowerCase() === "integer") {
        parsedValue = parseInt(value, 10);
      } else if (type.toLowerCase() === "double") {
        parsedValue = parseFloat(value);
      } else if (type.toLowerCase() === "boolean") {
        parsedValue = value.toLowerCase() === "true";
      }
  
      variables[name] = { type, value: parsedValue };
    }
  
    // Helper to execute functions
    function executeFunction(line, name, param) {
      if (functions[name]) {
        const fn = functions[name];
        if (typeof fn === "function") fn(param);
      } else {
        debugOutput(line, `Error: Function '${name}' not found.`);
      }
    }
  
    // Parse and execute the NXL code
    const lines = nxlCode.split("\n").map(line => line.trim());
  
    for (const line of lines) {
      // Ignore comments
      if (line.startsWith("#") || line === "") continue;
  
      // Handle :package-main directive
      if (line.startsWith(":package-main")) {
        debugOutput("Main package identified.");
      }
  
      // Handle :package-com directive
      if (line.startsWith(":package-com")) {
        const callMatch = line.match(/:package-com (.+)/);
        if (!callMatch) continue;
        
        const [, type] = callMatch;
        
        // if the user chooses advanced mode
        // run the code below
        if (type === "x-auto") continue;
        
        // else if they choose beginner run
        // the beginner level code
        if (type === "auto") { 
          addOutput("Package prompts initialized.");
          
          if (line.startsWith(":begin")) { 
            addOutput("Package: Beginner");
          }
      
          if (line.startsWith("output:")) { 
            const text = line.split("output:")[1].trim();
            addOutput(text);
          }
        
          return;
        }
        
        addOutput("Package commands initialized.");
      }
  
      // Handle :packaged block
      if (line.startsWith(":packaged")) {
        debugOutput("Entering packaged block...");
        
        addOutput("Package: Advanced");
        continue;
      }
  
      // Handle variables
      if (line.startsWith("@var")) {
        parseVariable(line);
        debugOutputs(line, `Variable '${line.split("[")[1].split("]")[0]}' initialized.`);
      }
  
      // Handle output command
      if (line.startsWith("@output")) {
        const text = line.split("@output")[1].trim();
        addOutput(text);
      }
  
      // Handle call commands
      if (line.startsWith(":call")) {
        const callMatch = line.match(/:call \[(.+?)\]\/(.+?)(@.+)/);
        if (!callMatch) continue;
  
        const [, type, name, action] = callMatch;
  
        if (type === "@var") {
          const variable = variables[name];
          if (variable) {
            if (action === "@output") {
              debugOutputs(line, `Variable Output (${name}): ${variable.value}`);
        
            }
          } else {
            debugOutputs(line, `Error: Variable '${name}' not found.`);
          }
        } else if (type === "@function") {
          executeFunction(line, name, line.split("(")[1].split(")")[0]);
        }
      }

      // Handle functions
      if (line.startsWith("@function")) {
        const functionMatch = line.match(/@function \[(.+?)\]/);
        if (!functionMatch) continue;
  
        const [, name] = functionMatch;
        const functionBodyIndex = lines.indexOf(line) + 1;
        const functionBody = lines[functionBodyIndex]?.trim();
  
        functions[name] = () => {
          if (functionBody?.startsWith("@output")) {
            const text = functionBody.split("@output")[1].trim();
            debugOutput(line, text);
          }
        };
        debugOutput(line, `Function '${name}' registered.`);
      }
    }
}