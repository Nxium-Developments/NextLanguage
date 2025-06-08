#ifndef UPDATER_H
#define UPDATER_H

typedef enum {
    MODE_DEFAULT,
    MODE_SILENT,
    MODE_AUTO
} UpdateMode;

// Get directory of current executable
void init_base_dir();

// Runs the updater logic (calls index.js) to determine if updates are available
void check_for_updates();

// Clones or pulls the latest 'updates' branch from GitHub
void fetch_updates_repo();

// Ensures node and index.js are available before running update logic
int validate_update_environment();

// Runs the updater logic (calls index.js) to determine if updates are available
void check_for_updates_mode(UpdateMode mode);

// Runs the updater logic (calls package.js) to apply updates
void apply_update();

#endif // UPDATER_H
