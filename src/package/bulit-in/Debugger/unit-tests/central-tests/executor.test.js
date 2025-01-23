const centralExecutor = require('../../../../../modules/centralized/executor');
const evaluateCondition = require('../../../../../modules/centralized/evaluater');
const addOutput = require('../../../../../build/lib/output/addOutput');

jest.mock('../../../../../build/lib/output/addOutput');
jest.mock('../../../../../modules/centralized/evaluater');

describe('centralExecutor', () => {
    // Test the Output Statement
    it('processes OutputStatement nodes', async () => {
        const ast = [
            { type: 'OutputStatement', value: 'Hello, World!' },
        ];
        await centralExecutor(ast);
        expect(addOutput).toHaveBeenCalledWith('Hello, World!');
    });

    // Test the Variable
    it('processes Variable nodes', async () => {
        const ast = [
            { type: 'Variable', name: 'x', value: 10 },
            { type: 'OutputStatement', value: 'x' },
        ];
        await centralExecutor(ast);
        expect(addOutput).toHaveBeenCalledWith(10);
    });

    // Test the Function defintion and function calls
    it('handles Function definitions and calls', async () => {
        const ast = [
            { type: 'Function', name: 'testFunction' },
            { type: 'OutputStatement', value: 'Inside function' },
            { type: 'EndStatement' },
            { type: 'Call', param: 'testFunction' },
        ];
        await centralExecutor(ast);
        expect(addOutput).toHaveBeenCalledWith('Inside function');
    });

    // Tests unknown node types
    it('handles errors gracefully', async () => {
        const ast = [{ type: 'UnknownType', value: 'test' }];
    
        await centralExecutor(ast);
    
        expect(addOutput).toHaveBeenCalledWith(
            expect.stringContaining('Error processing node')
        );
    });

    it('handles while loops', async () => {
        const ast = [
            { type: 'Variable', name: 'x', param: 'integer', value: 10 },
            {
                type: 'WhileLoop',
                condition: 'x === 10',
                body: [
                    { type: 'OutputStatement', value: 'Hello, World!' },
                    { type: 'Variable', name: 'x', param: 'integer', value: 5 }, // Modify the variable to break the loop
                ],
            },
        ];

        await centralExecutor(ast);
    
        // Check that the loop executed and outputted the expected value
        expect(addOutput).toHaveBeenCalledWith('Hello, World!');
    });
});
