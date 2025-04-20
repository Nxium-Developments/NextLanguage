#include "parser.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

void init_parser(FILE* out) {
    fprintf(out, "#include <stdio.h>\n");
    fprintf(out, "#include <stdlib.h>\n");
    fprintf(out, "#include \"memory.h\"\n");
    fprintf(out, "\n");
    fprintf(out, "int* alloc_int(int val) {\n");
    fprintf(out, "    int* ptr = malloc(sizeof(int));\n");
    fprintf(out, "    *ptr = val;\n");
    fprintf(out, "    return ptr;\n");
    fprintf(out, "}\n\n");
    fprintf(out, "int main() {\n");
}

void finish_parser(FILE* out) {
    fprintf(out, "    return 0;\n}\n");
}

int is_identifier_char(char c) {
    return isalnum(c) || c == '_';
}

void parse_line(char* line, FILE* out) {
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

