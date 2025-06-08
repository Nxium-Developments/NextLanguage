const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { simpleGit } = require('simple-git');
let logs = '';

function log(...args) {
    const msg = `[installer] ${args.join(' ')}`;
    console.log(msg);
    logs += msg + '\n';
}

function getFilesRecursive(dir, baseDir = dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            results = results.concat(getFilesRecursive(fullPath, baseDir));
        } else {
            results.push(path.relative(baseDir, fullPath).replace(/\\/g, '/'));
        }
    });
    return results;
}

function compareVersions(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

async function getLatestBuilds() {
    const repoPath = path.join(__dirname, 'updates');
    if (fs.existsSync(repoPath)) fs.rmSync(repoPath, { recursive: true, force: true });

    await simpleGit().clone('https://github.com/Nxium-Developments/NextLanguage.git', repoPath, {
        '--branch': 'updates',
        '--depth': '1'
    });

    const indexPath = path.join(repoPath, 'index.json');
    if (!fs.existsSync(indexPath)) throw new Error('Missing index.json');

    const index = JSON.parse(fs.readFileSync(indexPath));
    if (!Array.isArray(index.builds)) throw new Error('Invalid builds array in index.json');

    return index.builds
        .filter(b => !b.beta)
        .sort((a, b) => compareVersions(b.version, a.version));
}

function setGlobalEnvPath(installPath) {
    if (!process.env.USERNAME || process.env.USERNAME.toLowerCase() !== 'administrator') {
        log('⚠️ This operation may require Administrator privileges.');
    }

    const formattedPath = path.resolve(installPath);

    try {
        const currentPath = execSync(
            'powershell -Command "[Environment]::GetEnvironmentVariable(\'Path\', \'Machine\')"',
            { encoding: 'utf8' }
        ).trim();

        const alreadyExists = currentPath
            .split(';')
            .map(p => p.trim().toLowerCase())
            .includes(formattedPath.toLowerCase());

        if (!alreadyExists) {
            const newPath = `${currentPath};${formattedPath}`;
            execSync(
                `powershell -Command "[Environment]::SetEnvironmentVariable('Path', '${newPath.replace(/'/g, "''")}', 'Machine')"`,
                { stdio: 'inherit' }
            );
            log(`Global PATH updated with: ${formattedPath}`);
        } else {
            log('Install path already exists in global PATH.');
        }
    } catch (err) {
        log('⚠️ Failed to update global PATH. Try running as Administrator.');
    }
}

async function installBuild(version, installPath) {
    const buildDir = path.join(__dirname, 'updates', version);
    if (!fs.existsSync(buildDir)) throw new Error('Build folder missing');

    const files = getFilesRecursive(buildDir);
    if (!fs.existsSync(installPath)) fs.mkdirSync(installPath, { recursive: true });

    for (const file of files) {
        if (file === 'build.json') continue;
        const src = path.join(buildDir, file);
        const dest = path.join(installPath, file);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
        log(`Copied ${file}`);
    }

    setGlobalEnvPath(installPath);
    log(`Build ${version} installed successfully.`);

    cleanup(); // ✅ Call cleanup after everything is done
    return logs;
}

function cleanup() {
    const repoPath = path.join(__dirname, 'updates');
    if (fs.existsSync(repoPath)) {
        try {
            fs.rmSync(repoPath, { recursive: true, force: true });
            log('🧹 Cleaned up temporary files.');
        } catch (err) {
            log('⚠️ Failed to clean up temporary files:', err.message);
        }
    }
}

if (require.main === module) {
    const [version, installPath] = process.argv.slice(2);
    if (!version || !installPath) {
        console.error('Usage: node installer.js <version> <installPath>');
        process.exit(1);
    }
    installBuild(version, installPath);
}

module.exports = {
    getLatestBuilds,
    installBuild,
    logs: () => logs,
    cleanup
};
