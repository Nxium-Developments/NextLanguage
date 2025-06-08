#ifndef PACKAGE_H
#define PACKAGE_H

#include <stdbool.h>


typedef struct {
    char release_type[64];
    char build_version[64];
    char build_language[64];
    char build_name[128];
    char build_description[256];
    char build_changelog[256];
    char changes_made[256];
    char last_update_check[64];
    char last_updated[64];
} BuildInfo;

bool read_build_info(BuildInfo *info);
void print_build_info(const BuildInfo *info);
char* build_info_to_json(const BuildInfo *info);

void prompt_update();
void set_exe_dir();

#endif // PACKAGE_H
