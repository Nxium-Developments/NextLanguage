#include "codegen.h"
#include "parser.h"
#include <stdio.h>

void generate_c_code(FILE* in, FILE* out) {
    char line[256];

    init_parser(out);

    while (fgets(line, sizeof(line), in)) {
        parse_line(line, out);
    }

    finish_parser(out);
}
