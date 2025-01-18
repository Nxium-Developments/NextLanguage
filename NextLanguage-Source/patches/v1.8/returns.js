const path = require('path');

const config = path.join(__dirname, '../../../main.config.file');
const Local = require('../../build/lib/memoryStore/Local.js');
const packages = new Local();

const contents = `# This is a comment, anything you write in this wont be executed.

# This is an import command. You can import functions like the function
# sayCommand, you will need to specifiy the path.

# Anything that is not a function in the file will also be executed.

# If you want, you can just put null on the function you want to import
# and turn the command into a require command, which will execute everything
# in the file provided.

# :packages sayCommand @import your/path

# The @var command is used to create variables.
@var [score]: (integer)10
@var [health]: (percentage)11%
@var [coordinates]: (double)0l.21
@var [username]: (string)Sam
@var [death]: (boolean)true
@var [friendship]: (negatives)-12

@output This is an Output function!

@function [hello]:
    @output Hello, this is an function. It can be called with an @call command!
@end

# This calls the hello function!
@call :function[hello]

# This is an if function.
@if [death === true]:
    @output Oh no! Sam died
@else
    @output Yay, sam survived.
@end

# This outputs the value in the friendship variable
@output friendship`

function returns() { 
    return {
        template: { 
            indexFile: contents
        }, 
        path: {
            config: config,
        }
    }
};

module.exports = { returns, packages }