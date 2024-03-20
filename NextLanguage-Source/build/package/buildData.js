// buildData.js

const getCurrentFilenames = require('../../modules/path-ifFileExists')
const fs = require('fs');

function development_build(check) {
    
    if (check) {
        getCurrentFilenames();
        console.log("\nDevelopment Release Type:",
            fs.readFileSync("./release_build.type_xc", "utf8"));
    } else {
        return "Invaild use of arguments correct statement use is: development_build(check)";
    }
}

function development_version(check) {

    if (check) {
        getCurrentFilenames();
        console.log("\nDevelopment Release Version:",
            fs.readFileSync("./versions/v1.3.core_nxa", "utf8"));
    } else {
        return "Invaild use of arguments correct statement use is: development_version(check)";
    }
}

function development_type(check) {

    if (check) {
        getCurrentFilenames();
        console.log("\nDevelopment Product Type:",
            fs.readFileSync("./type/computer_language.core_nxa", "utf8"));
    } else {
        return "Invaild use of arguments correct statement use is: development_type(check)";
    }
}

function development_mode(check, set) {

    if (check) {
        getCurrentFilenames();
        console.log("\nDevelopment Mode: ",
            fs.readFileSync("./dev/config.dev_nxa", "utf8"));
    } else if (set) {
        if (set == "true") {
            fs.writeFileSync("./dev/config.dev_nxa" + set, "true");

            getCurrentFilenames();
            console.log("\nDevelopment Mode: ",
                fs.readFileSync("./dev/config.dev_nxa", "utf8"));
        } else if (set == "false") {
            fs.writeFileSync("./dev/config.dev_nxa" + set, "false");

            getCurrentFilenames();
            console.log("\nDevelopment Mode: ",
                fs.readFileSync("./dev/config.dev_nxa", "utf8"));
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