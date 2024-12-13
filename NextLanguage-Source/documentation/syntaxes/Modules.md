### Module Syntaxes

#### `@output`
- **Definition**: Outputs text or variable contents to the program’s output.
- **Syntax**: `@output <content>;`
- **Example**:
  ```
  @output Hello World;
  ```

#### `@if` Statement
- **Definition**: Implements conditional logic.
- **Syntax**:
  ```
  if [condition]: (
      # Code block if condition is true
  ) else (
      # Code block if condition is false
  );
  ```
- **Example**:
  ```
  @function [hello](tra): (
      if [tra === true]: (
          @output Hello;
      ) else (
          @output Else;
      );
  );

  :call [@function] /hello(true)@run;
  ```

#### `@function`
- **Definition**: Defines a function that can be executed later.
- **Syntax**:
  ```
  @function [name]: (
      # Function body
  );
  ```
- **Examples**:
  ```
  @function [say_abc]: (
      @output abc;
  );

  :call [@function] /say_abc@run;
  ```

#### `:call`
- **Definition**: Executes a variable or function.
- **Syntax**:
  ```
  :call [@variable]: /name@output;
  :call [@function] /name(arguments)@run;
  ```
- **Examples**:
  ```
  :call [@variable]: /negatives@output;
  :call [@function] /set_raining(false)@run;
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

