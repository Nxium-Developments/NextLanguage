const debugOutput = require('./debugOutput');
const { setVariable } = require('./localStorage');

// Helper to parse variables
module.exports = function parseVariable(line) {
    const match = line.match(/@var(?:iable)? \[(.+?)\]:\s?\((.+?)\)(.+)/);
    if (!match) return;

    const [, name, type, value] = match;

    let parsedValue = value.trim();
    let parsedtype = type.trim();
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
    } else if (type.toLowerCase() === "string") {
        parsedValue = value;
    } else {
        parsedValue = value;
        parsedtype = "string";
    }

    const variable = { name, type, value: parsedValue };

    setVariable(variable.name, variable.type, variable.value);
    debugOutput(line, `Variable '${name}' initialized as '${type}' with value: ${parsedValue}`);
}