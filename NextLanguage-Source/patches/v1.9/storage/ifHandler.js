const safeEval = require('../../../modules/safeEval');
const IfStatementHandler = require('../../../modules/IfStatementHandler');
const addOutput = require('../../../modules/addOutput');
const ifHandler = IfStatementHandler(addOutput, safeEval);

module.exports = ifHandler;