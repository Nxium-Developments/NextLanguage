#include "codegen.h"
#include "parser.h"
#include "version.h"
#include <string.h>
#include <stdlib.h>
#include <stdio.h>

void generate_c_code(FILE* in, FILE* out) {
    char line[512];

    init_parser(out);

    int version = 1; // default version

    // Read first line and parse version
    if (fgets(line, sizeof(line), in)) {
        if (strncmp(line, "@version ", 8) == 0) {
            version = atoi(line + 8);
        } else {
            rewind(in); // reset if no version
        }
    }

    // Parse based on version
    while (fgets(line, sizeof(line), in)) {
        parse_by_version(line, out, version);
    }

    finish_parser(out);
}
