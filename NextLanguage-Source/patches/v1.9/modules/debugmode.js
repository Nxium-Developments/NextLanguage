module.exports = function debugMode(line, addOutput) {
    // Depreated debug mode
    if (line.startsWith(":debug-mode")) {
        const match = line.match(/:debug-mode (.+)/);
        if (match) {
          //   debug = main.toLowerCase() === "on";
          //   addOutput(`Debug mode ${debug ? "enabled" : "disabled"}.`);
          //   if (main.toLowerCase() === "on") {
          //       setPackageDebugMode(debug);
          //   }

          addOutput(`Debug mode ${match[1].toLowerCase() === "on" ? "is deprecated" : "is no longer supported"}.`);
        }
      }
}