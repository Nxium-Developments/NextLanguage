#include "parser.h"
#include <string.h>

void parse_by_version(char* line, FILE* out, int version) {
    switch (version) {
        case 1:
            parse_line_v1(line, out);
            break;
        case 2:
            parse_line_v2(line, out);
            break;
        default:
            // fallback or error
            fprintf(stderr, "Unsupported version: %d\n", version);
            exit(1);
    }
}
