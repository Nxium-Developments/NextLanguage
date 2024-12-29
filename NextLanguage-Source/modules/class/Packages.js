const addOutput = require('../functions/addOutput');
const debugOutput = require('../functions/debugOutput');

module.exports = class Packages {
        /**
         * Documentation on (constructor: Packages)
         * @param {string} packageType - The type of the package (folder/package/file)
         * @param {string} packagePath - The path of the package
         * @param {string} packageName - The name of the package
         *
         * @description This constructor creates a new instance of the Packages class.
         * @returns {Packages} A new instance of the Packages class.
         *
         * @example Unfinished
         * const myPackage = new Packages('folder', '/path/to/package', 'MyPackage');
         */
    constructor(packageType, packagePath, packageName) {
        // Sets the type, path, and name of the package
        this.type = packageType;
        this.path = packagePath;
        this.name = packageName;

        // Creates an constant variable for (type, path, name)
        const values = [this.type, this.path, this.name];

        /**
         * Documentation on (this.list)
         *
         * [0] Type
         * [1] Path
         * [2] Name
         * [3] Folder Data
         * [4] Package Data
         */

        // The default list where all the values are stored
        this.list = [this.type, this.path, this.name, null, null];

        // Extracts the type, path, name, folder data, and package data
        // from (this.list). IT WAS HURTING MY BRAIN OKAY?
        const type = this.list[0];
        const path = this.list[1];
        const name = this.list[2];
        const folders = this.list[3];
        const packages = this.list[4];

        // The default list where all the values are stored
        this.package = null;
        this.folder = null;
        this.file = null;


        // Package Information Values
        this.author = null;
        this.repository = null;
        this.description = null;
        this.version = null;
        this.license = null;
        this.application = null;
        this.packageInfo = name;

        /**
         * Documentation on (this.enabled)
         *
         * [0] Name
         * [1] Value
         */

        // Decides the item enable/disable values
        this.enabled = [name, null];

        if (type === 'package') {
            /**
             * Documentation on (this.package)
             *
             * [0] Name
             * [1] Enabled/Disabled
             * [2] Packages
             */

            // Main Package Values
            // (Basically tells that this is a package)
            this.package = [name, null];

            // Tells that this package needs to be executed
            // (Default: false)
            this.package[1] = false;

            // Sets the application path
            // (Default: null)
            this.application = path;

            // Adds the package to the Default List
            this.list[4] = [this.package[0], this.package[1]];
        } else if (type === 'file') {
            /**
             * Documentation on (this.file)
             *
             * [0] Name
             * [1] Path
             * [2] Enabled/Disabled
             */

            // Main File Values
            // (Basically tells that this is a file)
            this.file = [name, path, this.enabled[1]];

            // Tells that this file needs to be executed
            // (Default: false)
            this.file[2] = false;

            /**
             * Documentation on (Execute Entire Folder)
             *
             * [0] Name
             * [1] Path
             */

            // Adds the file to the Default List, and checks
            // if the file needs to be executed by the folder
            this.list[3] = [this.folder[0], this.file[1]];
        } else if (type === 'folder') {
            /**
             * Documentation on (this.folder)
             *
             * [0] Name
             * [1] Path
             * [2] Folder Contents
             * [3] Run/Don't Run
             */

            // Main Folder Values
            // (Basically tells that this is a folder)
            this.folder = [name, path, folders, this.enabled[1]];

            // Tells that this all the files inside
            // this folder needs to be executed.
            // (Default: false)
            this.folder[2] = false;
        }

        // Export and return the full string values for
        // (new Packages().toString())
        const strings = {
            small: {
                name: name,
                path: path,
                type: type,
                folders: folders,
                packages: packages,
            },
            full: {
                default: this.list,
                global: values,
                package: {
                    user: {
                        name: this.packageInfo,
                        author: this.author,
                        repo: this.repository,
                        description: this.description,
                        version: this.version,
                        license: this.license,
                        app: this.application,
                    },
                    dev: {
                        self: this.package,
                        global: packages,
                    }
                },
                folder: {
                    user: null,
                    dev: {
                        self: this.folder,
                        global: folders,
                    }
                },
                file: {
                    user: null,
                    dev: {
                        self: this.file,
                        global: null,
                    }
                }
            }
        };

        // Sets the full string values
        this.strings = strings;
    }

    // Creates a new package
    create(type, path, name) {
        return new Packages(type, path, name);
    }

    // Returns the full string values
    toString() {
        return this.strings;
    }

    config(type, name, param, value) {
        if (type === 'package') {
            if (name === this.name) {
                if (param === 'name') {
                    this.strings.full.package.user.name = value;
                }
                if (param === 'author') {
                    this.strings.full.package.user.author = value;
                }
                if (param === 'repo') {
                    this.strings.full.package.user.repo = value;
                }
                if (param === 'description') {
                    this.strings.full.package.user.description = value;
                }
                if (param === 'version') {
                    this.strings.full.package.user.version = value;
                }
                if (param === 'license') {
                    this.strings.full.package.user.license = value;
                }
                if (param === 'app') {
                    this.application = value;
                }
                if (param === 'enabled') {
                    this.package[1] = value;
    
                    // Executes the package if it is enabled
                    if (this.package[1] === true) {
                        debugOutput(`Enabled package: ${this.package[0]}`);
                        require(this.path);
                    } else {
                        debugOutput(`Disabled package: ${this.package[0]}`);
                        debugOutput(`Unable to enable package: ${this.package[0]} \n Package (${this.package[0]}) wasn't set to be enabled.`);
                    }
                }
            } else {
                debugOutput(`Unknown package: ${name}`);
            }
        } else {
            addOutput(`Unknown config type: ${type}`);
            addOutput(`To Note: This editor is for Packages only!`);
        }
    }

    getPackages(type, name) {
        if (type === 'package') {
            if (name === 'Secure') {
                return this.strings.full.package.dev.self;
            }

            return this.strings.full.package.dev.self;
        }
        if (type === 'folder') {
            return this.strings.full.folder.dev.self;
        }
        if (type === 'file') {
            return this.strings.full.file.dev.self;
        }
    }
}