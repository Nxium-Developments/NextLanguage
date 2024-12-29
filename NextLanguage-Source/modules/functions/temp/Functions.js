const functions = {};

const getFunctions = () => functions;

const setFunction = (key, func) => {
    functions[key] = func;
};

// Export the getter and setter functions
module.exports = {
    getFunctions,
    setFunction,
};