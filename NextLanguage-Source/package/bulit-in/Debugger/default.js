const { startDebug } = require('./package');

module.exports = class enableDevelopment {
    constructor(active, run) {
        if (!active) return false;

        if (active === 'all') {
            this.run = run;
            startDebug('./normal-tests/outputVariables.debug', this.run);
            startDebug('./normal-tests/functionState.debug', this.run);
        }

        if (active === 'debug-output') {
            this.run = run;
            startDebug('./normal-tests/outputVariables.debug', this.run);
        }

        if (active === 'function-state') {
            this.run = run;
            startDebug('./normal-tests/functionState.debug', this.run);
        }
        
    }
}