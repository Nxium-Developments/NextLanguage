#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#ifdef _WIN32
#include <windows.h>
#else
#include <unistd.h>
#include <limits.h>
#endif

#include "path.h"

char base_dir[1024];

void get_executable_path() {
#ifdef _WIN32
    char path[MAX_PATH];
    GetModuleFileNameA(NULL, path, MAX_PATH);
    char* last_slash = strrchr(path, '\\');
    if (last_slash) *last_slash = '\0';
    strcpy(base_dir, path);
#else
    char path[PATH_MAX];
    ssize_t count = readlink("/proc/self/exe", path, PATH_MAX - 1);
    if (count != -1) {
        path[count] = '\0';
        char* last_slash = strrchr(path, '/');
        if (last_slash) *last_slash = '\0';
        strcpy(base_dir, path);
    }
#endif
}

char* make_path(const char* filename) {
    static char full_path[2048];
#ifdef _WIN32
    snprintf(full_path, sizeof(full_path), "%s\\%s", base_dir, filename);
#else
    snprintf(full_path, sizeof(full_path), "%s/%s", base_dir, filename);
#endif
    return full_path;
}
