const functions = require('../../build/lib/memoryStore/temp/Functions.js');
const variables = require('../../build/lib/memoryStore/temp/Variables.js');

const evaluateCondition = require('./evaluater.js');

// AST Executor
module.exports = centralExecutor = async (ast) => {
    let variableList = null;
    let currentIfBlock = null;
    let currentFunction = null;

    for (const node of ast) {
        switch (node.type) {
            case "PackageMain":
                console.log(`PackageMain: ${node.value}`);
                break;

            case "PackageCommand":
                console.log(`PackageCommand: ${node.value}`);
                break;

            case "PackageAdvanced":
                console.log(`PackageAdvanced: ${node.value === "true" ? "Enabled" : "Disabled"}`);
                break;

            case "Function":
                currentFunction = node;
                functions[node.name] = { body: [] }; // Initialize function storage
                break;

            case "Call":
                if (node.match) {
                    const [, type, name, action] = node.match;
                    console.log(`Call: type=${type}, name=${name}, action=${action}`);
                }
                break;

            case "Windows":
                console.log(":windows command is under development");
                break;

            case "Export":
                console.log(":export command is under development");
                break;

            case "IfStatement":
                currentIfBlock = node;
                break;

            case "ElseStatement":
                if (currentIfBlock) {
                    currentIfBlock.isElse = true;
                }
                break;

            case "EndStatement":
                currentIfBlock = null;
                currentFunction = null;
                break;

            case "OutputStatement":
                if (currentIfBlock) {
                    if (currentIfBlock.isElse) {
                        currentIfBlock.alternate.push(node);
                    } else {
                        currentIfBlock.consequent.push(node);
                    }
                } else if (currentFunction) {
                    functions[currentFunction.name].body.push(node);
                } else {
                    console.log(node.value); // Top-level output
                }
                break;

            case "Variable":
                if (variableList) {
                    variables[node.name] = { param: node.param, value: node.value };
                }
                break;

            case "Generic":
                if (currentFunction) {
                    functions[currentFunction.name].body.push(node);
                }
                break;

            default:
                console.warn(`Unknown node type: ${node.type}, idkfu: ${node}`);
        }
    }

    // Execute all IfStatements
    ast.forEach((node) => {
        if (node.type === "IfStatement") {
            if (evaluateCondition(node.condition)) {
                node.consequent.forEach((child) => {
                    if (child.type === "OutputStatement") {
                        console.log(child.value);
                    }
                });
            } else {
                node.alternate.forEach((child) => {
                    if (child.type === "OutputStatement") {
                        console.log(child.value);
                    }
                });
            }
        }

        if (node.type === "Function") {
            functions[node.name].body.forEach((child) => {
                if (child.type === "OutputStatement") {
                    console.log(child.value);
                }
            });
        }

        if (node.type === "Variable") {
            variables[node.name] = { type: node.type, value: node.value };
        }
    });
};