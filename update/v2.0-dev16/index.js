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

let CONFIG_PATH = path.join(__dirname, 'config.json');
let INDEX_PATH = path.join(__dirname, 'updates', 'index.json');

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

function versionPriority(current, candidate) {
    /**
     * versionPriority("1.0.0-dev1", "1.0.0-dev2") // true
     * versionPriority("1.0.0-alpha", "1.0.0-beta") // true
     * versionPriority("1.0.0", "1.0.0-dev1") // true (null < dev)
     * versionPriority("1.0.0-test", "1.0.0-beta") // false (test > beta)
     */

    const priority = {
        null: 0,
        dev: 1,
        nightly: 2,
        alpha: 3,
        beta: 4,
        test: 5,
        stable: 6
    };

    // Helper to extract the tag from version string
    function extractTag(version) {
        if (!version) return 'null';
        for (const tag of Object.keys(priority)) {
            if (tag !== 'null' && version.includes(tag)) return tag;
        }
        return 'null'; // default if no known tag found
    }

    const currentTag = extractTag(current);
    const candidateTag = extractTag(candidate);

    const currentPriority = priority[currentTag];
    const candidatePriority = priority[candidateTag];

    if (candidatePriority > currentPriority) {
        return true;
    } else if (candidatePriority < currentPriority) {
        return false;
    } else {
        // Same tag, do numeric-aware comparison
        return candidate.localeCompare(current, undefined, { numeric: true, sensitivity: 'base' }) > 0;
    }
}

function isNewerVersion(current, candidate) {
    return versionPriority(current, candidate);
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

    const latest = newer.sort((a, b) => {
        if (versionPriority(a.version, b.version)) return -1;
        if (versionPriority(b.version, a.version)) return 1;
        return 0;
    })[0];
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

function markUpdate(config, build, baseDir) {
    const buildJsonPath = path.join(baseDir, 'updates', build.version, 'build.json');
    const buildMeta = readJSON(buildJsonPath);

    config.update_available = true;
    config.update_info = {
        version: build.version,
        release_type: build.release_type,
        changelog: buildMeta.changelog || "",
        files: buildMeta.files || [],
        binaries: buildMeta.binaries || []
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

const baseDirArg = args.find(arg => arg.startsWith('--base-dir='));
const baseDir = baseDirArg ? baseDirArg.split('=')[1].replace('\\index.js', '') : process.cwd();  // fallback if not provided

CONFIG_PATH = path.join(baseDir, 'config.json');
INDEX_PATH = path.join(baseDir, 'updates', 'index.json');

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
        markUpdate(config, build, baseDir);
    } else {
        promptUser(config, build);
        markUpdate(config, build, baseDir);
    }
}

checkForUpdates();
