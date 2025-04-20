#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "parser.h"
#include "codegen.h"

void print_help() {
    printf("NextLanguage Compiler v0.1\n");
    printf("Usage: nextlang [options] <source.extn>\n");
    printf("Options:\n");
    printf("  -o <file>        Output filename (default: output.exe)\n");
    printf("  --output <file>  Same as -o\n");
    printf("  --cc <compiler>  Compiler to use (default: gcc)\n");
    printf("  --cflags <flags> Extra flags to pass to compiler\n");
    printf("  --version        Show compiler version\n");
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        print_help();
        return 1;
    }

    char* infile = NULL;
    char* outfile = "output.exe";
    char* compiler = "gcc";
    char* cflags = "";

    for (int i = 1; i < argc; i++) {
        if (strcmp(argv[i], "--version") == 0) {
            printf("NextLanguage Compiler v0.1\n");
            return 0;
        } else if ((strcmp(argv[i], "-o") == 0 || strcmp(argv[i], "--output") == 0) && i + 1 < argc) {
            outfile = argv[++i];
        } else if (strcmp(argv[i], "--cc") == 0 && i + 1 < argc) {
            compiler = argv[++i];
        } else if (strcmp(argv[i], "--cflags") == 0 && i + 1 < argc) {
            cflags = argv[++i];
        } else if (strstr(argv[i], ".extn")) {
            infile = argv[i];
        } else {
            printf("Unknown option: %s\n", argv[i]);
            return 1;
        }
    }

    if (!infile) {
        printf("❌ Error: No source .extn file provided\n");
        return 1;
    }

    FILE* source = fopen(infile, "r");
    if (!source) {
        perror("Error opening .extn file");
        return 1;
    }

    FILE* cfile = fopen("output.c", "w");
    if (!cfile) {
        perror("Error creating output.c");
        fclose(source);
        return 1;
    }

    generate_c_code(source, cfile);

    fclose(source);
    fclose(cfile);

    printf("✅ C code generated in output.c\n");

    // Build compile command
    char cmd[512];
    snprintf(cmd, sizeof(cmd), "%s output.c src/memory.c -o \"%s\" %s", compiler, outfile, cflags);

    int status = system(cmd);
    if (status == 0)
        printf("✅ Compiled successfully: %s\n", outfile);
    else
        printf("❌ Compilation failed\n");

    return 0;
}
