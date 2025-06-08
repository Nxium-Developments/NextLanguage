#include "updater.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#ifdef _WIN32
#include <windows.h>
#include <io.h>
#define access _access
#else
#include <unistd.h>
#include <limits.h>
#endif

#define REPO_URL "https://github.com/Nxium-Developments/NextLanguage.git"

char base_dir[1024];

// Get directory of current executable
void init_base_dir() {
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

int run_cmd(const char *cmd) {
    int result = system(cmd);
    if (result != 0) {
        fprintf(stderr, "Command failed: %s\n", cmd);
    }
    return result;
}

void fetch_updates_repo() {
    if (access(make_path("updates"), F_OK) != -1) {
        printf("📥 Pulling updates from branch...\n");
        char cmd[512];
        snprintf(cmd, sizeof(cmd), "cd \"%s\" && git pull origin updates", make_path("updates"));
        run_cmd(cmd);
    } else {
        printf("📦 Cloning updates repository...\n");
        char cmd[1024];
        snprintf(cmd, sizeof(cmd), "git clone -b updates %s \"%s\"", REPO_URL, make_path("updates"));
        run_cmd(cmd);
    }
}

int validate_update_environment() {
    if (system("node -v > nul 2>&1") != 0) {
        fprintf(stderr, "❌ Node.js is not installed or not in PATH.\n");
        return 0;
    }

    FILE *fp = fopen(make_path("index.js"), "r");
    if (!fp) {
        fprintf(stderr, "❌ index.js not found in executable directory.\n");
        return 0;
    }
    fclose(fp);
    return 1;
}

void apply_update_package() {
    printf("🚚 Applying update package...\n");

    char cmd[512];
    snprintf(cmd, sizeof(cmd), "node \"%s\" --base-dir=\"%s\"", make_path("package.js"), make_path(""));
    int result = run_cmd(cmd);

    if (result == 0) {
        printf("✅ Update package applied successfully.\n");
    } else {
        fprintf(stderr, "❌ Failed to apply update package.\n");
    }
}

void apply_update() {
    if (!validate_update_environment()) return;

    apply_update_package();
}

void check_for_updates() {
    check_for_updates_mode(MODE_DEFAULT);
}

void check_for_updates_mode(UpdateMode mode) {
    if (!validate_update_environment()) return;

    fetch_updates_repo();

    char cmd[512];
    switch (mode) {
        case MODE_SILENT:
            snprintf(cmd, sizeof(cmd), "node \"%s\" --silent --base-dir=\"%s\"", make_path("index.js"), make_path(""));
            break;
        case MODE_AUTO:
            snprintf(cmd, sizeof(cmd), "node \"%s\" --auto --base-dir=\"%s\"", make_path("index.js"), make_path(""));
            break;
        default:
            snprintf(cmd, sizeof(cmd), "node \"%s\" --base-dir=\"%s\"", make_path("index.js"), make_path(""));
            break;
    }

    printf("🔍 Checking for updates...\n");

    int result = run_cmd(cmd);
    if (result == 0) {
        if (mode != MODE_SILENT) {
            printf("✅ Update check completed.\n");
        }
        if (mode == MODE_AUTO) {
            apply_update_package();
        }
    } else {
        fprintf(stderr, "⚠️ Failed to run update checker.\n");
    }
}
