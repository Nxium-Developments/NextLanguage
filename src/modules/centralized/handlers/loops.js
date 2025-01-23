const evaluateCondition = require('../evaluater');
const addOutput = require('../../../build/lib/output/addOutput');
const processNode = require('../node/process');

/** While Loops */
const handleWhileLoop = async (node, context) => {
    node.body = context.loops[node.index].body;
    
    while (evaluateCondition(
        context.variables[node.condition.split(" ")[0]].value + 
        node.condition.split(" ")[1] + 
        node.condition.split(" ")[2], 
        context.variables
    )) {
        for (const innerNode of node.body) {
            if (innerNode.type === "OutputStatement") {
                addOutput(innerNode.value);
            } else {
                processNode(innerNode, "", context); // ✅ Ensure each iteration fully executes
            }
        }
    }
};

/** For Loops */
const handleForLoop = async (node, context) => {
    // Extract start, end, and optional step
    const rangeParts = node.range.match(/^(\d+)\.\.(\d+)(?:\s+step\s+(\d+))?$/);
    if (!rangeParts) {
        throw new Error(`Invalid range format: ${node.range}`);
    }

    const start = Number(rangeParts[1]);
    const end = Number(rangeParts[2]);
    const step = rangeParts[3] ? Number(rangeParts[3]) : 1; // Default step is 1

    if (step <= 0) {
        throw new Error(`Invalid step value: ${step}. Must be greater than 0.`);
    }

    // Loop through range step-by-step
    for (let i = start; i <= end; i += step) {
        context.variables[node.variable] = { value: i };

        for (const innerNode of context.forLoops[node.index].body) {

            // ✅ Manually increment `x` to avoid infinite loop
            if (context.variables[node.variables]) {
                context.variables[node.variables].value++;
            }

            if (innerNode.type === "OutputStatement") {
                addOutput(i);
            } else {
                await processNode(innerNode, "", context);
            }
        }
    }
};


module.exports = { handleWhileLoop, handleForLoop };