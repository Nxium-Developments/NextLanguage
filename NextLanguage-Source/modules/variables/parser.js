const variables = require('../../build/lib/memoryStore/temp/Variables.js');

/**
 * Parses @var lines and stores variables in a table.
 * @param {string[]} lines - The lines of code.
 */
/** REMOVAL */

module.exports = parseVars = (lines) => {
    for (const line of lines) {
        const varMatch = line.match(/@var \[(.+?)\]: \((.+?)\)(.+)/);
        if (varMatch) {
            const [, varName, varType, varValue] = varMatch;
            // Parse value based on type
            let parsedValue;
            switch (varType) {
                case "integer":
                    parsedValue = parseInt(varValue, 10);
                    break;
                case "double":
                    parsedValue = parseFloat(varValue);
                    break;
                case "boolean":
                    parsedValue = varValue === "true";
                    break;
                case "string":
                case "percentage":
                case "negatives":
                    parsedValue = varValue;
                    break;
                default:
                    throw new Error(`Unknown type: ${varType}`);
            }
            variables[varName] = parsedValue;
        }
    }
};