module.exports = class Debug {
    /**
     * @param {*} value
     * @description This constructor creates a new instance of the Debug class.
     * @returns {Debug} A new instance of the Debug class.
     * 
     * @example
     * const debug = new Debug(true);
     */
    constructor(value) {
        this.debugMode = false || value;

        return this.debugMode;
    }
}