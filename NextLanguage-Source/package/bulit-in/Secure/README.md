# NextLanguage Built-in: Secure Package
A package system, that allows automatic passthrough for NextLanguage's Plugin System in v2.0

# How it works
It allows NextLanguage Developers to create plugins for NextLanguage in v2.0 and above.

**Plugin Registrations**
This is an example of a code on how to register a plugin. In the ``BUILD_CONFIG`` file there should be a new registration section that allows users to register plugins.
The Secure Plugin which is defined by: <br>
```yaml
Secure @require(path.join(__dirname, '../../../../package/bulit-in/Secure/package.js'));
```
**SHOULD NOT BE REMOVED as of v2.0-dev**

The ``@require`` syntax is only avaliable for NextLanguage's Built-in packages. And any other packages not bulit-in should be using the ``@path: path/to/plugin`` syntax which is avaliable for all other plugins.
The main file which signs the plugin should be listed in ``@path``. The package signature path will need to be listed in ``@sign``

This is NextLanguage's built-in package that allows it to Check Plugin Signatures. Which is a way to register a signed package below:
```yaml
# Plugins registrations
PLUGINS: Secure @require(path.join(__dirname, '../../../../package/bulit-in/Secure/package.js')); @sign null
PLUGINS: Test @path: Custom/Plugin.js @sign Custom/Signed.config.js
```

**Signning Modules**

The functions and unknown modules in the code below, isn't required to be imported by the Plugin Developer, as NextLanguage will automatically pass through the required modules that the Signing file should ever need.
All the pass-through modules will be listed in the Pass-through section.

**Syntaxes**
The ``package.create(type, path, name)`` is the correct syntax for creating a package.
The ``path`` should be your Plugin's main code-file, not the file that is registered in ``BUILD_CONFIG``.

**Signature function exporting**
The function that is at the start of the file is required to be name ``Service()``.
And is required to be an ``module.exports = function Service() {}``. To allow Secure to read the signature of the plugin.

And the function should also be called on the same file that is signning the plugin.
No other function should be present within the signning module of the plugin.

**Signning Plugins**
As of right now, in v2.0-dev branch. This is actually just the Application to register an signed package.
What you're seeing below is an example testing code used for NextLanguage's v2.0 Plugin System.
This was a custom plugin which won't be included in the v2.0 patch, but we'll link it [here](https://github.com/nxoscloud/Custom).

```javascript
function Service() {
    // Registers the plugin
    const Custom = package.create('package', path.join(__dirname, '../../../../Custom/default.js'), 'Custom');

    // Enables the plugin
    Custom.config('package', 'Custom', 'enabled', true);

    // Returns if the plugin is enabled or not
    const enabled = Custom.strings.full.package.dev.self[1];

    // Additional Plugin Information
    Custom.config('package', 'Custom', 'author', 'Cassitydev');
    Custom.config('package', 'Custom', 'version', '0.1.0');
    Custom.config('package', 'Custom', 'repo', 'https://github.com/nxoscloud/Custom');
    Custom.config('package', 'Custom', 'description', '(Custom package for NextLanguage) A Custom testing package for NextLanguages v2.0-dev plugin system');

    // Optional Return value
    return Custom.strings
}
```

The signature function should be named ``Information()``. And the return value must be using the same format as the example below.
Examples of a signature value file:
```javascript
module.exports = function Information() {
    const Information = {
        name: 'Custom',
        author: 'Cassitydev',
        repo: 'https://github.com/nxoscloud/Custom',
        description: '(Custom package for NextLanguage) A Custom testing package for NextLanguages v2.0-dev plugin system',
        enabled: true,
        version: '0.1.0',
        license: null,
        app: 'A:\\NextLanguage\\Custom\\default.js'
    }
    
    return Information
}
```

**Pass-Through Modules**
Signning a plugin, while VSCode may list it as an unknown module, NextLanguage when ran, will automatically pass those modules onto the main file.
Here is a list of all the modules that will be passed from NextLanguage to the plugins:
```javascript
// External Node Modules
const path = require('path');
const fetch = require('fetch);

// Logging systems.
const addOutput = require('@NextLanguage/v2.0/modules/functions/addOutput.js');
const debugOutput = require('@NextLanguage/v2.0/modules/functions/debugOutput.js');

// Classes
const Local = require('@NextLanguage/v2.0/modules/class/temp/Local.js');
const Package = require('@NextLanguage/v2.0/modules/class/Packages.js');
    
const package = new Package;
const local = new Local;

// Session data
const { getVariables, setVariable } = require('@NextLanguage/v2.0/modules/functions/temp/Variables.js');
const { getFunctions, setFunction } = require('@NextLanguage/v2.0/modules/functions/temp/Functions.js');

// Preload Logic
const createPreload = require("@NextLanguage/v2.0/patches/v1.9/modules/nodejs/pre/createPreload.js");
const runPreload = require("@NextLanguage/v2.0/patches/v1.9/modules/nodejs/pre/runPreload.js");

// Postload Logic
const createPostload = require("@NextLanguage/v2.0/patches/v1.9/modules/nodejs/post/createPostload.js");
const runPostload = require("@NextLanguage/v2.0/patches/v1.9/modules/nodejs/post/runPostload.js");
```
