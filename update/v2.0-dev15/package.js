const fs = require('fs');
const path = require('path');

let configPath = path.join(__dirname, 'config.json');
let updateRoot = path.join(__dirname, 'updates');

function readConfig() {
  try {
    const content = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('❌ Failed to read config.json:', err);
    return null;
  }
}

function getLatestUpdateDir() {
  const updateVersion = readConfig().update_info.version;
  const updateDir = path.join(updateRoot, updateVersion);
  return updateDir;
}

function stopRunningBinary(tempName) {
  try {
    const baseName = tempName.replace('_old', '');
    if (fs.existsSync(baseName)) {
      fs.renameSync(baseName, tempName);
    }
  } catch (err) {
    console.error(`❌ Could not safely move ${tempName}:`, err);
    throw err;
  }
}

function applyUpdate(latestDir) {
  if (!fs.existsSync(configPath)) {
    console.error(`❌ config.json not found at ${configPath}`);
    process.exit(1);
  }

  const buildData = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  if (buildData.update_available !== true) {
    console.log('❌ No update available');
    process.exit(0);
  }

  const binaries = buildData.update_info.binaries || [];
  const memoryBinaries = buildData.update_info.binary_data || {}; // optional: { "binaryName": base64String }

  if (binaries.length === 0) {
    console.error('❌ No binaries listed in config.json');
    process.exit(1);
  }

  try {
    binaries.forEach(bin => {
      const destPath = path.join(__dirname, bin);
      stopRunningBinary(bin + '_old'); // Make sure old version is moved

      if (memoryBinaries[bin]) {
        const binaryBuffer = Buffer.from(memoryBinaries[bin], 'base64');
        fs.writeFileSync(destPath, binaryBuffer);
        console.log(`✅ Updated ${bin} from embedded binary data`);
      } else {
        const srcPath = path.join(latestDir, bin);
        if (!fs.existsSync(srcPath)) {
          console.error(`❌ Binary file missing: ${srcPath}`);
          return;
        }

        fs.copyFileSync(srcPath, destPath);
        console.log(`✅ Copied ${bin} from update folder`);
      }

      fs.chmodSync(destPath, 0o755);
    });

    console.log(`✅ All binaries updated to version ${latestDir}`);
  } catch (err) {
    console.error('❌ Failed to apply update:', err);
    process.exit(1);
  }
}

function updateConfig(version) {
  const config = readConfig();
  if (!config) return;

  config.last_updated = new Date().toISOString();
  config.update_available = false;
  config.build_version = version;

  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('📝 Config updated.');
  } catch (err) {
    console.error('❌ Failed to update config.json:', err);
  }
}

// Main
console.log('Applying update to version...');
const updateDir = getLatestUpdateDir();
const args = process.argv.slice(2);
const baseDirArg = args.find(arg => arg.startsWith('--base-dir='));
const baseDir = baseDirArg ? baseDirArg.split('=')[1].replace('\\package.js', '') : process.cwd();

configPath = path.join(baseDir, 'config.json');
updateRoot = path.join(baseDir, 'updates');

if (!updateDir) {
  console.log('❌ No update directory found.');
  process.exit(1);
}

applyUpdate(updateDir);
updateConfig(readConfig().update_info.version);
