#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "../libs/stb_image_write.h"
#include "imagery.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <libgen.h>
#include <unistd.h>
#include <limits.h>

#define MAX_NAMED 4096
static NamedHex named_colors[MAX_NAMED];
static int named_count = 0;

#define MAX_LINE 16384

static void trim(char* str) {
    char* end;
    while (isspace((unsigned char)*str)) str++;
    if (*str == 0) return;
    end = str + strlen(str) - 1;
    while (end > str && isspace((unsigned char)*end)) end--;
    *(end + 1) = 0;
}

static int find_named_color(const char* name, Pixel* out) {
    for (int i = 0; i < named_count; i++) {
        if (strcmp(named_colors[i].name, name) == 0) {
            *out = named_colors[i].color;
            return 1;
        }
    }
    return 0;
}

static Pixel hex_to_pixel(const char* hex) {
    Pixel p;
    sscanf(hex, "%2hhx%2hhx%2hhx", &p.r, &p.g, &p.b);
    return p;
}

void load_named_colors(const char* exe_path, char* hex_path) {
    char exe_dir[PATH_MAX];
    #ifdef __unix__  // or use #ifndef _WIN32
        ssize_t len = readlink("/proc/self/exe", exe_path, PATH_MAX - 1);
        if (len == -1) return;
        exe_path[len] == '\0';
    #else
        // Windows fallback: just default to current directory
        strncpy(exe_path, ".", PATH_MAX);
    #endif
    dirname(exe_dir);

    char json_path[PATH_MAX];
    if (!hex_path) hex_path = "default_colors.json";
    snprintf(json_path, PATH_MAX, "%s/img/hex-codes/%s", exe_dir, hex_path);

    FILE* f = fopen(json_path, "r");
    if (!f) return;

    char line[MAX_LINE];
    while (fgets(line, sizeof(line), f)) {
        trim(line);
        if (line[0] == '{' || line[0] == '}' || strlen(line) == 0)
            continue;

        char* key_start = strchr(line, '\"');
        if (!key_start) continue;
        char* key_end = strchr(key_start + 1, '\"');
        if (!key_end) continue;

        char name[64];
        strncpy(name, key_start + 1, key_end - key_start - 1);
        name[key_end - key_start - 1] = '\0';

        char* colon = strchr(key_end, ':');
        if (!colon) continue;

        char* val_start = strchr(colon, '\"');
        if (!val_start) continue;
        char* val_end = strchr(val_start + 1, '\"');
        if (!val_end) continue;

        char hex[16];
        strncpy(hex, val_start + 1, val_end - val_start - 1);
        hex[val_end - val_start - 1] = '\0';

        if (named_count < MAX_NAMED) {
            named_colors[named_count].color = hex_to_pixel(hex);
            strncpy(named_colors[named_count].name, name, 63);
            named_count++;
        }
    }

    fclose(f);
}

Image* parse_image_file(const char* filepath) {
    FILE* f = fopen(filepath, "r");
    if (!f) return NULL;

    char line[MAX_LINE];
    int in_image = 0;
    int width = 0, height = 0;
    Pixel* data = NULL;

    while (fgets(line, sizeof(line), f)) {
        if (strncmp(line, "#define HEX_NAME", 16) == 0) {
            while (fgets(line, sizeof(line), f)) {
                if (strncmp(line, "#end", 4) == 0) break;
                trim(line);
                if (strchr(line, '=') == NULL) continue;

                char* name = strtok(line, "=");
                char* hex = strtok(NULL, "=");
                if (name && hex && named_count < MAX_NAMED) {
                    trim(name);
                    trim(hex);
                    named_colors[named_count].color = hex_to_pixel(hex);
                    strncpy(named_colors[named_count].name, name, 63);
                    named_count++;
                }
            }
            continue;
        }

        if (strncmp(line, "#include HEX_NAME_LIST", 20) == 0) {
            char exe_path[PATH_MAX];
            #ifdef __unix__  // or use #ifndef _WIN32
                ssize_t len = readlink("/proc/self/exe", exe_path, PATH_MAX - 1);
                if (len == -1) return;
                exe_path[len] = '\0';
            #else
                // Windows fallback: just default to current directory
                strncpy(exe_path, ".", PATH_MAX);
            #endif
            load_named_colors(exe_path, strchr(line, ' ') + 1);
            continue;
        }

        if (strncmp(line, "#include DEFAULT_HEX_NAMES", 26) == 0) {
            char exe_path[PATH_MAX];
            #ifdef __unix__  // or use #ifndef _WIN32
                ssize_t len = readlink("/proc/self/exe", exe_path, PATH_MAX - 1);
                if (len == -1) return 0;
                exe_path[len] = '\0';
            #else
                // Windows fallback: just default to current directory
                strncpy(exe_path, ".", PATH_MAX);
            #endif
            load_named_colors(exe_path, NULL);
            continue;
        }

        if (strncmp(line, "#define IMG", 11) == 0) {
            in_image = 1;
            continue;
        }
        if (strncmp(line, "#end", 4) == 0) break;
        if (!in_image) continue;

        line[strcspn(line, "\r\n")] = 0;

        int row_width = 0;
        char* token = strtok(line, " ");
        Pixel row_pixels[1024];

        while (token && row_width < 1024) {
            Pixel p;
            if (!find_named_color(token, &p)) {
                p = hex_to_pixel(token);
            }
            row_pixels[row_width++] = p;
            token = strtok(NULL, " ");
        }

        if (row_width > width) width = row_width;
        data = realloc(data, sizeof(Pixel) * width * (height + 1));
        memcpy(&data[height * width], row_pixels, sizeof(Pixel) * row_width);
        height++;
    }

    fclose(f);

    Image* img = malloc(sizeof(Image));
    img->width = width;
    img->height = height;
    img->data = data;

    return img;
}

void write_image_json(const Image* img, const char* jsonpath) {
    FILE* f = fopen(jsonpath, "w");
    if (!f) return;

    fprintf(f, "{\n  \"width\": %d,\n  \"height\": %d,\n  \"pixels\": [\n", img->width, img->height);
    for (int i = 0; i < img->width * img->height; i++) {
        Pixel p = img->data[i];
        fprintf(f, "    \"#%02X%02X%02X\"%s\n", p.r, p.g, p.b,
                (i + 1 < img->width * img->height) ? "," : "");
    }
    fprintf(f, "  ]\n}\n");
    fclose(f);
}

// ✅ NEW: Write image as PNG file
void write_image_png(const Image* img, const char* filename) {
    if (!img || !img->data) return;

    // stb expects unsigned char* for pixel data (RGBRGB...)
    unsigned char* buffer = malloc(img->width * img->height * 3);
    for (int i = 0; i < img->width * img->height; i++) {
        buffer[i * 3 + 0] = img->data[i].r;
        buffer[i * 3 + 1] = img->data[i].g;
        buffer[i * 3 + 2] = img->data[i].b;
    }

    stbi_write_png(filename, img->width, img->height, 3, buffer, img->width * 3);
    free(buffer);
}

void free_image(Image* img) {
    if (!img) return;
    free(img->data);
    free(img);
}
