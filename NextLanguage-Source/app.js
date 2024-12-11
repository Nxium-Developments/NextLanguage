const fs = require("fs");
const date = require("date-and-time");
const fetch = require("node-fetch");

const now = new Date();
const pattern = date.compile("YYYY-MM-DD-ss");
const currenttime = date.format(now, pattern);
const nxlf = fs.existsSync("config.nxconf") ? fs.readFileSync("config.nxconf", "utf8") : "";

// Function to read and execute .nxl file
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

if (!fs.existsSync("config.nxconf")) {
  console.log("Creating default config file...");
  fs.writeFileSync("config.nxconf", "console.log('Hello World');", "utf8");
}

const filePath = process.argv[2] || "default.nxl";

if (!fs.existsSync(filePath)) {
  console.error("Provided file does not exist. Creating a default .nxl file.");
  fs.writeFileSync(filePath, "console.log('Default .nxl File');", "utf8");
}

// Execute the .nxl file
executeNxlFile(filePath);

if (!fs.existsSync("./build.config.nxlf")) {
  fs.mkdirSync("./build/lib/log", { recursive: true });
  fs.mkdirSync("./build/lib/export", { recursive: true });
  fs.mkdirSync("./build/patches", { recursive: true });

  fs.writeFileSync("./build.config.nxlf", "true", "utf-8");
  fs.writeFileSync("./build/patches/temp.txt", "temp", "utf-8");
  fs.writeFileSync("./build/lib/export/temp.txt", "temp", "utf-8");
}

fs.writeFileSync(
  `./build/lib/log/${currenttime}-NXL_Debug.log`,
  `
  Log File Details:
  - Loaded Configuration File: ./config.nxconf
  - Executed File: ${nxlf}
  `
);
