#include "package.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <stdbool.h>

// Helper function to get current time string
const char* current_time_str() {
    static char buffer[64];
    time_t now = time(NULL);
    strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", gmtime(&now));
    return buffer;
}

void log_build_info() {
    FILE *file = fopen("config.json", "w");
    if (!file) {
        perror("Failed to open config.json for writing");
        return;
    }

    // Replace with your actual values or dynamic sources
    const char *release_type = "dev";
    const char *build_version = "0.1.0";
    const char *build_language = "C, JS";
    const char *build_name = "NextLanguage Auto-Updater";
    const char *build_description = "Initial development build for auto-updating system.";
    const char *changelog_link = "https://github.com/YOUR_USER/YOUR_REPO/blob/updates/0.1.0/changelog.md";
    const char *changes_made = "Implemented update detection and application logic.";

    fprintf(file,
        "{\n"
        "  \"release_type\": \"%s\",\n"
        "  \"build_version\": \"%s\",\n"
        "  \"build_language\": \"%s\",\n"
        "  \"build_name\": \"%s\",\n"
        "  \"build_description\": \"%s\",\n"
        "  \"build_changelog\": \"%s\",\n"
        "  \"changes_made\": \"%s\",\n"
        "  \"last_update_check\": \"%s\",\n"
        "  \"last_updated\": \"%s\",\n"
        "  \"update_available\": false\n"
        "}\n",
        release_type, build_version, build_language, build_name, build_description,
        changelog_link, changes_made, current_time_str(), current_time_str()
    );

    fclose(file);
    printf("Build information logged to config.json.\n");
}

void prompt_update() {
    FILE *file = fopen("config.json", "r");
    if (!file) {
        perror("Failed to open config.json for reading");
        return;
    }

    char buffer[4096];
    fread(buffer, sizeof(char), sizeof(buffer) - 1, file);
    fclose(file);

    buffer[sizeof(buffer) - 1] = '\0';
    if (strstr(buffer, "\"update_available\": true") != NULL) {
        printf("⚠️  Update is available!\n");
        printf("👉 Run the update command to install the latest version.\n");
    } else {
        printf("✅ No updates available.\n");
    }
}

#define EXTRACT_JSON_FIELD(field, dest) do { \
    char *start = strstr(buffer, "\"" field "\":"); \
    if (start) { \
        start = strchr(start, ':'); \
        if (start) { \
            start += 1; \
            while (*start == ' ' || *start == '\"') start++; \
            char *end = start; \
            while (*end && *end != '\"' && *end != ',' && *end != '\n' && *end != '}') end++; \
            size_t len = end - start; \
            strncpy(dest, start, len); \
            dest[len] = '\0'; \
        } else { \
            dest[0] = '\0'; \
        } \
    } else { \
        dest[0] = '\0'; \
    } \
} while(0)

bool read_build_info(BuildInfo *info) {
    FILE *file = fopen("config.json", "r");
    if (!file) {
        perror("Failed to open config.json");
        return false;
    }

    char buffer[8192];
    size_t nread = fread(buffer, sizeof(char), sizeof(buffer) - 1, file);
    fclose(file);
    buffer[nread] = '\0';

    EXTRACT_JSON_FIELD("release_type", info->release_type);
    EXTRACT_JSON_FIELD("build_version", info->build_version);
    EXTRACT_JSON_FIELD("build_language", info->build_language);
    EXTRACT_JSON_FIELD("build_name", info->build_name);
    EXTRACT_JSON_FIELD("build_description", info->build_description);
    EXTRACT_JSON_FIELD("build_changelog", info->build_changelog);
    EXTRACT_JSON_FIELD("changes_made", info->changes_made);
    EXTRACT_JSON_FIELD("last_update_check", info->last_update_check);
    EXTRACT_JSON_FIELD("last_updated", info->last_updated);

    return true;
}

void print_build_info(const BuildInfo *info) {
    printf("=== Current Build Info ===\n");
    printf("Release Type: %s\n", info->release_type);
    printf("Build Version: %s\n", info->build_version);
    printf("Build Language: %s\n", info->build_language);
    printf("Build Name: %s\n", info->build_name);
    printf("Build Description: %s\n", info->build_description);
    printf("Build Changelog: %s\n", info->build_changelog);
    printf("Changes Made: %s\n", info->changes_made);
    printf("Last Update Check: %s\n", info->last_update_check);
    printf("Last Updated: %s\n", info->last_updated);
    printf("==========================\n");
}

char* build_info_to_json(const BuildInfo *info) {
    char *json_output = malloc(2048);
    if (!json_output) {
        perror("Failed to allocate memory for JSON output");
        return NULL;
    }

    snprintf(json_output, 2048,
        "{\n"
        "  \"release_type\": \"%s\",\n"
        "  \"build_version\": \"%s\",\n"
        "  \"build_language\": \"%s\",\n"
        "  \"build_name\": \"%s\",\n"
        "  \"build_description\": \"%s\",\n"
        "  \"build_changelog\": \"%s\",\n"
        "  \"changes_made\": \"%s\",\n"
        "  \"last_update_check\": \"%s\",\n"
        "  \"last_updated\": \"%s\"\n"
        "}",
        info->release_type, info->build_version, info->build_language,
        info->build_name, info->build_description, info->build_changelog,
        info->changes_made, info->last_update_check, info->last_updated
    );

    return json_output;
}