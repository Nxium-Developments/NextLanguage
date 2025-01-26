const addOutput = require('../../../build/lib/output/addOutput');

/** Handle output statements */
const handleOutputStatement = async (node, context) => {
    const { currentIfBlock, currentFunction, functions, currentLoop, loops, forLoops, currentForLoop } = context;
    if (currentIfBlock) {
        if (currentIfBlock.isElse) {
            currentIfBlock.alternate.push(node);
        } else {
            currentIfBlock.consequent.push(node);
        }
    } else

    if (currentFunction) functions[currentFunction].body.push(node); else
    if (currentLoop) await loops[currentLoop].body.push(node); else
    if (forLoops[currentForLoop]) await forLoops[currentForLoop].body.push(node); else

    if (context.variables[node.value]) {
        addOutput(context.variables[node.value].value); // Top-level output
    } else {
        addOutput(node.value); // Variable or constant output
    }
};

module.exports = handleOutputStatement;