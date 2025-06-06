#include "updater.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#ifdef _WIN32
#include <io.h>
#define access _access
#else
#include <unistd.h>
#endif

#define REPO_URL "https://github.com/Nxium-Developments/NextLanguage.git"
#define UPDATES_DIR "updates"

int run_cmd(const char *cmd) {
    int result = system(cmd);
    if (result != 0) {
        fprintf(stderr, "Command failed: %s\n", cmd);
    }
    return result;
}

void fetch_updates_repo() {
    if (access(UPDATES_DIR, F_OK) != -1) {
        printf("📥 Pulling updates from branch...\n");
        run_cmd("cd updates && git pull origin updates");
    } else {
        printf("📦 Cloning updates repository...\n");
        char cmd[512];
        snprintf(cmd, sizeof(cmd), "git clone -b updates %s %s", REPO_URL, UPDATES_DIR);
        run_cmd(cmd);
    }
}

int validate_update_environment() {
    if (system("node -v > nul 2>&1") != 0) {
        fprintf(stderr, "❌ Node.js is not installed or not in PATH.\n");
        return 0;
    }

    FILE *fp = fopen("./index.js", "r");
    if (!fp) {
        fprintf(stderr, "❌ index.js not found.\n");
        return 0;
    }
    fclose(fp);
    return 1;
}

void check_for_updates() {
    check_for_updates_mode(MODE_DEFAULT);
}

void apply_update_package() {
    printf("🚚 Applying update package...\n");
    int result = run_cmd("node package.js");
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

void check_for_updates_mode(UpdateMode mode) {
    if (!validate_update_environment()) return;

    fetch_updates_repo();

    char cmd[256];
    switch (mode) {
        case MODE_SILENT:
            snprintf(cmd, sizeof(cmd), "node index.js --silent");
            break;
        case MODE_AUTO:
            snprintf(cmd, sizeof(cmd), "node index.js --auto");
            break;
        default:
            snprintf(cmd, sizeof(cmd), "node index.js");
            break;
    }

    printf("🔍 Checking for updates...\n");

    int result = run_cmd(cmd);
    if (result == 0) {
        if (mode != MODE_SILENT) {
            printf("✅ Update check completed.\n");
        }

        // If auto mode, apply update right away
        if (mode == MODE_AUTO) {
            apply_update_package();
        }
    } else {
        fprintf(stderr, "⚠️ Failed to run update checker.\n");
    }
}
