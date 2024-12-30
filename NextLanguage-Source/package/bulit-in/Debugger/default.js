const { startDebug } = require('./package');

module.exports = class enableDevelopment {
    constructor(active) {
        if (active === 'all') {
            this.run = true;
            startDebug('./function/outputVariables.debug', this.run);
            startDebug('./function/ifCommand.debug', this.run);
            startDebug('./function/functionState.debug', this.run);
            startDebug('./function/startupClasses.debug', this.run);
            startDebug('./function/oneFunction.debug', this.run);
            startDebug('./function/packageMain.debug', this.run);
        }
        
    }
}