const path = require('path');

const Packages = require('../../../modules/class/Packages.js');
const package = new Packages;

const secured = package.strings.full.package.dev.self;

module.exports = function SecureService() {
    // Registers the plugin
    const Secure = package.create('package', path.join(__dirname, 'default.js'), 'Secure');
    Secure.config('package', 'Secure', 'enabled', true);

    // Package Information
    Secure.config('package', 'Secure', 'author', 'Cassitly');
    Secure.config('package', 'Secure', 'version', '0.1.0');
    Secure.config('package', 'Secure', 'repo', 'https://github.com/nxoscloud/Secure/');
    Secure.config('package', 'Secure', 'description', '(Secure package for NextLanguage) A package which securely exposes NextLanguages Modules to external files. I.E. Plugins, packages, postload and preload files.');

}, secured;