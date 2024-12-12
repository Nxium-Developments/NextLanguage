const addOutput = require('./addOutput');
const safeEval = require('./safeEval');

module.exports = function IfStatementHandler() {
    /**
     * Parses and executes `if` statements.
     * @param {string} line - The NXL code line containing the if statement.
     * @param {Object} localVariables - The variables available in the current scope.
     */
    function parseIfStatement(line) {
        // Match the 'if' condition and the associated blocks.
        const conditionMatch = line.match(/if \[(.+?)\]:\s?\((.*?)\)\s?else\s?\((.*?)\);/);
        
        if (conditionMatch) {
            const [, condition, ifBlock, elseBlock] = conditionMatch;
            
            // Safely evaluate the condition in the current scope.
            const conditionValue = safeEval(condition);
            
            // Determine which block to execute based on the condition.
            const blockToExecute = conditionValue ? ifBlock : elseBlock;
            
            // If the block to execute starts with ":output", handle the output.
            if (blockToExecute.startsWith(" :output")) {
                const outputContent = blockToExecute.split(" :output")[1].trim();
                addOutput(outputContent);
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
