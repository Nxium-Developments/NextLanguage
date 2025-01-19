const addOutput = require('../../../build/lib/output/addOutput');

/** Handle function calls */
const handleFunctionCall = async (node, context) => {
    const { functions, currentIfBlock, currentFunction, loops, forLoops, currentLoop, currentForLoop } = context;
    const functionData = functions[node.param];
    if (currentIfBlock) {
        if (currentIfBlock.isElse) {
            currentIfBlock.alternate.push(node);
        } else {
            currentIfBlock.consequent.push(node);
        }
    } else

    if (currentFunction) functions[currentFunction].body.push(node); else
    if (currentLoop) await loops[currentLoop].body.push(node); else
    if (forLoops[currentForLoop]) await forLoops[currentForLoop].body.push(node);
    
    if (!functionData.executed) {
        functionData.executed = true;
        functionData.body.forEach((child) => {
            if (child.type === "OutputStatement") {
                addOutput(child.value);
            }
        });
    }
};

module.exports = { handleFunctionCall };