#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "parser.h"
#include "codegen.h"
#include "./utils/updater.h"
#include "./utils/package.h"
#include "./img/imagery.h"

void print_help() {
    BuildInfo info;
    if (read_build_info(&info)) {
        printf("NextLanguage Compiler %s\n", info.build_version);
    } else {
        printf("Failed to retrieve build version info.\n\n");
        printf("NextLanguage Compiler (null)\n");
    }

    printf("Usage: nextlang [options] <source.extn|source.img>\n");
    printf("Options:\n");
    printf("  -o <file>        Output filename (default: output.exe)\n");
    printf("  --output <file>  Same as -o\n");
    printf("  --cc <compiler>  Compiler to use (default: gcc)\n");
    printf("  --cflags <flags> Extra flags to pass to compiler\n");
    printf("  --version        Show compiler version\n");
    printf("  --silent         Suppress non-error output\n");
    printf("  --check-updates  Checks for updates\n");
    printf("  --apply-updates  Apply updates\n");
    printf("  --skip-compile   Skip compilation\n");
}

int main(int argc, char* argv[]) {
    init_base_dir();
    set_exe_dir();

    if (argc < 2) {
        print_help();
        return 1;
    }

    char* infile = NULL;
    char* compile_type = NULL;
    char* outfile = "output.exe";
    char* compiler = "gcc";
    char* cflags = "";
    int silent = 0;
    int pull_updates = 0;
    int apply_updates = 0;
    int skip_compilation = 0;

    for (int i = 1; i < argc; i++) {
        if (strcmp(argv[i], "--version") == 0 || strcmp(argv[i], "--ver") == 0) {
            BuildInfo info;
            if (read_build_info(&info)) print_build_info(&info);
            return 0;
        } else if ((strcmp(argv[i], "-o") == 0 || strcmp(argv[i], "--output") == 0) && i + 1 < argc) {
            outfile = argv[++i];
        } else if (strcmp(argv[i], "--cc") == 0 && i + 1 < argc) {
            compiler = argv[++i];
        } else if (strcmp(argv[i], "--cflags") == 0 && i + 1 < argc) {
            cflags = argv[++i];
        } else if (strcmp(argv[i], "--silent") == 0) {
            silent = 1;
        }
        
        // Files to compile
        else if (strstr(argv[i], ".extn")) {
            infile = argv[i];
            compile_type = "extn";
        }

        else if (strstr(argv[i], ".img")) {
            infile = argv[i];
            compile_type = "img";
            outfile = "output.png";
        }

        // Skip compilation
        else if (strcmp(argv[i], "-sc") == 0 || strcmp(argv[i], "--skip-compile") == 0) {
            skip_compilation = 1;
        }

        // Apply updates
        else if (strcmp(argv[i], "-au") == 0 || strcmp(argv[i], "--apply-updates") == 0) {
            apply_updates = 1;
        }

        // Check for updates
        else if (strcmp(argv[i], "-cu") == 0 || strcmp(argv[i], "--check-updates") == 0) {
            pull_updates = 1;
        }

        // Debugging dev features
        else if (strcmp(argv[i], "--debug") == 0) {
            BuildInfo info; // Checks if config.json exists
            if (read_build_info(&info)) { // And if it's a dev build
                if (strcmp(info.release_type, "dev") != 0) {
                    printf("--debug is only available in dev builds\n");
                    return 0;
                }
            }

            if (i + 1 >= argc) {
                printf("Missing debug command after --debug\n");
                return 1;
            }

            // Debug commands
            char* args = argv[i + 1];
            if (strstr(args, "test-update") != NULL) {
                check_for_updates();
            }
            
            else {
                printf("Unknown debug command: %s\n", args);
                return 1;
            }
            
            i++; // Skip the debug command
        }

        else {
            if (!silent) printf("Unknown option: %s\n", argv[i]);
            return 1;
        }
    }

    // Run updater
    if (pull_updates) {
        check_for_updates(MODE_AUTO);
    }
    else if (silent) {
        check_for_updates(MODE_SILENT);
    }
    
    if (apply_updates) {
        apply_update();
        return 0;
    }

    if (!infile && !skip_compilation) {
        if (compile_type == NULL) {}
        if (!silent) printf("❌ Error: No source .%s file provided\n", compile_type);
        return 1;
    }

    if (compile_type == "extn") {
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

        if (!silent) printf("✅ C code generated in output.c\n");

        // Build compile command
        char cmd[512];
        snprintf(cmd, sizeof(cmd), "%s output.c -o \"%s\" %s", compiler, outfile, cflags);

        int status = system(cmd);
        if (status == 0) {
            if (!silent) printf("✅ Compiled successfully: %s\n", outfile);
        } else {
            if (!silent) printf("❌ Compilation failed\n");
        }

        return status;
    } else if (compile_type == "img") {
        Image* img = parse_image_file(infile);
        if (!img) {
            if (!silent) printf("❌ Error parsing image file\n");
            return 1;
        }
        write_image_png(img, outfile);
        free_image(img);
        return 0;
    }

    return 0;
}
