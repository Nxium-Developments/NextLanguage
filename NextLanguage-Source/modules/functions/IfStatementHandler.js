// Local Imports for logging and Evaluations
const addOutput = require('./addOutput');
const safeEval = require('./safeEval');

module.exports = function IfStatementHandler() {
    /**
     * Parses and executes `if` statements.
     * @param {string} line - The NXL code line containing the if statement.
     * @param {Object} localVariables - The variables available in the current scope.
     */
    function parseIfStatement(line, lines) {
        // Match the 'if' condition and the associated blocks.
        const conditionMatch = line.match(/@if \[(.+?)\]:/);
        
        if (conditionMatch) {
            const [, condition] = conditionMatch;
            
            // Safely evaluate the condition in the current scope.
            const conditionValue = safeEval(condition);

            // Separates the if and else blocks.
            const ifBlock = lines.slice(lines.indexOf(line) + 1).join('\n').split('\n@else' || '\n@end')[0];
            const elseBlock = lines.slice(lines.indexOf(line) + 3).join('\n').split('\n@end')[0];
            
            // Determine which block to execute based on the condition.
            const blockToExecute = conditionValue ? ifBlock : elseBlock;
        

            // If the block to execute starts with ":output", handle the output.
            if (blockToExecute.startsWith(":output")) {
                // Separates the contents of @output
                const outputContent = blockToExecute.split(':output').slice(1).join('\n').split('\n:end')[0].trim();
                addOutput(outputContent); // Outputs the contents
            }
        } else {
            // Handle invalid syntax or other conditions
            addOutput('Invalid if statement syntax:' + line);
        }
    }

    return {
        parseIfStatement,
    };
};
