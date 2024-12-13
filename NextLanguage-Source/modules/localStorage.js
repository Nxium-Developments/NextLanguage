const variables = {};
const functions = {};
const packages = {
    main: null,
    commands: [],
    advanced: false,
<<<<<<< Updated upstream
    debugMode: null,
=======
    debugMode: true,
>>>>>>> Stashed changes
};

// Getter functions
const getVariables = (name) => {
    const variable = variables[name];
    if (variable !== undefined) {
        return variable.value; // Return the value of the variable
    }
    return null; // Return null if the variable doesn't exist
};
const getFunctions = () => functions;
const getPackages = () => packages;

// Setter functions
const setVariable = (name, type, value) => {
    variables[name] = { type, value };
};

const setFunction = (key, func) => {
    functions[key] = func;
};

const setPackageMain = (mainValue) => {
    packages.main = mainValue;
};

const addPackageCommand = (command) => {
    packages.commands.push(command);
};

const setPackageAdvanced = (value) => {
    packages.advanced = value;
};

const setPackageDebugMode = (value) => {
    packages.debugMode = value;
};

// Export the getter and setter functions
module.exports = {
    getVariables,
    getFunctions,
    getPackages,
    setVariable,
    setFunction,
    setPackageMain,
    addPackageCommand,
    setPackageAdvanced,
    setPackageDebugMode,
};