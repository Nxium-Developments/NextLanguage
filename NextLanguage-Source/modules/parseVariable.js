const debugOutput = require('./debugOutput');
const { setVariable } = require('./localStorage');

module.exports = function parseVariable(line) {
    // Adjust regex to capture the name, type (optional), and value
    const match = line.match(/@var(?:iable)? \[(.+?)\]:\s?\((.*?)\)(.+)/);    

    // If no match is found, return early
    if (!match) return;

    // Extract variable name, type, and value
    const [, name, type, value] = match;

    // If the type is missing and the value is not a valid type, assume value is the type
    let parsedValue = value.trim();
    let parsedType = type.trim();  // Default type to "string" if no type is provided

    // If the type is mistakenly set to something like "Someone", treat it as a value instead
    if (!parsedValue || !isNaN(parsedValue)) {
        // Make sure the type is isn't vaild. Then assume "string"
        if (!parsedType.toLowerCase() === "negative" || !parsedType.toLowerCase() === "percent" || !parsedType.toLowerCase() === "percentage" || !parsedType.toLowerCase() === "int" || !parsedType.toLowerCase() === "integer" || !parsedType.toLowerCase() === "double" || !parsedType.toLowerCase() === "string") {
            parsedType = "string"; // Assume "string" as the type if no valid type is found
            parsedValue = type.trim(); // The value is actually in the 'type' section
        }     
    } else {
        // Handle different types
        if (parsedType.toLowerCase() === "negative") {
            parsedValue = parseFloat(value.replace("(negative)", "-"));
        } else if (parsedType.toLowerCase() === "percent" || parsedType.toLowerCase() === "percentage") {
            parsedValue = parseFloat(value.replace("%", ""));
        } else if (parsedType.toLowerCase() === "int" || parsedType.toLowerCase() === "integer") {
            parsedValue = parseInt(value, 10);
        } else if (parsedType.toLowerCase() === "double") {
            parsedValue = parseFloat(value);
        } else if (parsedType.toLowerCase() === "boolean") {
            parsedValue = value.toLowerCase() === "true";
        } else if (parsedType.toLowerCase() === "string") {
            parsedValue = value;
        }
    }

    // Log if no type was provided
    if (!type) {
        debugOutput(line, `No type provided for '${name}', defaulting to 'string'.`);
    }

    const variable = { name, type: parsedType, value: parsedValue };

    setVariable(variable.name, variable.type, variable.value);
    debugOutput(line, `Variable '${name}' initialized as '${parsedType}' with value: ${parsedValue}`);
};
