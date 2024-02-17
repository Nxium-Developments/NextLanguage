// parser.js

const TOKEN_INTEGER = 'INTEGER';
const TOKEN_IDENTIFIER = 'IDENTIFIER';
const TOKEN_PLUS = 'PLUS';
const TOKEN_MINUS = 'MINUS';
const TOKEN_MULTIPLY = 'MULTIPLY';
const TOKEN_DIVIDE = 'DIVIDE';
const TOKEN_LPAREN = 'LPAREN';
const TOKEN_RPAREN = 'RPAREN';
const TOKEN_EQUALS = 'EQUALS';
const TOKEN_PRINT = 'PRINT';
const TOKEN_SEMICOLON = 'SEMICOLON';

function parse(tokens) {
    let currentTokenIndex = 0;

    function walk() {
        let token = tokens[currentTokenIndex];

        if (token.type === TOKEN_INTEGER) {
            currentTokenIndex++;
            return { type: 'NumberLiteral', value: token.value };
        }

        if (token.type === TOKEN_IDENTIFIER) {
            let node = { type: 'Identifier', name: token.value };
            currentTokenIndex++;
            return node;
        }

        if (token.type === TOKEN_PRINT) {
            currentTokenIndex++;
            let node = { type: 'PrintStatement', argument: walk() };
            if (tokens[currentTokenIndex].type !== TOKEN_SEMICOLON) {
                throw new Error('Expected semicolon after print statement');
            }
            currentTokenIndex++; // Skip the semicolon
            return node;
        }

        if (token.type === TOKEN_LPAREN) {
            currentTokenIndex++;
            let node = { type: 'BinaryExpression', operator: token.value, left: null, right: null };
            node.left = walk(); // Left operand
            currentTokenIndex++; // Skip the operator
            node.right = walk(); // Right operand
            currentTokenIndex++; // Skip the closing parenthesis
            return node;
        }

        throw new Error('Unexpected token: ' + token.type);
    }

    let ast = {
        type: 'Program',
        body: []
    };

    while (currentTokenIndex < tokens.length) {
        ast.body.push(walk());
    }

    return ast;
}

module.exports = parse;
