const addOutput = require('./addOutput');

module.exports = function executeFunction(lines, inline, functionMatch) {
  // Get the function body index
  const functionBodyIndex = lines.indexOf(inline) + 1;

  // Determine the function body contents
  const functionBody = inline.codePointAt(0) === 91 
      ? lines.slice(functionBodyIndex).join("\n") 
      : lines[functionBodyIndex];

  // Separate the function blocks
  const Block = lines
      .slice(lines.indexOf(inline) + 1)
      .join("\n")
      .split("\n@end")[0];

  // Set the actual function input
  functionMatch.input = functionBody;
  
  // Check if the result contains an output directive
  const output = Block.split('\n')[0].trim();

  if (output.startsWith(":params")) {
    // Extract the contents of :params
    const params = Block.split(':params').slice(1).join('\n').split(':end')[0].trim();

    // Output the extracted text
    addOutput(params);
  }

    // Check if the result contains an output directive
    if (output.startsWith(":output")) {
        // Extract the contents of :output
        const text = Block.split(':output').slice(1).join('').split(';')[0].trim();

        // Output the extracted text
        addOutput(text);
    }
};
