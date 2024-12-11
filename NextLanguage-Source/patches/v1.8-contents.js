const contents = `# This is a comment, anything you write in this wont be executed.
# The commands below me are what initializes the file structure.
# Currently :package-main does not have a functionality, but it is
# there for the future when I add multi-file support.

# :package-com is an level setting, x-auto means that the code will
# run at an advanced level, which will allow us the execute the code
# structures in :packaged []; and if it is set to auto, it will Currently
# not work, as the beginner level coding is in progess.

:package-main root/me
:package-com x-auto

# The :packaged []; will execute whatever codes inside it. If any code
# is placed outside it, it may not work.
:packaged [
    @output -----------------------------------------------------------------
    @output This is a output function, it sends whatever is written in here
    @output before the next line and send it to the console, you don't really
    @output need a comma on this. Or any of the other functions never really
    @output needed a comma, so have fun!
    @output -----------------------------------------------------------------

    @function [hello]: (
        @output Hello world
    );

    # The :call command is the only way to call functions and output variables
    # values to the console (Rn the variables output isn't working, just ignore that)
    :call [@function] /hello@run;
];`

module.exports = contents