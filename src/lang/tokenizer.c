#include "tokenizer.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include "../utils/path.h"

#define MAGIC "BNDL"
#define MAX_NAME 256
#define MAX_FILES 128

typedef struct {
    char name[MAX_NAME];
    uint32_t size;
    uint8_t *data;
} FileEntry;

static FileEntry files[MAX_FILES];
static int file_count = 0;

// Helper: trim newlines and spaces
static char *trim(char *s) {
    while (*s == ' ' || *s == '\t' || *s == '\n' || *s == '\r') s++;
    char *end = s + strlen(s) - 1;
    while (end > s && (*end == ' ' || *end == '\t' || *end == '\n' || *end == '\r')) *end-- = '\0';
    return s;
}

// Parse .pack format
int convert_pack_to_bundle(const char *pack_file, const char *bundle_output) {
    FILE *fp = fopen(pack_file, "r");
    if (!fp) return 1;

    char line[1024], current_name[MAX_NAME] = "";
    uint8_t *buffer = NULL;
    size_t buf_size = 0;

    while (fgets(line, sizeof(line), fp)) {
        if (strncmp(line, "::", 2) == 0) {
            if (strlen(current_name) > 0) {
                files[file_count].data = buffer;
                files[file_count].size = buf_size;
                strncpy(files[file_count].name, current_name, MAX_NAME);
                file_count++;
                buffer = NULL;
                buf_size = 0;
            }
            sscanf(line, "::%[^[]", current_name);
            strcpy(current_name, trim(current_name + 2));
        } else if (strcmp(trim(line), "]") != 0) {
            size_t len = strlen(line);
            buffer = realloc(buffer, buf_size + len);
            memcpy(buffer + buf_size, line, len);
            buf_size += len;
        }
    }

    if (strlen(current_name) > 0 && buf_size > 0) {
        files[file_count].data = buffer;
        files[file_count].size = buf_size;
        strncpy(files[file_count].name, current_name, MAX_NAME);
        file_count++;
    }

    fclose(fp);

    FILE *out = fopen(bundle_output, "wb");
    if (!out) return 1;

    fwrite(MAGIC, 1, strlen(MAGIC), out);
    fwrite(&file_count, sizeof(int), 1, out);

    for (int i = 0; i < file_count; ++i) {
        fwrite(files[i].name, 1, MAX_NAME, out);
        fwrite(&files[i].size, sizeof(uint32_t), 1, out);
        fwrite(files[i].data, 1, files[i].size, out);
    }

    fclose(out);
    return 0;
}

// Runtime loader
int run_bundle(const char *bundle_path) {
    FILE *fp = fopen(bundle_path, "rb");
    if (!fp) {
        perror("bundle open");
        return 1;
    }

    char magic[5] = {0};
    fread(magic, 1, 4, fp);
    if (strncmp(magic, MAGIC, 4) != 0) {
        fclose(fp);
        return 1;
    }

    fread(&file_count, sizeof(int), 1, fp);
    for (int i = 0; i < file_count; ++i) {
        fread(files[i].name, 1, MAX_NAME, fp);
        fread(&files[i].size, sizeof(uint32_t), 1, fp);
        files[i].data = malloc(files[i].size);
        fread(files[i].data, 1, files[i].size, fp);
    }

    fclose(fp);

    // Find initialized.bin
    for (int i = 0; i < file_count; ++i) {
        if (strcmp(files[i].name, "initialized.bin") == 0) {
            // Write to temp JS file
            FILE *tmp = fopen("tmp_init.js", "wb");
            fwrite(files[i].data, 1, files[i].size, tmp);
            fclose(tmp);

            // Run using internal Node runtime (must be compiled-in or statically linked)
            char command[PATH_MAX];
            snprintf(command, sizeof(command), "%s tmp_init.js", command);
#ifdef _WIN32
            system(command);
#else
            system(command);
#endif
            remove("tmp_init.js");
            return 0;
        }
    }

    fprintf(stderr, "initialized.bin not found\n");
    return 1;
}
