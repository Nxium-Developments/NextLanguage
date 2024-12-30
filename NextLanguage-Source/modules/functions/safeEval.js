// Local Imports for logging and Variable Data
const addOutput = require('./addOutput');
const getVariables = require('../class/Packages').getVariables;

// Module Helper to safely evaluate conditions
module.exports = function safeEval(condition) {
    try {
        // Replace variables in the condition with their actual values
        const conditionReplaced = condition.replace(/([a-zA-Z_][a-zA-Z0-9_]*)/g, (match) => {
            // Get the variable value from localStorage
            const variableValue = getVariables(match);
            return JSON.stringify(variableValue); // Safely replace variable with its value
        });

        // Evaluate the condition after replacement
        return eval(conditionReplaced);
    } catch (error) {
        addOutput(`Error evaluating condition: ${condition}`);
        console.error(error);
        return false;
    }
};
