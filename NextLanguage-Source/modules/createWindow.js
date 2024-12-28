module.exports = function createWindow(line, addOutput, command, args, name, windows, createWindowsProcess, electronWindow) {
    // Handle create commands, and its params
    if (command.startsWith("create")) {
        if (args.startsWith("default")) {
            createWindowsProcess(name, "false", 800, 600, "./index.html")
            addOutput(windows[name])
        }
    }

    // Handle select commands, and its params
    if (command.startsWith("select")) {
        if (args.startsWith("default")) {
            addOutput("Currently this is not implemented.")
            addOutput("Running a window inside NXL is not yet implemented.")

            // Creating an electron window within a nodejs setup
            // is currently impossible.
            // electronWindow(filePath, width, height);
        }

        if (args.startsWith("run")) {
            addOutput("Currently this is not implemented.")
        
        }

        if (args.startsWith("edit")) {
            addOutput("Currently this is not implemented.")
        }
    }
}