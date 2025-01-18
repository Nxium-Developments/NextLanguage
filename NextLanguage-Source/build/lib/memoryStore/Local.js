module.exports = class Local {
    /**
     * Documentation on (constructor: localPackages)
     *
     * @description This constructor creates a new instance of the localPackages class.
     * @returns {local} A new instance of the localPackages class.
     * 
     * @example
     * const myPackages = new localPackages();
     * myPackages.addCommand("hello");
     */
    constructor() {
        this.main = null;
        this.commands = [];
        this.advanced = false;
        this.packages = [];
        this.headers = []
    }

    // HEADERS
    addHeader(name, header) {
        this.headers.push(name, header);
    }

    // COMMANDS
    addCommand(command) {
        this.commands.push(command);
    }
    
    // OTHERS
    setMain(mainPackage) {
        this.main = mainPackage;
    }

    setAdvanced(advanced) {
        this.advanced = advanced;
    }

    // ADD PACKAGES
    addPackage(command) {
        this.packages.push(command);
    }
}