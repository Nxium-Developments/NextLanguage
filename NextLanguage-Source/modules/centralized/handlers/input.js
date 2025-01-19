/** Handle input statements */
const handleInputStatement = async (node, context) => {
    process.stdout.write(`${node.prompt}: `);
    const userInput = await new Promise(resolve => process.stdin.once("data", data => resolve(data.toString().trim())));
    context.variables[node.variable] = { value: userInput };
};

module.exports = handleInputStatement;