// Helper to execute functions
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

  // Call the matched function with the input
  const result = functionMatch;

  return {
      block: Block,
      result: result,
  };
};
