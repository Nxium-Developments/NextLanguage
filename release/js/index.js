const fs = require('fs');
const path = require('path');

// =========================
// === UTILITY HELPERS ====
// =========================

function readJSON(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJSON(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function log(...args) {
    if (!silentMode) {
        console.log('[updater]', ...args);
    }
}

// =============================
// === CONFIG + INDEX LOADER ===
// =============================

const CONFIG_PATH = 'config.json';
const INDEX_PATH = path.join('updates', 'index.json');

function readConfig() {
    return readJSON(CONFIG_PATH);
}

function writeConfig(config) {
    config.last_update_check = new Date().toISOString();
    writeJSON(CONFIG_PATH, config);
}

function fetchIndex() {
    return readJSON(INDEX_PATH);
}

// =============================
// === VERSION COMPARISON =====
// =============================

function isNewerVersion(current, candidate) {
    return candidate.localeCompare(current, undefined, { numeric: true, sensitivity: 'base' }) > 0;
}

// =============================
// === MAIN UPDATE CHECKER ====
// =============================

function selectBuild(config, builds) {
    const { release_type, build_version } = config;

    const filtered = builds.filter(b => {
        return release_type === 'null' || b.release_type === release_type;
    });

    const newer = filtered.filter(b => isNewerVersion(build_version, b.version));

    if (newer.length === 0) return null;

    const latest = newer.sort((a, b) => b.version.localeCompare(a.version))[0];
    return latest;
}

// =============================
// === PROMPT-LIKE LOGIC ======
// =============================

function promptUser(config, candidate) {
    switch (config.release_type) {
        case 'beta':
        case 'alpha':
            log(`Update candidate found: ${candidate.version}`);
            log(`Release Type: ${candidate.release_type}`);
            log(`Ask user if they want to update to ${candidate.version}`);
            break;

        case 'null':
            log(`Detected uncommitted build. Prompt developer to create metadata for release ${candidate.version}`);
            break;

        default:
            log(`Auto-selecting update: ${candidate.version}`);
            break;
    }
}

// =============================
// === CONFIG UPDATE WRITER ===
// =============================

function markUpdate(config, build) {
    const buildJsonPath = path.join('updates', build.version, 'build.json');
    const buildMeta = readJSON(buildJsonPath);

    config.update_available = true;
    config.update_info = {
        version: build.version,
        release_type: build.release_type,
        changelog: buildMeta.changelog || "",
        files: buildMeta.files || [],
        download_links: buildMeta.files.map(f =>
            `https://raw.githubusercontent.com/<your-org-or-user>/<your-repo>/updates/${build.version}/${f}`
        )
    };

    writeConfig(config);
    log(`Update marked as available: ${build.version}`);
}

// =============================
// ===== ENTRY POINT LOGIC ====
// =============================

// Parse CLI args
const args = process.argv.slice(2);
const silentMode = args.includes('--silent');
const autoMode = args.includes('--auto');

function checkForUpdates() {
    const config = readConfig();
    const index = fetchIndex();

    const build = selectBuild(config, index.builds);
    if (!build) {
        if (!silentMode) log('No updates available.');
        return;
    }

    if (autoMode) {
        // Automatically mark update without prompts
        markUpdate(config, build);
    } else {
        promptUser(config, build);
        markUpdate(config, build);
    }
}

checkForUpdates();
