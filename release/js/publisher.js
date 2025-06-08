const fs = require('fs');
const path = require('path');

function readConfig() {
    const configPath = 'config.json';
    if (!fs.existsSync(configPath)) {
        console.error('❌ config.json not found. Cannot publish.');
        process.exit(1);
    }

    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

function getFilesRecursive(dir, baseDir = dir) {
    let results = [];
    const list = fs.readdirSync(dir);

    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFilesRecursive(fullPath, baseDir));
        } else {
            const relativePath = path.relative(baseDir, fullPath);
            results.push(relativePath.replace(/\\/g, '/')); // Cross-platform paths
        }
    });

    return results;
}

function publishBuild() {
    const config = readConfig();
    const version = config.build_version;
    const buildDir = path.join('updates', version);

    if (!fs.existsSync(buildDir)) {
        console.error(`❌ Build directory ${buildDir} does not exist.`);
        process.exit(1);
    }

    const files = getFilesRecursive(buildDir);
    /**
     * REPLACE THIS with the actual LINK (Done)
     */
    const downloadBase = `https://raw.githubusercontent.com/Nxium-Developments/NextLanguage/updates/${version}/`;

    const buildJson = {
        version: config.build_version,
        name: config.build_name,
        description: config.build_description,
        changelog: config.build_changelog,
        changes: config.changes_made,
        language: config.build_language,
        release_type: config.release_type,
        files: files,
        binaries: files.filter(file => file.endsWith('.exe')),
        links: files.map(file => `${downloadBase}${file}`)
    };

    const buildJsonPath = path.join(buildDir, 'build.json');
    fs.writeFileSync(buildJsonPath, JSON.stringify(buildJson, null, 2));

    console.log(`✅ Build published to ${buildJsonPath}`);
}

publishBuild();
