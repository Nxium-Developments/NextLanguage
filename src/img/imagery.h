#ifndef IMAGERY_H
#define IMAGERY_H

#include <stdint.h>

typedef struct {
    uint8_t r, g, b;
} Pixel;

typedef struct {
    int width;
    int height;
    Pixel* data;
} Image;

typedef struct {
    char name[64];
    Pixel color;
} NamedHex;

void load_named_colors(const char* exe_path);

Image* parse_image_file(const char* filepath);
void write_image_json(const Image* img, const char* jsonpath);
void write_image_png(const Image* img, const char* filename);
void free_image(Image* img);

#endif
