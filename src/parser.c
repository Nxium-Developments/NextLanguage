#include "parser.h"
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <ctype.h>

void init_parser(FILE* out) {
    fprintf(out, "#include <stdio.h>\n");
    fprintf(out, "#include <stdlib.h>\n\n");

    // Inline memory system
    fprintf(out, "typedef struct MemoryBlock {\n");
    fprintf(out, "    void* ptr;\n");
    fprintf(out, "    struct MemoryBlock* next;\n");
    fprintf(out, "} MemoryBlock;\n\n");

    fprintf(out, "MemoryBlock* memory_list = NULL;\n\n");

    fprintf(out, "int* alloc_int(int value) {\n");
    fprintf(out, "    int* ptr = malloc(sizeof(int));\n");
    fprintf(out, "    if (!ptr) { printf(\"Memory allocation failed!\\n\"); exit(1); }\n");
    fprintf(out, "    *ptr = value;\n");
    fprintf(out, "    MemoryBlock* block = malloc(sizeof(MemoryBlock));\n");
    fprintf(out, "    block->ptr = ptr;\n");
    fprintf(out, "    block->next = memory_list;\n");
    fprintf(out, "    memory_list = block;\n");
    fprintf(out, "    return ptr;\n");
    fprintf(out, "}\n\n");

    fprintf(out, "void free_int(int* ptr) {\n");
    fprintf(out, "    if (!ptr) return;\n");
    fprintf(out, "    MemoryBlock* prev = NULL;\n");
    fprintf(out, "    MemoryBlock* current = memory_list;\n");
    fprintf(out, "    while (current != NULL) {\n");
    fprintf(out, "        if (current->ptr == ptr) {\n");
    fprintf(out, "            if (prev) prev->next = current->next;\n");
    fprintf(out, "            else memory_list = current->next;\n");
    fprintf(out, "            free(ptr);\n");
    fprintf(out, "            free(current);\n");
    fprintf(out, "            return;\n");
    fprintf(out, "        }\n");
    fprintf(out, "        prev = current;\n");
    fprintf(out, "        current = current->next;\n");
    fprintf(out, "    }\n");
    fprintf(out, "    printf(\"Attempted to free untracked memory!\\n\");\n");
    fprintf(out, "    exit(1);\n");
    fprintf(out, "}\n\n");

    fprintf(out, "void free_all() {\n");
    fprintf(out, "    MemoryBlock* current = memory_list;\n");
    fprintf(out, "    while (current != NULL) {\n");
    fprintf(out, "        free(current->ptr);\n");
    fprintf(out, "        MemoryBlock* temp = current;\n");
    fprintf(out, "        current = current->next;\n");
    fprintf(out, "        free(temp);\n");
    fprintf(out, "    }\n");
    fprintf(out, "    memory_list = NULL;\n");
    fprintf(out, "}\n\n");

    // Start of main()
    fprintf(out, "int main() {\n");
}

void finish_parser(FILE* out) {
    fprintf(out, "    return 0;\n}\n");
}

int is_identifier_char(char c) {
    return isalnum(c) || c == '_';
}

void parse_line_v1(char* line, FILE* out) {
    fprintf(out, "\n\n\n/**========================================================================\n");
    fprintf(out, " * |                         [DEPRECATION WARNING]                        |\n");
    fprintf(out, " * | This version (v1-original) of the parser system in NextLanguage v2.0 |\n");
    fprintf(out, " * | is discontinued, and further support will be dropped. A few (3-5)    |\n");
    fprintf(out, " * | months later, after the full release of v2.0 of NextLanguage.        |\n");
    fprintf(out, " * | Rewritten to use C++. A javascript version of NextLanguage v2.0 will |\n");
    fprintf(out, " * | still be maintained. And may drop support a few (6-8) months later   |\n");
    fprintf(out, " * |                           in 2026 or 2027.                           |\n");
    fprintf(out, " * ========================================================================\n");
    fprintf(out, " *   Last edited instance of this (v1) parser: 06/6/2025 - 15:57 (3:57PM)\n");
    fprintf(out, " * ========================================================================\n");
    fprintf(out, "*/\n\n\n");

    // Send deprecation warning
    fprintf(out, "  printf('[Deprecated Version] This version of the parser is unsupported and will be left to be discontinued.');\n");
    
    if (strncmp(line, "let ", 4) == 0) {
        // Handle variable declarations
        char var[64], expr[256];
        if (sscanf(line + 4, "%s = %[^\n]", var, expr) == 2) {
            if (strstr(expr, "alloc::int") != NULL) {
                // Handle alloc::int syntax
                int value;
                sscanf(expr, "alloc::int(%d)", &value);
                fprintf(out, "    int* %s = alloc_int(%d);\n", var, value);
            } else if (strstr(expr, "add::") != NULL) {
                // Handle add::(x ~~ y) syntax
                char left[64], right[64];
                // Use %[^)] to capture the contents until the closing parenthesis
                if (sscanf(expr, "add::(%[^~] ~~ %[^)]", left, right) == 2) {
                    fprintf(out, "    int* %s = alloc_int(*%s + *%s);\n", var, left, right);
                }
            } else if (strstr(expr, "mem::box<i>") != NULL) {
                int val;
                sscanf(expr, "mem::box<i>(%d)", &val);
                fprintf(out, "    int* %s = alloc_int(%d);\n", var, val);
            } else if (strstr(expr, "mem::void::<i>()") != NULL) {
                fprintf(out, "    int* %s = NULL;\n", var);
            } else if (strstr(expr, "mem::fork::<i>(") != NULL) {
                char source[64];
                sscanf(expr, "mem::fork::<i>(%[^)])", source);
                fprintf(out, "    int* %s = alloc_int(*%s);\n", var, source);
            }

        }
    } else if (strncmp(line, "print ", 6) == 0) {
        // Handle print statement
        char expr[256];
        strcpy(expr, line + 6);

        // Remove newline
        expr[strcspn(expr, "\n")] = 0;

        // If it's a string in quotes
        if (expr[0] == '"') {
            expr[strlen(expr) - 1] = '\0'; // remove trailing quote
            fprintf(out, "    printf(\"%%s\\n\", \"%s\");\n", expr + 1);
        } else {
            fprintf(out, "    printf(\"%%d\\n\", %s);\n", expr);
        }
    } else

    // Handle drop
    if (strstr(line, "mem::drop::<i>(") != NULL) {
        char var[64];
        sscanf(line, "mem::drop::<i>(%[^)])", var);
        fprintf(out, "    free(%s);\n", var);
    } else

    // Handle deref assign: ptr::deref::<mut>(x) <- 5
    if (strstr(line, "ptr::deref::<mut>(") != NULL && strstr(line, "<-") != NULL) {
        char var[64];
        int value;
        sscanf(line, "ptr::deref::<mut>(%[^)]) <- %d", var, &value);
        fprintf(out, "    *%s = %d;\n", var, value);
    }
}

void parse_line_v2(char* line, FILE* out) {
    static bool in_function = false; // Keeps track if we're inside a function
    static bool in_loop = false;     // Keeps track if we're inside a loop

    // Trim leading and trailing whitespace
    char* trimmed_line = line;
    while (isspace((unsigned char)*trimmed_line)) trimmed_line++;
    size_t len = strlen(trimmed_line);
    while (len > 0 && isspace((unsigned char)trimmed_line[len - 1])) len--;
    trimmed_line[len] = '\0';

    if (strncmp(trimmed_line, "function ", 9) == 0) {
        char name[64];
        sscanf(trimmed_line + 9, "%s", name);
        size_t name_length = strlen(name);

        if (strncmp(trimmed_line + 9 + name_length + 1, "continue ", 9) == 0) {
            fprintf(out, "    // Handling continue logic for function %s\n", name);
            in_function = true;
            parse_line_v2(trimmed_line, out);
        } else if (strncmp(trimmed_line + 9 + name_length + 1, "exec ", 5) == 0) {
            // Not implemented.
        }
    }
    else if (in_function) {
        if (strncmp(trimmed_line, "end", 3) == 0 || trimmed_line[0] == '}') {
            in_function = false;
            fprintf(out, "// Function processing ended.\n");
            return;
        }
        fprintf(out, "// Processing function body: %s\n", trimmed_line);
        parse_line_v2(trimmed_line, out);
    }
    else if (strncmp(trimmed_line, "for ", 4) == 0) {
        char condition[256];
        if (sscanf(trimmed_line + 4, "[%s] ", condition) == 2) {
            if (strncmp(condition, "if ", 3) == 0) {
                char value_1[64];
                char value_2[64];
                char expression[12];
                sscanf(condition + 3, "%s %s %s", value_1, expression, value_2);
            }
        }
    }
    else if (strncmp(trimmed_line, "let ", 4) == 0) {
        char var[64], expr[256];
        if (sscanf(trimmed_line + 4, "%s = %[^\n]", var, expr) == 2) {
            if (strncmp(expr, "new int = ", 10) == 0) {
                int val;
                sscanf(expr + 10, "%d", &val);
                fprintf(out, "    int* %s = alloc_int(%d);\n", var, val);
            }
            else if (strncmp(expr, "new int", 7) == 0) {
                fprintf(out, "    int* %s = NULL;\n", var);
            }
            else if (strncmp(expr, "copy ", 5) == 0) {
                char source[64];
                sscanf(expr + 5, "%s", source);
                fprintf(out, "    int* %s = alloc_int(*%s);\n", var, source);
            }
            else if (strchr(expr, '+')) {
                char left[64], right[64];
                sscanf(expr, "%s + %s", left, right);
                fprintf(out, "    int* %s = alloc_int(*%s + *%s);\n", var, left, right);
            }
            else if (strncmp(expr, "*", 1) == 0) {
                char src[64];
                sscanf(expr + 1, "%s", src);
                fprintf(out, "    int %s = *%s;\n", var, src);
            }
        }
    }
    else if (strncmp(trimmed_line, "print ", 6) == 0) {
        char expr[256];
        strcpy(expr, trimmed_line + 6);
        expr[strcspn(expr, "\n")] = 0;

        if (expr[0] == '"') {
            expr[strlen(expr) - 1] = '\0';
            fprintf(out, "    printf(\"%%s\\n\", \"%s\");\n", expr + 1);
        } else {
            fprintf(out, "    printf(\"%%d\\n\", %s);\n", expr);
        }
    }
    else if (strncmp(trimmed_line, "drop ", 5) == 0) {
        char var[64];
        sscanf(trimmed_line + 5, "%s", var);
        fprintf(out, "    free(%s);\n", var);
    }
    else if (trimmed_line[0] == '*' && strstr(trimmed_line, "=")) {
        char var[64];
        int value;
        sscanf(trimmed_line, "*%s = %d", var, &value);
        fprintf(out, "    *%s = %d;\n", var, value);
    }
    else if (strncmp(trimmed_line, "while ", 6) == 0) {
        char condition[256];
        if (sscanf(trimmed_line + 6, "[%s] ", condition) == 2) {
            fprintf(out, "    while (%s) {\n", condition);
            in_loop = true;
            parse_line_v2(trimmed_line, out);
        }
    }
    else if (in_loop) {
        if (strncmp(trimmed_line, "end", 3) == 0 || trimmed_line[0] == '}') {
            in_loop = false;
            fprintf(out, "// Loop processing ended.\n");
            return;
        }
        fprintf(out, "// Processing loop body: %s\n", trimmed_line);
        parse_line_v2(trimmed_line, out);
    }
    else {
        fprintf(out, "// Unrecognized line: %s\n", trimmed_line);
    }
}