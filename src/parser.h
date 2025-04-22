#ifndef PARSER_H
#define PARSER_H

#include <stdio.h>

void init_parser(FILE* out);  // new
void finish_parser(FILE* out); // new

void parse_line_v1(char* line, FILE* out);
void parse_line_v2(char* line, FILE* out); // Future version

#endif
