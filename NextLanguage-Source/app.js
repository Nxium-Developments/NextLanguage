const fs = require('fs');
const date = require('date-and-time');


const now = new Date();
const pattern = date.compile('YYYY-MM-DD');
const currenttime = date.format(now, pattern);

async function executeNxlFile(filePath) {
  try {
    const response = await fetch(filePath);
    const nxlCode = await response.text();

    // Define storage for variables and functions
    const variables = {};
    const functions = {};

    // Helper to add output to the terminal
    function addOutput(text) {
      console.log(text);
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
    function executeFunction(name, param) {
      if (functions[name]) {
        const fn = functions[name];
        if (typeof fn === "function") fn(param);
      } else {
        addOutput(`Error: Function '${name}' not found.`);
      }
    }

    // Parse and execute the NXL code
    const lines = nxlCode.split("\n").map((line) => line.trim());

    for (const line of lines) {
      // Ignore comments
      if (line.startsWith("#") || line === "") continue;

      // Handle :package-main directive
      if (line.startsWith(":package-main")) {
        addOutput("Main package identified.");
      }

      // Handle :package-com directive
      if (line.startsWith(":package-com")) {
        addOutput("Package commands initialized.");
      }

      // Handle :packaged block
      if (line.startsWith(":packaged")) {
        addOutput("Entering packaged block...");
      }

      // Handle variables
      if (line.startsWith("@var")) {
        parseVariable(line);
        addOutput(`Variable '${line.split("[")[1].split("]")[0]}' initialized.`);
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
              addOutput(`Variable Output (${name}): ${variable.value}`);
            }
          } else {
            addOutput(`Error: Variable '${name}' not found.`);
          }
        } else if (type === "@function") {
          executeFunction(name, line.split("(")[1].split(")")[0]);
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
            addOutput(text);
          }
        };
        addOutput(`Function '${name}' registered.`);
      }
    }
  } catch (err) {
    console.error("Error executing .nxl file:", err.message);
  }
}

function patches_main() {
    require('./patches/v1.6-patch_vdetection-err.js');
}

if (!fs.existsSync('../config.nxconf')) {
    const filePath = process.argv[2];

    fs.writeFile('../config.nxconf', filePath, 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
    })

        
    if (!filePath) {
        console.error('Please provide the path to the .nxl file as an argument.');
        process.exit(1);
    }

    fs.writeFileSync('../' + filePath, 'console.log(`Hello World`)', 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
    })

    const currenttime = date.format(now, pattern); 

    fs.copyFileSync('init.js', '../init.js')

    fs.copyFileSync('./.README/enable.bat', '../enable.bat')
    
    fs.writeFileSync('./build/lib/log/' + 'NXL_Startup-Initization.log', `
    Visit https://github.com/Nxium-Developments/NextLanguage for
    more information on the configuration of this log file.

    Initialized Successfully` + `
    
    < ---------------------------------------------------------------- >

    Log File: ./build/lib/log/${currenttime}-NXL_Startup.log

    `, 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
    })

    if (fs.existsSync('../config.nxconf')) {
        const filePath = fs.readFileSync('../config.nxconf', 'utf8');
    
        executeNxlFile(filePath);
    }
}

patches_main();
