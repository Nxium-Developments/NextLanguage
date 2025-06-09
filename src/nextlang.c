#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "parser.h"
#include "codegen.h"
#include "./utils/updater.h"
#include "./utils/package.h"
#include "./img/imagery.h"
#include "./utils/download.h"

char base_dir[1024];

// Get directory of current executable
void get_executable_path() {
#ifdef _WIN32
    char path[MAX_PATH];
    GetModuleFileNameA(NULL, path, MAX_PATH);
    char *last_slash = strrchr(path, '\\');
    if (last_slash) *last_slash = '\0';
    strcpy(base_dir, path);
#else
    char path[PATH_MAX];
    ssize_t count = readlink("/proc/self/exe", path, PATH_MAX);
    if (count != -1) {
        path[count] = '\0';
        char *last_slash = strrchr(path, '/');
        if (last_slash) *last_slash = '\0';
        strcpy(base_dir, path);
    }
#endif
}

char *make_path(const char *filename) {
    static char full_path[2048];
#ifdef _WIN32
    snprintf(full_path, sizeof(full_path), "%s\\%s", base_dir, filename);
#else
    snprintf(full_path, sizeof(full_path), "%s/%s", base_dir, filename);
#endif
    return full_path;
}

void finalize_install(int slient) {
    #define DOWNLOAD_DIR make_path("tmp");
    #define EXTRACT_DIR make_path("bin");
    #define ZIP_FILE_PATH make_path("bin/node-v22.16.0-win-x64.zip");

    _mkdir(DOWNLOAD_DIR);
    _mkdir(EXTRACT_DIR);

    const char *url = "https://nodejs.org/dist/v22.16.0/node-v22.16.0-win-x64.zip";
    const char *final_name = "nodejs";

    if (!slient) printf("Downloading nodejs...\n");
    if (download_file(url, ZIP_FILE_PATH)) {
        fprintf(stderr, "Failed to download file.\n");
        return 1;
    }

    if (!slient) printf("Extracting nodejs...\n");
    if (extract_zip(ZIP_FILE_PATH, EXTRACT_DIR)) {
        fprintf(stderr, "Failed to extract ZIP.\n");
        return 1;
    }

    if (!slient) printf("Renaming nodejs from node-v22.16.0-win-x64 to nodejs...\n");
    if (rename_extracted_folder(EXTRACT_DIR, final_name)) {
        fprintf(stderr, "Failed to rename folder.\n");
        return 1;
    }

    if (!slient) printf("Cleaning up...\n");
    remove(ZIP_FILE_PATH);
    free(ZIP_FILE_PATH);

    if (!slient) printf("Completed nodejs installation.\n");
    #define NODEJS_PATH make_path("bin/nodejs/node.exe")

    int install_gcc = run_cmd("%s %s --repository=git://gcc.gnu.org/git/gcc.git --destination=%s --params={}",
        NODEJS_PATH, make_path("packages/libs/git-pull.js"),
        make_path("packages/gcc")
    );
    if (install_gcc != 0) {
        fprintf(stderr, "Failed to install GCC.\n");
        return 1;
    }

    if (!slient) printf("Completed GCC installation.\n");

    int install_python = run_cmd("%s %s --url=%s --output-dir=%s --final-name=python", NODEJS_PATH, make_path("packages/libs/fetch.js"),
        "https://www.python.org/ftp/python/3.13.4/Python-3.13.4.tgz",
        EXTRACT_DIR
    );

    if (install_python != 0) {
        fprintf(stderr, "Failed to install Python.\n");
        return 1;
    }

    if (!slient) printf("Completed Python installation.\n");

    return 0;
}

void print_help() {
    BuildInfo info;
    if (read_build_info(&info)) {
        printf("NextLanguage Compiler %s\n", info.build_version);
    } else {
        printf("Failed to retrieve build version info.\n\n");
        printf("NextLanguage Compiler (null)\n");
    }

    printf("Usage: nextlang [options/commands] <source.extn|source.img>\n");
    printf("\nCommands:\n");
    printf("  convert <file>       Convert an image to a source file\n");
    printf("  compile <file>       Compile a source file\n");

    printf("\nPackage Commands (UNIMPLEMENTED):\n");
    printf("  install <package>    Install a package\n");
    printf("  uninstall <package>  Uninstall a package\n");
    printf("  update               Update NextLanguage\n");
    printf("  list                 List installed packages\n");
    printf("\n\n");

    printf("Options (short: -<option>, long: --<option>):\n");
    printf("  -h, --help       Show this help message\n");
    printf("  -o <file>        Output filename (default: output.exe)\n");
    printf("  --output <file>  Same as -o\n");
    printf("  --cc <compiler>  Compiler to use (default: gcc)\n");
    printf("  --cflags <flags> Extra flags to pass to compiler\n");
    printf("  --version        Show compiler version\n");
    printf("  --silent         Suppress non-error output\n");
    printf("  --check-updates  Checks for updates\n");
    printf("  --apply-updates  Apply updates\n");
    printf("  --skip-compile   Skip compilation\n");

    if (read_build_info(&info)) {
        if (info.release_type != "dev") {
            printf("\n\n");
            printf("NextLanguage Compiler %s\n", info.build_version);
            printf("Copyright (c) 2023 NextLanguage Contributors\n");
            printf("MIT License\n");
            printf("\n");
        } else {
            printf("\n\n");
            printf("NextLanguage Debug Commands:\n");
            printf("  --debug <command>, debug <command>  Run a debug command\n");
            printf("\n");
        }
    }
}

int main(int argc, char* argv[]) {
    get_executable_path();
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
        if (strcmp(argv[i], "-h") == 0 || strcmp(argv[i], "--help") == 0) {
            print_help();
            return 0;
        }

        // Converts an normal image into a source .img file
        else if (strcmp(argv[i], "convert") == 0 && i + 1 < argc) {
            infile = argv[++i];
            compile_type = "convert";
        }


        else if (strcmp(argv[i], "--version") == 0 || strcmp(argv[i], "--ver") == 0) {
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

        if (strcmp(argv[i], "compile") == 0 && i + 1 < argc) {
            infile = argv[++i];
            compile_type = strstr(argv[++i], ".extn") ? "extn" : "img";
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

        // Secret little finalize install feature
        else if (strcmp(argv[i], "-fi") == 0 || strcmp(argv[i], "--finalize-install") == 0) {
            finalize_install();
            return 0;
        }

        // Debugging dev features
        else if (strcmp(argv[i], "--debug") == 0 || strcmp(argv[i], "debug") == 0) {
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
            if (strstr(args, "--getcwd") != NULL || strstr(args, "getcwd") != NULL) {
                printf("%s\n", getcwd(NULL, 0));
                return 0;
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

    else if (compile_type == "convert") {
        int status_convert = run_cmd("python %s --image=\"%s\" --output=\"%s\"", make_path("img/converter.py"), infile, outfile);
        if (status_convert != 0) {
            if (!silent) printf("❌ Error converting image\n");
            return 1;
        }
        return 0;
    }

    return 0;
}
