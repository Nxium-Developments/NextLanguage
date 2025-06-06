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

// New function: prints current build info from config.json
void get_build_info(bool print_all = false) {
    FILE *file = fopen("config.json", "r");
    if (!file) {
        perror("Failed to open config.json for reading");
        return;
    }

    char buffer[8192]; // Bigger buffer to hold full JSON
    size_t nread = fread(buffer, sizeof(char), sizeof(buffer) - 1, file);
    fclose(file);

    buffer[nread] = '\0';

    // Simple extraction by strstr and manual parsing (for brevity, no JSON lib used)
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

    char release_type[64], build_version[64], build_language[64], build_name[128], build_description[256], build_changelog[256], changes_made[256], last_update_check[64], last_updated[64];
    EXTRACT_JSON_FIELD("release_type", release_type);
    EXTRACT_JSON_FIELD("build_version", build_version);
    EXTRACT_JSON_FIELD("build_language", build_language);
    EXTRACT_JSON_FIELD("build_name", build_name);
    EXTRACT_JSON_FIELD("build_description", build_description);
    EXTRACT_JSON_FIELD("build_changelog", build_changelog);
    EXTRACT_JSON_FIELD("changes_made", changes_made);
    EXTRACT_JSON_FIELD("last_update_check", last_update_check);
    EXTRACT_JSON_FIELD("last_updated", last_updated);

    if (print_all) {
        printf("=== Current Build Info ===\n");
        printf("Release Type: %s\n", release_type);
        printf("Build Version: %s\n", build_version);
        printf("Build Language: %s\n", build_language);
        printf("Build Name: %s\n", build_name);
        printf("Build Description: %s\n", build_description);
        printf("Build Changelog: %s\n", build_changelog);
        printf("Changes Made: %s\n", changes_made);
        printf("Last Update Check: %s\n", last_update_check);
        printf("Last Updated: %s\n", last_updated);
        printf("==========================\n");
    }

    #undef EXTRACT_JSON_FIELD

    // Allocate enough space for the JSON output
    char *json_output = malloc(2048);
    if (!json_output) {
        perror("Failed to allocate memory");
        return NULL;
    }

    // Format JSON string with proper escaping for double quotes etc. 
    // (For simplicity, assuming no special characters needing escaping)
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
        release_type, build_version, build_language, build_name, build_description,
        build_changelog, changes_made, last_update_check, last_updated);

    return json_output;
}