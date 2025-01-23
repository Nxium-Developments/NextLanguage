/** CENTRALIZED PARSER */
module.exports = centralParse = (lines) => {
    return lines
        .filter(line => line.trim() && !line.startsWith("#") && !line.startsWith(undefined)) // Ignore empty lines and comments
        .map(line => {
            // TODO: Remove :package-main , :package-com , and :package-advanced or add functionality to them.
            if (line.startsWith(":packages")) {
                if (line.match(/:packages (.+) \@(.+?) (.+)/)?.[2] === "import") {
                    return { type: "ImportPackage", name: line.match(/:packages (.+) \@(.+)/)?.[1], value: line.match(/:packages (.+) \@(.+) (.+)/)?.[3] };
                } else

                if (line.match(/:packages (.+) \@(.+)/)?.[2] === "export") {
                    return { type: "ExportPackage", value: line.match(/:packages (.+) \@(.+)/)?.[1] };
                }
                
                return { type: "Packages", value: line.match(/:packages (.+) \@(.+?) (.+)/)?.[2] };
            } else
            
            /** FUNCTION STATEMENTS */
            if (line.startsWith("@function")) {
                /** Refer to this incase of an issue. line.match(/@ function \[(.+)\]\:/)?.[1++] */
                return { type: "Function", name: line.match(/@function \[(.+)\]:/)?.[1], body: [] };
            } else
            
            if (line.startsWith("@call")) {
                const match = line.match(/@call \:(.+?)\[(.+?)\]/);
                return { type: "Call", line: match[0], arguments: match[1], param: match[2] };
            } else
            
            /** POSSIBLE REMOVAL */
            // if (line.startsWith(":windows")) {
            //     const match = line.match(/:windows\((.+)\.(.+?)\)\.(.+)/);
            //     return { type: "Windows", match };
            // } else
            
            // if (line.startsWith(":export")) {
            //     return { type: "Export" };
            // } else
            
            /** IF STATEMENTS */
            if (line.startsWith("@if")) {
                return { type: "IfStatement", condition: line.match(/@if \[(.+)\]:/)?.[1], consequent: [], alternate: [] };
            } else
            
            if (line.startsWith("@else")) {
                return { type: "ElseStatement" };
            } else
            

            /** END STATEMENTS */
            if (line.startsWith("@end")) {
                return { type: "EndStatement" };
            } else

            /** LOOP STATEMENTS */
            if (line.startsWith("@while")) {
                return { type: "WhileLoop", condition: line.match(/@while \[(.+?)\]:/)?.[1], body: [], index: line.match(/@while \[(.+?)\]:/)?.index };
            } else

            if (line.startsWith("@for")) {
                return { type: "ForLoop", variable: line.match(/@for \[(.+?)\]/)?.[1], arguments: line.match(/@for \[(.+?)\] (.+)/)?.[2], range: line.match(/@for \[(.+?)\] (.+) \[(.+?)\]:/)?.[3], body: [], index: line.match(/@for \[(.+?)\] (.+) \[(.+?)\]:/)?.index };
            } else

            /** OUTPUT STATEMENTS */
            if (line.startsWith("@output")) {
                return { type: "OutputStatement", value: line.match(/@output (.+)/)?.[1], line: line.match(/@output (.+)/)?.[0] };
            }
            
            /** VARIABLE STATEMENTS */
            if (line.startsWith("@var")) {
                return { type: "Variable", name: line.match(/@var \[(.+?)\]:/)?.[1], param: line.match(/@var \[(.+?)\]: \((.+?)\)/)?.[2], value: line.match(/@var \[(.+?)\]: \((.+?)\)(.+)/)?.[3] };
            } else

            if (line.startsWith("@input")) {
                return { type: "InputStatement", prompt: line.match(/@input \[(.+)\]:/)?.[1], variable: line.match(/@input \[(.+)\]: (.+)/)?.[2] };
            }

            /** GENERIC STATEMENTS */
            else {
                return { type: "Generic", content: line };
            }
        });
};
