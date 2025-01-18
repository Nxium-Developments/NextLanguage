/** MEMORY UNIT IMPORTS */
const { setFunction, getFunctions } = require('../../build/lib/memoryStore/temp/Functions.js');
const variables = require('../../build/lib/memoryStore/temp/Variables.js');

/** OTHER IMPORTS */
const evaluateCondition = require('./evaluater.js');

/** ESSENTIAL IMPORTS */
const addOutput = require('../../build/lib/output/addOutput.js');
const debugOutput = require('../../build/lib/output/debugOutput.js');

const packages = require('../../patches/v1.8/returns.js').packages;

/** CENTRAL EXECUTION CODE */
module.exports = centralExecutor = async (ast) => {
    let variablesList = null
    let currentIfBlock = null;
    let currentFunction = null;
    let functions = {};

    for (const node of ast) {
        switch (node.type) {
            /** TODO: Add functionality */
            case "MainPackage":
                addOutput(`PackageMain: ${node.value}`);
                break;

            case "ImportPackage":
                if (node.name !== packages.packages) return false;
                else if (node.name === getFunctions()[node.name]) {
                    functions[node.name] = getFunctions()[node.name];
                }
                break;

            case "ExportPackage":
                if (node.name !== packages.packages) return false;
                else if (node.name === functions[node.name]) {
                    setFunction(node.name, functions[node.name]);
                }
                break;

            /** FUNCTION STATEMENT */
            case "Function":
                currentFunction = node;
                functions[node.name] = { body: [], executed: false }; // Initialize function storage
                break;

            case "Call":
                if (node.arguments !== "function") return false;
                
                if (functions[node.param]) {
                    if (!functions[node.param].executed) {
                        functions[node.param].executed = true;
                    }
                }
                break;

            // case "Windows":
            //     addOutput(":windows command is under development");
            //     break;

            // case "Export":
            //     addOutput(":export command is under development");
            //     break;

            /** IF STATEMENTs */            
            case "IfStatement":
                currentIfBlock = node;
                break;

            case "ElseStatement":
                if (currentIfBlock) {
                    currentIfBlock.isElse = true;
                }
                break;

            /** OUTPUT STATEMENTS */
            case "OutputStatement":
                if (currentIfBlock) {
                    if (currentIfBlock.isElse) {
                        currentIfBlock.alternate.push(node);
                    } else {
                        currentIfBlock.consequent.push(node);
                    }
                } else if (currentFunction) {
                    functions[currentFunction.name].body.push(node)
                    debugOutput(functions[currentFunction.name])
                } else {
                    addOutput(node.value); // Top-level output
                }
                break;

            /** VARIABLE STATEMENTS */
            case "Variable":
                variablesList = node;
                variables[node.name] = { param: node.param, value: node.value };
                break;

            /** GENERIC STATEMENTS */
            case "ArgumentStatement":
                if (currentIfBlock) {
                    currentIfBlock.consequent.push(node.line);
                } else

                if (currentFunction) {
                    functions[currentFunction.name].body.push(node.line);
                }
                break;

            case "Generic":
                if (currentFunction) {
                    functions[currentFunction.name].body.push(node);
                }
                break;

            /** END STATEMENTS */
            case "EndStatement":
                currentIfBlock = null;
                currentFunction = null;
                break;

            default:
                console.warn(`Unknown node type: ${node.type}, idkfu: ${node}`);
        }
    }

    // Execute all IfStatements
    ast.forEach((node) => {
        if (node.type === "IfStatement") {
            if (evaluateCondition(node.condition, variables)) {
                node.consequent.forEach((child) => {
                    if (child.type === "OutputStatement") {
                        addOutput(child.value);
                    }
                });
            } else {
                node.alternate.forEach((child) => {
                    if (child.type === "OutputStatement") {
                        addOutput(child.value);
                    }
                });
            }
        }

        if (node.type === "Function") {
            if (!functions[node.name].executed) return false;
            functions[node.name].body.forEach((child) => {
                if (child.type === "OutputStatement") {
                    addOutput(child.value);
                }
            });
        }

        if (node.type === "Variable") {
            // variables[node.name] = { type: node.type, value: node.value };
        }
    });
};