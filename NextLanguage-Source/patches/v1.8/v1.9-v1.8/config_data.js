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

# Check box for checking for updates
CHECK-FOR-UPDATES: true

# WARNING: If you remove Secure as a Plugin Import, you will completely remove NextLanguage's Plugin system.
# Any plugin that wasn't ran successfully, without the secure plugin installed was because of Secure's security
# system that secures plugin pass through for NextLanguage. Running plugins with Secure disabled, will completely remove
# NextLanguage's plugin system. So do not remove the secure plugin. This will also result to NextLanguage's crashing.

# Plugins registrations
PLUGINS: Secure @require(path.join(__dirname, '../../../../package/bulit-in/Secure/package.js'));

# Non-official plugins registration examples
# PLUGINS: App @path: ../../../App.js
`

module.exports = configurationFile