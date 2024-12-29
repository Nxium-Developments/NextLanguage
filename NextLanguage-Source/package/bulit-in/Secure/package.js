const path = require('path');

const addOutput = require('../../../modules/functions/addOutput.js');
const debugOutput = require('../../../modules/functions/debugOutput.js');

const Packages = require('../../../modules/class/Packages.js');
const package = new Packages;

const secured = package.strings.full.package.dev.self;

module.exports = function SecureService() {
    const Secure = package.create('package', path.join(__dirname, 'default.js'), 'Secure');
    Secure.config('package', 'Secure', 'enabled', true);
    const enabled = Secure.strings.full.package.dev.self[1];

    // Additional information toggle for non-production ready
    // Updates for Secure.
    const production = false;

    Secure.config('package', 'Secure', 'author', 'Cassitly');
    Secure.config('package', 'Secure', 'version', '0.1.0');
    Secure.config('package', 'Secure', 'repo', 'No Repository published for Secure yet.');
    Secure.config('package', 'Secure', 'description', '(Secure package for NextLanguage) A package which securely exposes NextLanguages Modules to external files. I.E. Plugins, packages, postload and preload files.');

    if (enabled === true) {
        if (production === false) {
            addOutput('Secure package is enabled.');
        }
    } else {
        if (production === false) {
            addOutput('Secure package is disabled along an unknown error.');
        }
    }
}, secured;