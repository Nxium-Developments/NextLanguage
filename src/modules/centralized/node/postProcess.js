const evaluateCondition = require('../evaluater');
const processNode = require('../node/process');
const { handleWhileLoop, handleForLoop } = require('../handlers/loops');

/** Post-process the AST */
const postProcessAST = (ast, context) => {
    const { variables, functions, loops, forLoops } = context;

    ast.forEach((node) => {
        if (node.type === "IfStatement") {
            const conditionMet = evaluateCondition(node.condition, variables);
            const targetNodes = conditionMet ? node.consequent : node.alternate;
            targetNodes.forEach((child) => {
                processNode(child, "", context);
            });
        }

        if (node.type === "Function" && functions[node.name]) {
            const functionData = functions[node.name];
            if (!functionData.executed) return false;
        }

        if (node.type === "WhileLoop" && loops[node.index]) {
            handleWhileLoop(node, context);
        }

        if (node.type === "ForLoop" && forLoops[node.index]) {
            handleForLoop(node, context);
        }
    });
};

module.exports = postProcessAST;