module.exports = parseFunction = (lines) => {
    const ast = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i].trim();

        // Ignore empty lines and comments
        if (!line || line.startsWith("#")) {
            i++;
            continue;
        }

        // Parse function block
        if (line.startsWith("@function")) {
            const functionMatch = line.match(/@function \[(.+)\]:/);
            if (functionMatch) {
                const [, functionName] = functionMatch;
                const functionBlock = { type: "Function", name: functionName, body: [] };

                i++; // Move to the next line to parse the function body

                while (i < lines.length) {
                    const bodyLine = lines[i].trim();

                    // Stop parsing when reaching the end of the function block
                    if (bodyLine.startsWith("@end")) {
                        i++;
                        break;
                    }

                    // Add non-empty body lines to the function body
                    if (bodyLine) {
                        functionBlock.body.push(bodyLine);
                    }

                    i++;
                }

                // Add the parsed function block to the AST
                ast.push(functionBlock);
                continue;
            }
        }

        // Parse generic lines
        ast.push({ type: "Generic", content: line });

        i++;
    }

    return ast;
};