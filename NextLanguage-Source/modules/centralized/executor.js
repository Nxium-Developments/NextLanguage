const fs = require("fs");
const path = require("path");

/** MEMORY UNIT IMPORTS */
const { setFunction, getFunctions } = require("../../build/lib/memoryStore/temp/Functions.js");
const variables = require("../../build/lib/memoryStore/temp/Variables.js");

/** OTHER IMPORTS */
const evaluateCondition = require("./evaluater.js");
const loadAST = require("./loader.js");

/** ESSENTIAL IMPORTS */
const addOutput = require("../../build/lib/output/addOutput.js");
const debugOutput = require("../../build/lib/output/debugOutput.js");

const packages = require("../../patches/v1.8/returns.js").packages;

/** Main Executor Function */
const centralExecutor = async (ast) => {
    const context = {
        variables: {},
        functions: {},
        currentFunction: null,
        currentIfBlock: null,
        exportedPackages: {},
    };

    let basePath = path.resolve(__dirname, '../../../')
    /** Process each node in the AST */
    for (const node of ast) {
        try {
            await processNode(node, basePath, context);            
        } catch (error) {
            addOutput(`Error processing node of type ${node.type}: ${error}`);
        }
    }

    /** Handle post-processing for collected functions and IfStatements */
    postProcessAST(ast, context);
};

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

        case "MainPackage":
            addOutput(`PackageMain: ${node.name}`);
            break;

        case "Package":
            addOutput(`Package: ${node.value}`);
            break;

        case "RequirePackage":
            addOutput(`Require: ${node.value}`);
            break;

        case "Call":
            handleFunctionCall(node, context);
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

        /** Output handling */
        case "OutputStatement":
            handleOutputStatement(node, context);
            break;

        /** Variables handling */
        case "Variable":
            context.variables[node.name] = { value: node.value, param: node.param };
            break;

        /** Generic handling */
        case "ArgumentStatement":
        case "Generic":
            addToCurrentContext(node, context);
            break;

        /** End Statements */
        case "EndStatement":
            context.currentIfBlock = null;
            context.currentFunction = null;
            break;

        default:
            console.warn(`Unknown node type: ${node.type}`);
    }
};

/** Handle package export */
const handleExportPackage = (packageName, lines) => {
    try {
        // Write the relevant lines to the export file
        const exportContent = lines.functions[packageName];
        // fs.writeFileSync(exportFilePath, JSON.stringify(exportContent), "utf8");
        lines.exportedPackages[packageName] = exportContent;
        setFunction(packageName, exportContent);
        debugOutput(`Exported package '${packageName}'`);
    } catch (err) {
        addOutput(`Failed to export package '${packageName}':`, err.message);
    }
};

/** Handle package import */
const handleImportPackage = async (node, lines, basePath) => {
    const importPath = path.resolve(basePath, node.value);
    if (!fs.existsSync(importPath)) {
        throw new Error(`Import package not found: ${node.value}`);
    }
    const importedAST = loadAST(importPath);
    addOutput(`Importing package: ${node.value}`);
    await centralExecutor(importedAST, path.dirname(importPath));

    const importedPackages = getFunctions(node.value);
    lines.functions = importedPackages;
    lines.currentFunction = node.name;
};

/** Handle function calls */
const handleFunctionCall = (node, context) => {
    const { functions } = context;
    const functionData = functions[node.param];
    if (!functionData) {
        addOutput(`Function "${node.param}" not defined.`);
        return;
    }
    if (!functionData.executed) {
        functionData.executed = true;
        functionData.body.forEach((child) => {
            if (child.type === "OutputStatement") {
                addOutput(child.value);
            }
        });
    }
};

/** Handle output statements */
const handleOutputStatement = (node, context) => {
    const { currentIfBlock, currentFunction, functions } = context;
    if (currentIfBlock) {
        if (currentIfBlock.isElse) {
            currentIfBlock.alternate.push(node);
        } else {
            currentIfBlock.consequent.push(node);
        }
    } else if (currentFunction) {
        functions[currentFunction].body.push(node);
    } else {
        addOutput(node.value); // Top-level output
    }
};

/** Add to current context */
const addToCurrentContext = (node, context) => {
    const { currentIfBlock, currentFunction, functions } = context;
    if (currentIfBlock) {
        currentIfBlock.consequent.push(node.line);
    } else if (currentFunction) {
        functions[currentFunction].body.push(node.line);
    }
};

/** Post-process the AST */
const postProcessAST = (ast, context) => {
    const { variables, functions } = context;

    ast.forEach((node) => {
        if (node.type === "IfStatement") {
            const conditionMet = evaluateCondition(node.condition, variables);
            const targetNodes = conditionMet ? node.consequent : node.alternate;
            targetNodes.forEach((child) => {
                if (child.type === "OutputStatement") {
                    addOutput(child.value);
                }
            });
        }

        if (node.type === "Function" && functions[node.name]) {
            const functionData = functions[node.name];
            if (!functionData.executed) return false;
        }
    });
};

module.exports = centralExecutor;
