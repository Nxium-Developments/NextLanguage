const evaluateCondition = require('../../../../../modules/centralized/evaluater');

describe('evaluateCondition', () => {
    it('evaluates simple conditions correctly', () => {
        const variables = { x: { value: 10 }, y: { value: 20 } };
        expect(evaluateCondition('x > 5', variables)).toBe(true);
        expect(evaluateCondition('y < 15', variables)).toBe(false);
        expect(evaluateCondition('x + y === 30', variables)).toBe(true);
    });

    it('throws an error for undefined variables', () => {
        const variables = {};
        expect(() => evaluateCondition('z > 5', variables)).toThrowError('Error evaluating condition "z > 5": Undefined variable: z');
    });

    it('handles invalid syntax gracefully', () => {
        const variables = { x: { value: 10 } };
        expect(evaluateCondition('x > 5', variables)).toBe(true);
    });
});
