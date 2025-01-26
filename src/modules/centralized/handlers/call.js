const addOutput = require('../../../build/lib/output/addOutput');

/** Handle function calls */
const handleFunctionCall = async (node, context) => {
    const { functions, currentFunction } = context;
    const functionData = functions[node.param];

    if (currentFunction) functions[currentFunction].body.push(node); else
    
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