const executeFunction = require('../../../modules/functions/executeFunction.js/executeFunction');
const runFunction = require('../../interpreter.js').run();

// Mock dependencies
jest.mock('./executeFunction', () => jest.fn());
const mockAddOutput = jest.fn();
const mockDebugOutput = jest.fn();

// Inject the mocks into the handler
global.addOutput = mockAddOutput;
global.debugOutput = mockDebugOutput;

describe('Function Handler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register and execute a function with :params directive', () => {
    const lines = [
      '@function [testFunction]',
      '[Inline code]',
      ':params',
      'param1: value1',
      ':end',
      '@end',
      '@run',
    ];
    const line = '@function [testFunction]';

    const functionMatch = { input: null, name: 'testFunction' };
    executeFunction.mockReturnValue({
      block: ':params\nparam1: value1\n:end',
      result: functionMatch,
    });

    // Call runFunction
    const result = runFunction(lines, line, functionMatch);

    // Assertions
    expect(executeFunction).toHaveBeenCalledWith(lines, line, functionMatch);
    expect(mockAddOutput).toHaveBeenCalledWith('param1: value1');
    expect(mockDebugOutput).toHaveBeenCalledWith('Function registered: testFunction');
    expect(result).toBe('testFunction');
  });

  it('should register and execute a function with :output directive', () => {
    const lines = [
      '@function [outputFunction]',
      '[Inline code]',
      ':output',
      'This is the output text.',
      ':end',
      '@end',
      '@run',
    ];
    const line = '@function [outputFunction]';

    const functionMatch = { input: null, name: 'outputFunction' };
    executeFunction.mockReturnValue({
      block: ':output\nThis is the output text.\n:end',
      result: functionMatch,
    });

    // Call runFunction
    const result = runFunction(lines, line, functionMatch);

    // Assertions
    expect(executeFunction).toHaveBeenCalledWith(lines, line, functionMatch);
    expect(mockAddOutput).toHaveBeenCalledWith('This is the output text.');
    expect(mockDebugOutput).toHaveBeenCalledWith('Function registered: outputFunction');
    expect(result).toBe('outputFunction');
  });

  it('should skip invalid @function lines', () => {
    const lines = [
      '@function [invalidFunction]',
      '[No valid content]',
      ':unknown',
      ':end',
      '@end',
    ];
    const line = '@function [invalidFunction]';

    const functionMatch = { input: null, name: 'invalidFunction' };
    executeFunction.mockReturnValue({
      block: ':unknown\n:end',
      result: functionMatch,
    });

    // Call runFunction
    const result = runFunction(lines, line, functionMatch);

    // Assertions
    expect(executeFunction).toHaveBeenCalledWith(lines, line, functionMatch);
    expect(mockAddOutput).not.toHaveBeenCalled(); // No valid output directive
    expect(mockDebugOutput).toHaveBeenCalledWith('Function registered: invalidFunction');
    expect(result).toBe('invalidFunction');
  });

  it('should throw an error when called without valid input', () => {
    const lines = [];
    const line = '@function [emptyFunction]';

    expect(() => runFunction(lines, line)).toThrow(); // Expected behavior for invalid input
  });
});
