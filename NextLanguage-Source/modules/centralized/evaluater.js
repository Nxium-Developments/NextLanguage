/**
 * Evaluates a condition string using the variable table.
 * @param {string} condition - The condition to evaluate.
 * @returns {boolean} - The result of the condition.
 */
module.exports = evaluateCondition = (condition, variables) => {
    try {
        // Replace variable names with their values
        const replacedCondition = condition.replace(
            /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g,
            (varName) => {
                if (variables[varName]) {
                    return JSON.stringify(variables[varName].value);
                }
                throw new Error(`Undefined variable: ${varName}`);
            }
        );
        // Use `eval` to evaluate the condition and ensure only boolean is returned
        return !!eval(replacedCondition); // Double negation ensures a boolean result
    } catch (error) {
        console.error(`Error evaluating condition "${condition}": ${error.message}`);
        return false; // Return false in case of any error
    }
};