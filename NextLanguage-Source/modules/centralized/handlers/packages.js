/** Nodejs Imports */
const { existsSync } = require('fs');
const path = require('path');

/** Output Imports */
const addOutput = require('../../../build/lib/output/addOutput');
const debugOutput = require('../../../build/lib/output/debugOutput');
const loadAST = require('../loader');

/** Function Imports */
const centralExecutor = require('../executor');
const { getFunctions, setFunction } = require('../../../build/lib/memoryStore/temp/Functions');

/** Handle package export */
const handleExportPackage = (packageName, lines) => {
    const { currentFunction, currentIfBlock, functions } = lines;
    if (currentIfBlock) {
        if (currentIfBlock.isElse) {
            currentIfBlock.alternate.push(node);
        } else {
            currentIfBlock.consequent.push(node);
        }
    } else if (currentFunction) {
        functions[currentFunction].body.push(node);
    }
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
    const { currentFunction, currentIfBlock, functions } = lines;
    if (currentIfBlock) {
        if (currentIfBlock.isElse) {
            currentIfBlock.alternate.push(node);
        } else {
            currentIfBlock.consequent.push(node);
        }
    } else if (currentFunction) {
        functions[currentFunction].body.push(node);
    }
    const importPath = path.resolve(basePath, node.value);
    if (!existsSync(importPath)) {
        throw new Error(`Import package not found: ${node.value}`);
    }
    const importedAST = loadAST(importPath);
    addOutput(`Importing package: ${node.value}`);
    await centralExecutor(importedAST, path.dirname(importPath));

    const importedPackages = getFunctions(node.value);
    lines.functions = importedPackages;
    lines.currentFunction = node.name;
};

module.exports = { handleImportPackage, handleExportPackage };