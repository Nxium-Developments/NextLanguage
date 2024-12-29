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
    }

    addCommand(command) {
        this.commands.push(command);
    }

    removeCommand(command) {
        this.commands = this.commands.filter(c => c !== command);
    }
    
    setMain(mainPackage) {
        this.main = mainPackage;
    }

    setAdvanced(advanced) {
        this.advanced = advanced;
    }
}