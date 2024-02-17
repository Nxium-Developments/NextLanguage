// main.js

const fs = require('fs');
const lex = require('../modules/lexer');
const parse = require('../modules/parser');

// const fileName = ('../build.json');;

// fs.readFile(fileName, 'utf8', (err, data) => {
//    if (err) throw err;
//
//    const databases= JSON.parse(data);
//
//    //databases.forEach(db=>{
//    console.log(databases);
    //});
    //console.log(databases);
// });

// Read input from file
const inputFile = '../index.nxl';
fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // Tokenize and parse input
    const tokens = lex(data);
    const ast = parse(tokens);
    console.log(JSON.stringify(ast, null, 2)); // Print the AST
});
