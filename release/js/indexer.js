const fs = require('fs');
const path = require('path');

function generateIndex() {
    const updatesDir = path.join('../..');
    if (!fs.existsSync(updatesDir)) {
        console.error('❌ "updates/" directory not found.');
        process.exit(1);
    }

    const versions = fs.readdirSync(updatesDir).filter(f =>
        fs.statSync(path.join(updatesDir, f)).isDirectory()
    );

    const builds = versions.map(version => {
        const buildPath = path.join(updatesDir, version, 'build.json');
        if (fs.existsSync(buildPath)) {
            try {
                const buildData = JSON.parse(fs.readFileSync(buildPath, 'utf8'));
                return {
                    version,
                    release_type: buildData.release_type || "null",
                    changelog: buildData.changelog || ""
                };
            } catch (err) {
                console.warn(`⚠️ Failed to read build.json for version ${version}: ${err.message}`);
                return null;
            }
        }
        return null;
    }).filter(Boolean);

    // Sort builds by version (lexical or semantic if needed)
    builds.sort((a, b) => a.version.localeCompare(b.version, undefined, { numeric: true }));

    const indexPath = path.join(updatesDir, 'index.json');
    fs.writeFileSync(indexPath, JSON.stringify({ builds }, null, 2));
    console.log('✅ index.json generated at:', indexPath);
}

generateIndex();
