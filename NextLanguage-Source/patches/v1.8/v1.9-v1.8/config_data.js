const { preloadPath } = require("../../v1.8/contents.js");
const { postloadPath } = require("../../v1.8/contents.js");

const configurationFile = `# Main File Path: root/me (typically for when you want to set which file is the main file.)
PACKAGE-MAIN: root/me

# Other Packages files (To note, the other file packages has to be .package. Otherwise it won't work.)
PACKAGES-LIST: [START]
    @File: C:/Whatever/folder/alternatefile.package
[END]

# Preload File paths
PRELOAD-PATH: ${preloadPath}
POSTLOAD-PATH: ${postloadPath}
`

module.exports = configurationFile