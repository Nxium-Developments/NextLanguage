#ifndef PARSER_H
#define PARSER_H

#include <stdio.h>

void parse_line(char* line, FILE* out);
void init_parser(FILE* out);  // new
void finish_parser(FILE* out); // new

#endif
