const fs = require('fs');
const path = require('path');

// =============================
// ==== VERSION COMPARISON =====
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
// ====== BUILD SELECTION ======
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

function getLatestBuild() {
    const updatesDir = path.join('.');
    const indexPath = path.join(updatesDir, 'index.json');
    const configPath = path.join(updatesDir, 'config.json');

    if (!fs.existsSync(indexPath)) {
        console.error('❌ "index.json" not found.');
        process.exit(1);
    }

    if (!fs.existsSync(configPath)) {
        console.error('❌ "config.json" not found.');
        process.exit(1);
    }

    const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    const latest = selectBuild(configData, indexData.builds);

    if (latest) {
        console.log(`✅ Newer build found: ${latest.version} (${latest.release_type})`);
    } else {
        console.log('✅ You already have the latest version.');
    }

    return latest;
}

// ==============================
// ========= MAIN LOGIC =========
// ==============================

function writeLatestBuild() {
    const latestBuild = getLatestBuild()
    const latestTXT = path.join('.', 'latest.txt');
    fs.writeFileSync(latestTXT, latestBuild);
}

writeLatestBuild();
