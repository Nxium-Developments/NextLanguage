const fs = require('fs');
const path = require('path');
const https = require('https');

const CONFIG_PATH = 'config.json';

function readConfig() {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
}

function writeConfig(config) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

function downloadFile(url, dest, callback) {
    const file = fs.createWriteStream(dest);
    https.get(url, response => {
        if (response.statusCode !== 200) {
            console.error(`Failed to download ${url} (Status: ${response.statusCode})`);
            file.close();
            fs.unlinkSync(dest);
            return callback(new Error(`Failed to download: ${url}`));
        }
        response.pipe(file);
        file.on('finish', () => {
            file.close(callback);
        });
    }).on('error', err => {
        fs.unlinkSync(dest);
        return callback(err);
    });
}

function applyUpdate() {
    const config = readConfig();

    if (!config.update_available || !config.update_info) {
        console.log('No update to apply.');
        return;
    }

    const update = config.update_info;
    const files = update.files;
    const links = update.download_links;

    if (!Array.isArray(files) || !Array.isArray(links) || files.length !== links.length) {
        console.error('Update metadata is corrupted or incomplete.');
        return;
    }

    console.log(`Applying update to version ${update.version}...`);

    let completed = 0;

    files.forEach((file, index) => {
        const link = links[index];
        const destPath = path.join('.', file);
        const destDir = path.dirname(destPath);

        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        downloadFile(link, destPath, (err) => {
            if (err) {
                console.error(`Error downloading ${file}:`, err.message);
                return;
            }

            console.log(`Downloaded ${file}`);
            completed++;

            if (completed === files.length) {
                console.log(`All files downloaded. Finalizing update...`);
                config.build_version = update.version;
                config.update_available = false;
                config.last_updated = new Date().toISOString();
                delete config.update_info;
                writeConfig(config);
                console.log(`Update applied successfully to version ${config.build_version}`);
            }
        });
    });
}

applyUpdate();
