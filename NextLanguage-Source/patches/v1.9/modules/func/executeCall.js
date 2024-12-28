module.exports = function executeCall(line, type, variables, name, action, addOutput, debugOutput) {
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
        addOutput(`:call Function is deprecated, use @output function_name instead`);
    }
}