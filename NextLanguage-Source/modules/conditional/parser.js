/** REMOVAL */

const evaluateCondition = require('./evaluater.js');

/**
 * Parses and evaluates @if blocks.
 * @param {string[]} lines - The lines of code.
 */
module.exports = parseIfBlocks = (lines) => {
    let i = 0;

    while (i < lines.length) {
        const line = lines[i].trim();

        // Check for @if condition
        if (line.startsWith("@if")) {
            const ifMatch = line.match(/@if \[(.+?)\]:/);
            if (ifMatch) {
                const condition = ifMatch[1];

                // Evaluate the condition
                let conditionResult = evaluateCondition(condition);

                i++; // Move to the block content
                while (i < lines.length) {
                    const blockLine = lines[i].trim();

                    if (blockLine.startsWith(":@output") && conditionResult) {
                        // Output the result if the condition is true
                        console.log(blockLine.replace(":@output", "").trim());
                    } else if (blockLine.startsWith("@else")) {
                        // Switch to the else block
                        conditionResult = !conditionResult;
                    } else if (blockLine.startsWith("@end")) {
                        // End of the block
                        i++;
                        break;
                    }

                    i++;
                }
                continue;
            }
        }

        i++;
    }
};