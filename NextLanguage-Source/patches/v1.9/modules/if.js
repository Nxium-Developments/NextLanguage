module.exports = function ifCommand(line, lines, ifHandler) {
    if (line.startsWith("@if")) {                 
        // Refer to modules/IfStatementHandler.js
        ifHandler.parseIfStatement(line, lines);
      }
}