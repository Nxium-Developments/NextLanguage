const executeFunction = require('../../../../modules/functions/executeFunction.js');
const runFunction = require('../../../../modules/functions/runFunction.js');

// Mock dependencies
jest.mock('../../../../modules/functions/executeFunction.js', () => jest.fn());
const mockAddOutput = jest.fn();
const mockDebugOutput = jest.fn();

// Inject the mocks into the handler
global.addOutput = mockAddOutput;
global.debugOutput = mockDebugOutput;

describe('Function Handler with Correct Syntax', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle a two-line output function', () => {
    const lines = [
      '@function [twoline]:',
      ':output first line',
      '    second line',
      ':end',
      '@end',
    ];
    const line = '@function [twoline]:';

    const functionMatch = { input: null, name: 'twoline' };
    executeFunction.mockReturnValue({
      block: ':output first line\n    second line\n:end',
      result: functionMatch,
    });

    // Call runFunction
    const result = runFunction(lines, line, functionMatch);

    // Assertions
    expect(mockAddOutput).toHaveBeenCalledWith('first line\nsecond line');
    expect(result).toBe('twoline');
  });

  it('should handle a single-line output function', () => {
    const lines = [
      '@function [oneline]:',
      ':output one line',
      '@end',
    ];
    const line = '@function [oneline]:';

    const functionMatch = { input: null, name: 'oneline' };
    executeFunction.mockReturnValue({
      block: ':output one line',
      result: functionMatch,
    });

    // Call runFunction
    const result = runFunction(lines, line, functionMatch);

    // Assertions
    expect(mockAddOutput).toHaveBeenCalledWith('one line');
    expect(result).toBe('oneline');
  });

  it('should handle multiple output directives across multiple lines', () => {
    const lines = [
      '@function [number10]:',
      ':output line 1',
      ':output line 2',
      '',
      ':output line 3',
      '    line 4',
      ':end',
      '@end',
    ];
    const line = '@function [number10]:';

    const functionMatch = { input: null, name: 'number10' };
    executeFunction.mockReturnValue({
      block: ':output line 1\n:output line 2\n\n:output line 3\n    line 4\n:end',
      result: functionMatch,
    });

    // Call runFunction
    const result = runFunction(lines, line, functionMatch);

    // Assertions
    expect(mockAddOutput).toHaveBeenCalledWith('line 1');
    expect(mockAddOutput).toHaveBeenCalledWith('line 2');
    expect(mockAddOutput).toHaveBeenCalledWith('line 3\nline 4');
    expect(result).toBe('number10');
  });

  it('should handle a simple function with a numeric name', () => {
    const lines = [
      '@function [1]',
      ':output 1',
      '@end',
    ];
    const line = '@function [1]';

    const functionMatch = { input: null, name: '1' };
    executeFunction.mockReturnValue({
      block: ':output 1',
      result: functionMatch,
    });

    // Call runFunction
    const result = runFunction(lines, line, functionMatch);

    // Assertions
    expect(mockAddOutput).toHaveBeenCalledWith('1');
    expect(result).toBe('1');
  });
});
