const setFunction = require('./localStorage.js').setFunction;
const addOutput = require('./addOutput.js');

// Helper to execute functions
module.exports = function executeFunction(lines, inline, name, functionMatch) {
    // Get the function body
    const functionBodyIndex = lines.indexOf(inline) + 1;

    // Get the function body contents
    const functionBody = inline.codePointAt(0) === 91 ? lines.slice(functionBodyIndex).join("\n") : lines[functionBodyIndex];

    // Separates the function blocks.
    const Block = lines.slice(lines.indexOf(inline) + 1).join('\n').split('\n@end')[0];

    // Sets the actual Function Input
    functionMatch.input = functionBody

    // Register the function contents
    setFunction(name, functionMatch)
    
    // Checks if the function body has any registered commands
    if (Block?.startsWith(":output")) {
      // Separates the contents of @output
      const text = Block.split(':output').slice(1).join('\n').split('\n:end')[0].trim();

      // Outputs the text
      addOutput(text);
    }
}