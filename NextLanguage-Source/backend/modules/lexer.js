// lexer.js

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

const INTEGER_PATTERN = /\d+/;
const IDENTIFIER_PATTERN = /[a-zA-Z_]\w*/;

function lex(inputString) {
    const tokens = [];
    let currentPos = 0;

    while (currentPos < inputString.length) {
        let char = inputString[currentPos];

        // Skip whitespace
        if (/\s/.test(char)) {
            currentPos++;
            continue;
        }

        // Match integers
        if (/\d/.test(char)) {
            const integerMatch = inputString.slice(currentPos).match(INTEGER_PATTERN);
            if (integerMatch) {
                tokens.push({ type: TOKEN_INTEGER, value: integerMatch[0] });
                currentPos += integerMatch[0].length;
                continue;
            }
        }

        // Match identifiers
        if (/[a-zA-Z_]/.test(char)) {
            const identifierMatch = inputString.slice(currentPos).match(IDENTIFIER_PATTERN);
            if (identifierMatch) {
                tokens.push({ type: TOKEN_IDENTIFIER, value: identifierMatch[0] });
                currentPos += identifierMatch[0].length;
                continue;
            }
        }

        // Match other single-character tokens
        switch (char) {
            case '+':
                tokens.push({ type: TOKEN_PLUS, value: char });
                break;
            case '-':
                tokens.push({ type: TOKEN_MINUS, value: char });
                break;
            case '*':
                tokens.push({ type: TOKEN_MULTIPLY, value: char });
                break;
            case '/':
                tokens.push({ type: TOKEN_DIVIDE, value: char });
                break;
            case '(':
                tokens.push({ type: TOKEN_LPAREN, value: char });
                break;
            case ')':
                tokens.push({ type: TOKEN_RPAREN, value: char });
                break;
            case '=':
                tokens.push({ type: TOKEN_EQUALS, value: char });
                break;
            case ';':
                tokens.push({ type: TOKEN_SEMICOLON, value: char });
                break;
            default:
                throw new Error('Invalid character: ' + char);
        }

        currentPos++;
    }

    return tokens;
}

module.exports = lex;
