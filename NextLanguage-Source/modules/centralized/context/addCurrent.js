/** Add to current context */
const addToCurrentContext = (node, context) => {
    const { currentIfBlock, currentFunction, functions } = context;
    if (currentIfBlock) {
        currentIfBlock.consequent.push(node.line);
    } else if (currentFunction) {
        functions[currentFunction].body.push(node.line);
    }
};

module.exports = addToCurrentContext;