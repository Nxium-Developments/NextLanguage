module.exports = function outputCommand(line, addOutput, getVariable) {
    // Handle output command
    if (line.startsWith("@output")) {
        // Separates the contents of @output
        const text = line.split("@output")[1].trim();
        // Checks if the text contains a variable reference
        const variable = getVariable(text);
        if (variable) { // If so, output the variable contents
          addOutput(variable);

          return; // Removes double outputs
        }

        // If not, output the text
        addOutput(text);
    }
}