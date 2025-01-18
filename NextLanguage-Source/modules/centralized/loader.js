const fs = require("fs");
const centralParse = require("./parser");

/** Caching for already imported files */
const fileCache = new Map();

/** Helper to load and parse ASTs */
module.exports = loadAST = (filePath) => {
    if (fileCache.has(filePath)) return fileCache.get(filePath);

    try {
        const content = fs.readFileSync(filePath, "utf-8");
        const lines = content.split("\n").map(line => line.trim());
        const ast = centralParse(lines);
        fileCache.set(filePath, ast);
        return ast;
    } catch (error) {
        throw new Error(`Failed to load AST from ${filePath}: ${error.message}`);
    }
};