### Module Syntaxes

#### `@output`
- **Definition**: Outputs text or variable contents to the program’s output.
- **Syntax**: `@output <content>;`
- **Example 1**:
  ```
  @output Hello World;
  ```
- **Example 2**:
  ```
  @var [username]: "abie";
  @output username;
  ```

#### `@if` Statement
- **Definition**: Implements conditional logic.
- **Syntax**:
  ```
  @if [condition]:
      # Code block if condition is true
  @else
      # Code block if condition is false
  @end
  ```
- **Example 1**:
  ```
  @var [x]: (integer)11
  @if [x > 10]
      @output x is greater than 10;
  @else
      @output x is less than 10;
  @end
  ```

- **Example 2**:
  ```
  @var [raining]: (boolean)true;

  @if [raining === true]:
      @output It's raining;
  @else
      @output It's not raining;
  @end
  ```

#### `@function`
- **Definition**: Defines a function that can be executed later.
- **Syntax**:
  ```
  @function [name]:
      # Function body
  @end
  ```
- **Examples**:
  ```
  @function [say_abc]:
      @output abc;
  @end
  ```

#### `:set`
- **Definition**: Assigns a value to a variable.
- **Syntax**:
  ```
  :set [@variable]: /name(value);
  ```
- **Example**:
  ```
  :set [@variable]: /raining(true);
  ```

