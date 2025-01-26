/** Logging Imports */
const addOutput = require('../../../build/lib/output/addOutput');
const debugOutput = require('../../../build/lib/output/debugOutput');

/** Packages and Loops */
const { handleExportPackage, handleImportPackage } = require('../handlers/packages');
const { handleFunctionCall } = require('../handlers/call');

/** Single Functions */
const handleOutputStatement = require('../handlers/output');
const handleInputStatement = require('../handlers/input');
const addToCurrentContext = require('../context/addCurrent');

/** Function to process individual AST nodes */
const processNode = async (node, basePath, context) => {
    switch (node.type) {
        /** Function handling */
        case "Function":
            context.functions[node.name] = { body: [], executed: false };
            context.currentFunction = node.name;
            break;

        /** Package-related nodes */
        case "ImportPackage":
            await handleImportPackage(node, context, basePath);
            break;

        case "ExportPackage":
            await handleExportPackage(node.value, context);
            break;

        case "Package":
            addOutput(`Package: ${node.value}`);
            break;

        case "RequirePackage":
            addOutput(`Require: ${node.value}`);
            break;

        /** Conditional handling */
        case "IfStatement":
            context.currentIfBlock = { ...node, consequent: [], alternate: [] };
            break;

        case "ElseStatement":
            if (context.currentIfBlock) {
                context.currentIfBlock.isElse = true;
            }
            break;

        /** Loop handling */
        case "WhileLoop":
            context.loops[node.index] = { body: [], condition: node.condition, incr: node.incr };
            context.currentLoop = `${node.index}`;
            break;

        case "ForLoop":
            context.forLoops[node.index] = { body: [], range: node.range };
            context.currentForLoop = `${node.index}`;
            break;

        /** Output handling */
        case "OutputStatement":
            await handleOutputStatement(node, context);
            break;

        /** Variables handling */
        case "Variable":
            context.variables[node.name] = { value: node.value, param: node.param };
            break;

        /** End Statements */
        case "EndStatement":
            context.currentIfBlock = null;
            context.currentFunction = null;
            context.currentLoop = null;
            break;

        case "InputStatement":
            await handleInputStatement(node, context);
            break;

        case "Call":
            handleFunctionCall(node, context);
            break;

        /** Generic handling */
        case "Generic":
            addToCurrentContext(node, context);
            break;

        default:
            debugOutput(`Unknown node type: ${node.type}`);
            addOutput(`Error processing node: ${node.type}`);
            break;
    }
};

module.exports = processNode;