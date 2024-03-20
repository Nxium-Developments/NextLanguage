// buildData.js

const fs = require('fs');

function development_build(check) {
           
    console.log("\nDevelopment Release Type:"),
    console.log(
        fs.readFileSync(__dirname + "\\id\\release_build.type_xc", "utf8")
    );
}

function development_version(check) {
       
    console.log("\nDevelopment Release Version:"),
    console.log(
        fs.readFileSync(__dirname + "\\id\\versions\\v1.4.core_nxa", "utf8")
    );
}

function development_type(check) {
       
    console.log("\nDevelopment Product Type:",
    fs.readFileSync(__dirname + "\\id\\type\\computer_language.core_nxa", "utf8"));
}

function development_mode(check, set) {

    if (check) {
        
        console.log("\nDevelopment Mode: ",
            fs.readFileSync(__dirname + "\\id\\dev\\config.dev_nxa", "utf8"));
    } else if (set) {
        if (set == "true") {
            fs.writeFileSync(__dirname + "\\id\\dev\\config.dev_nxa", + set, "true");

            
            console.log("\nDevelopment Mode: ",
                fs.readFileSync(__dirname + "\\id\\dev\\config.dev_nxa", "utf8"));
        } else if (set == "false") {
            fs.writeFileSync(__dirname + "\\id\\dev\\config.dev_nxa", + set, "false");

            
            console.log("\nDevelopment Mode: ",
                fs.readFileSync(__dirname + "\\id\\dev\\config.dev_nxa", "utf8"));
        }
    } else {
        return "Invaild use of arguments correct statement use is: development_mode(check, set)";
    }
}

module.exports = {
    development_build,
    development_version,
    development_type,
    development_mode
}