const addOutput = require("../../build/lib/output/addOutput");
const debugOutput = require("../../build/lib/output/debugOutput");

module.exports = executeFunction = async (ast) => {
    for (const node of ast) {
        switch (node.type) {
            case "Generic":
                debugOutput(`Executing: ${node.content}`);
                break;
            case "Function":
                debugOutput(`Executing function: ${node.name}`);
                for (const line of node.body) {
                    debugOutput(`  -> ${line}`);
                    if (line.startsWith("@output")) {
                        addOutput(line.substring(8));
                    }
                }
                break;
            default:
                debugOutput(`Unknown node type: ${node.type}`);
        }
    }
};
