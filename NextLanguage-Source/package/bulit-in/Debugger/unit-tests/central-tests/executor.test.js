const centralExecutor = require('../../../../../modules/centralized/executor');
const addOutput = require('../../../../../build/lib/output/addOutput');
jest.mock('../../../../../build/lib/output/addOutput');

describe('centralExecutor', () => {
    it('processes OutputStatement nodes', async () => {
        const ast = [
            { type: 'OutputStatement', value: 'Hello, World!' },
        ];
        await centralExecutor(ast);
        expect(addOutput).toHaveBeenCalledWith('Hello, World!');
    });

    it('processes Variable nodes', async () => {
        const ast = [
            { type: 'Variable', name: 'x', value: 10 },
            { type: 'OutputStatement', value: 'x' },
        ];
        await centralExecutor(ast);
        expect(addOutput).toHaveBeenCalledWith(10);
    });

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

    it('handles errors gracefully', async () => {
        const ast = [{ type: 'UnknownType', value: 'test' }];
    
        await centralExecutor(ast);
    
        expect(addOutput).toHaveBeenCalledWith(
            expect.stringContaining('Error processing node')
        );
    });
        
    it('handles errors gracefully', async () => {
        const ast = [{ type: 'UnknownType', value: 'test' }];
    
        await centralExecutor(ast);
    
        expect(addOutput).toHaveBeenCalledWith(
            expect.stringContaining('Error processing node')
        );
    });   

    it('handles errors gracefully', async () => {
        const ast = [{ type: 'UnknownType', value: 'test' }];
    
        await centralExecutor(ast);
    
        expect(addOutput).toHaveBeenCalledWith(
            expect.stringContaining('Unknown node type')
        );
    });
});
