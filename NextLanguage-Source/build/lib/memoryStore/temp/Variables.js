const variables = {};

// Getter functions
const getVariables = (name) => {
    const variable = variables[name];
    if (variable !== undefined) {
        return variable.value; // Return the value of the variable
    }
    return null; // Return null if the variable doesn't exist
};

// Setter functions
const setVariable = (name, type, value) => {
    variables[name] = { type, value };
};

// Export the getter and setter functions
module.exports = {
    getVariables,
    setVariable,
};