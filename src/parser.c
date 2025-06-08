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
        char var[64], expr[256];
        if (sscanf(line + 4, "%s = %[^\n]", var, expr) == 2) {
            if (strstr(expr, "add::") != NULL) {
                char left[64], right[64];
                if (sscanf(expr, "add::(%[^~] ~~ %[^)]", left, right) == 2) {
                    fprintf(out, "    int %s = %s + %s;\n", var, left, right);
                }
            } else if (strstr(expr, "alloc::int(") != NULL || strstr(expr, "mem::") != NULL) {
                // These are removed
                fprintf(out, "// [REMOVED] memory operations for %s\n", var);
            } else {
                fprintf(out, "    int %s = %s;\n", var, expr);
            }
        }
    } else if (strncmp(line, "print ", 6) == 0) {
        char expr[256];
        strcpy(expr, line + 6);
        expr[strcspn(expr, "\n")] = 0;

        if (expr[0] == '"') {
            expr[strlen(expr) - 1] = '\0';
            fprintf(out, "    printf(\"%%s\\n\", \"%s\");\n", expr + 1);
        } else {
            fprintf(out, "    printf(\"%%d\\n\", %s);\n", expr);
        }
    } else if (strstr(line, "mem::drop") != NULL || strstr(line, "ptr::deref") != NULL) {
        fprintf(out, "// [REMOVED] deprecated memory command: %s\n", line);
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
    
    // Loops
    else if (strncmp(trimmed_line, "for [", 5) == 0) {
        char init[128], cond[128], inc[128];

        // Extract what's between the brackets
        const char* start = strchr(trimmed_line, '[');
        const char* end = strrchr(trimmed_line, ']');

        if (start && end && end > start) {
            char loop_content[512];
            strncpy(loop_content, start + 1, end - start - 1);
            loop_content[end - start - 1] = '\0';

            // Tokenize the loop header into init; condition; increment
            char* token = strtok(loop_content, ";");
            if (token) strcpy(init, token); else init[0] = '\0';
            token = strtok(NULL, ";");
            if (token) strcpy(cond, token); else cond[0] = '\0';
            token = strtok(NULL, ";");
            if (token) strcpy(inc, token); else inc[0] = '\0';

            // Process init
            if (strncmp(init, "let ", 4) == 0) {
                char var[64], expr[256];
                if (sscanf(init + 4, "%s = new int = %s", var, expr) == 2) {
                    fprintf(out, "    for (int %s = %s; %s; %s) {\n", var, expr, cond, inc);
                } else {
                    fprintf(out, "    // Invalid for loop initializer: %s\n", init);
                }
            } else {
                fprintf(out, "    for (%s; %s; %s) {\n", init, cond, inc);
            }

            in_loop = true;
        } else {
            fprintf(out, "// Malformed for loop: %s\n", trimmed_line);
        }
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
            fprintf(out, "    }\n");
            fprintf(out, "// Loop processing ended.\n");
            return;
        }
        fprintf(out, "    // Processing loop body: %s\n", trimmed_line);
        parse_line_v2(trimmed_line, out);
    }

    else if (strncmp(trimmed_line, "let ", 4) == 0) {
        char var[64], expr[256];
        if (sscanf(trimmed_line + 4, "%s = %[^\n]", var, expr) == 2) {
            if (strncmp(expr, "new int = ", 10) == 0) {
                int val;
                sscanf(expr + 10, "%d", &val);
                fprintf(out, "    int %s = %d;\n", var, val);
            } else if (strncmp(expr, "new int", 7) == 0) {
                fprintf(out, "    int %s = 0;\n", var);
            } else if (strncmp(expr, "copy ", 5) == 0) {
                char source[64];
                sscanf(expr + 5, "%s", source);
                fprintf(out, "    int %s = %s;\n", var, source);
            } else if (strchr(expr, '+')) {
                char left[64], right[64];
                sscanf(expr, "%s + %s", left, right);
                fprintf(out, "    int %s = %s + %s;\n", var, left, right);
            } else if (expr[0] == '*') {
                char src[64];
                sscanf(expr + 1, "%s", src);
                fprintf(out, "    int %s = *%s;\n", var, src); // Optional: remove if pointers are removed completely
            } else {
                fprintf(out, "    int %s = %s;\n", var, expr);
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

    else {
        fprintf(out, "// Unrecognized line: %s\n", trimmed_line);
    }
}