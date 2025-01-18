const { preloadPath } = require("../../patches/v1.8/returns.js");
const { postloadPath } = require("../../patches/v1.8/returns.js");

const configurationFile = `# Main File Path: root/me (typically for when you want to set which file is the main file.)
PACKAGES: @main C:\Users\jedik\Documents\GitHub\Project Next\Products\NextLanguage\app.nxl

# Plugins registrations
PLUGINS: Secure @require(path.join(__dirname, '../../package/bulit-in/Secure/package.js')); @sign null
PLUGINS: Debugger @require(path.join(__dirname, '../../package/bulit-in/Debugger/package.js')); @sign null

# Non-official plugins registration examples (Taken from: https://github.com/nxoscloud/Custom)
# PLUGINS: App @path: Custom/Plugin.js @sign Custom/Signed.config.js
`

module.exports = configurationFile