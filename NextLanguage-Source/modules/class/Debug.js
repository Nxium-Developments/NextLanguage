module.exports = class Debug {
    /**
     * @param {*} value
     * @description This constructor creates a new instance of the Debug class.
     * @returns {Debug} A new instance of the Debug class.
     * 
     * @example
     * const debug = new Debug(true);
     */
    constructor() {
        this.debugMode = true
    }

    setValue(value) {
        this.debugMode = value;
    }
}