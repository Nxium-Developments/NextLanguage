### Main Packaging Syntaxes

#### `:package-main`
- **Definition**: Indicates the main file of the program.
- **Syntax**: `:package-main root/me;`
  - `root/me`: Designates `/me` as the main file.
- **Examples**:
  ```
  :package-main root/me;
  # This tells the program that this is the main file and must always be at the top of the file.

  :package-main root/whatever_folder/alternatefile.package;
  # If the file is not the main file, use `.package` to indicate it as a secondary file to be executed along with the main.
  ```

#### `:package-com`
- **Definition**: Specifies execution commands within `:packaged` blocks.
- **Syntax**: `:package-com x-auto;`
  - `x-auto`: Automatically executes all commands within the `:packaged` block.
- **Example**:
  ```
  :package-com x-auto;
  ```

#### `:package-advanced`
- **Definition**: Specifies whether to execute advanced code languages.
- **Syntax**: `:package-advanced true;`
  - Argument: `true` or `false`
- **Example**:
  ```
  :package-advanced true; # Enables advanced code execution.
  ```

#### `:packaged`
- **Definition**: Contains the block of advanced code to be executed.
- **Syntax**:
  ```
  :packaged [
      # Code block here
  ];
  ```
- **Example**:
  ```
  :packaged [
      @output Hello World;
  ];
  ```