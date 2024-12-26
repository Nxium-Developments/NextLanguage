const path = require('path');
const fs = require('fs');

const config = path.join(__dirname, '../../../CONFIG');
const preloadPath = path.join(__dirname, '../../../preload.js');
const postloadPath = path.join(__dirname, '../../../postload.js');

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
    # The @var command is used to create variables.
    @var [score]: (integer)10
    @var [percentage]: (percentage)11%

    @output -----------------------------------------------------------------
    @output
    @output This is a output function, it sends whatever is written in here
    @output before the next line and send it to the console, you don't really
    @output need a comma on this. Or any of the other functions never really
    @output needed a comma, so have fun!
    @output
    @output -----------------------------------------------------------------

    @function [hello]:
        :output This is a hello Function message. You are only seeing this
            message because the call function called this hello function

            A little note for you is that, only output commands are being
            registered within @function and @if block chains. So you can't
            really do alot here yet. But I'm working on adding more commands.
        :end
    @end

    @output

    @var [x]: (integer)11
    @var [usernames]: (string)Someone
    @var [negativity]: (negatives)-10
    @var [decimal]: (double)0.1

    # The @if command is used to create if statements. The bug related to @if not executing
    # the @else block is now fixed.

    @if [x > 10]:
        :output This is a if statement, if X is greater than 10. You will see this message!
    @else
        :output Sadly, you changed this value (x). So you couldn't see the message I wrote for you :d
    @end

    # The @output command can now output variables, as of the update to v1.9
    # The bug where @output command can only output variables once is also fixed!
    # Uncomment these to run them!
    # @output usernames

    # This a demonstration of the fix!
    # @output decimal
];`;

module.exports = { contents, config, preloadPath, postloadPath }