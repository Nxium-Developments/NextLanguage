// AST Parser
module.exports = centralParse = (lines) => {
    return lines
        .filter(line => line.trim() && !line.startsWith("#") && !line.startsWith(undefined)) // Ignore empty lines and comments
        .map(line => {
            // TODO: Remove :package-main , :package-com , and :package-advanced or add functionality to them.
            if (line.startsWith(":package-main")) {
                return { type: "PackageMain", value: line.match(/:package-main (.+)/)?.[1] };
            } else
            
            if (line.startsWith(":package-com")) {
                return { type: "PackageCommand", value: line.match(/:package-com (.+)/)?.[1] };
            } else
            
            if (line.startsWith(":package-advanced")) {
                return { type: "PackageAdvanced", value: line.match(/:package-advanced (.+)/)?.[1] };
            } else
            
            if (line.startsWith("@function")) {
                /** Refer to this incase of an issue. line.match(/@ function \[(.+)\]\:/)?.[1++] */
                return { type: "Function", name: line.match(/@function \[(.+)\]:/)?.[1], body: [] };
            } else
            
            if (line.startsWith("@call")) {
                const match = line.match(/@call \:(.+?)\[(.+?)\]/);
                return { type: "Call", line: match[0], arguments: match[1], param: match[2] };
            } else
            
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

            /** OUTPUT STATEMENTS */
            
            if (line.startsWith("@output")) {
                return { type: "OutputStatement", value: line.match(/@output (.+)/)?.[1], line: line.match(/@output (.+)/)?.[0] };
            }
            
            /** VARIABLE STATEMENTS */
            if (line.startsWith("@var")) {
                return { type: "Variable", name: line.match(/@var \[(.+?)\]:/)?.[1], param: line.match(/@var \[(.+?)\]: \((.+?)\)/)?.[2], value: line.match(/@var \[(.+?)\]: \((.+?)\)(.+)/)?.[3] };
            } else

            /** GENERIC STATEMENTS */
            if (line.startsWith(":@")) {
                return { type: "ArgumentStatement", arguments: line.match(/:@(.+?) /)?.[1], param: line.match(/:@(.+?) (.+)/)?.[2], full: line.match(/:@(.+?) (.+)/)?.[0] };
            }

            else {
                return { type: "Generic", content: line };
            }
        });
};
