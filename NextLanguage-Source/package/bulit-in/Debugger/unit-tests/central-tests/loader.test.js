const fs = require('fs');
const loadAST = require('./loader.test');
jest.mock('fs');

describe('loadAST', () => {
    it('loads and parses a file into an AST', () => {
        const mockContent = ':packages main @main\n@output Hello, World!';
        fs.readFileSync.mockReturnValue(mockContent);

        const ast = loadAST('test.nxl');
        expect(ast).toEqual([
            { type: 'Packages', value: 'main' },
            { type: 'OutputStatement', value: 'Hello, World!', line: '@output Hello, World!' },
        ]);
    });

    it('throws an error for missing files', () => {
        fs.readFileSync.mockImplementation(() => {
            throw new Error('File not found');
        });

        expect(() => loadAST('missing.nxl')).toThrow('Failed to load AST from missing.nxl');
    });
});
