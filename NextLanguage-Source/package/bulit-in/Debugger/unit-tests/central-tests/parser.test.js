const centralParse = require('../../../../../modules/centralized/parser');

describe('centralParse', () => {
    it('parses valid lines into AST nodes', () => {
        const lines = [
            ':packages main @main',
            '@var [x]: (integer)10',
            '@function [testFunction]:',
            '@output Hello, World!',
            '@end',
        ];
        const ast = centralParse(lines);
        expect(ast).toEqual([
            { type: 'Packages', value: 'main' },
            { type: 'Variable', name: 'x', param: 'integer', value: '10' },
            { type: 'Function', name: 'testFunction', body: [] },
            { type: 'OutputStatement', value: 'Hello, World!', line: '@output Hello, World!' },
            { type: 'EndStatement' },
        ]);
    });

    it('ignores comments and empty lines', () => {
        const lines = [
            '# This is a comment',
            '',
            '@output Hello!',
        ];
        const ast = centralParse(lines);
        expect(ast).toEqual([
            { type: 'OutputStatement', value: 'Hello!', line: '@output Hello!' },
        ]);
    });
});
