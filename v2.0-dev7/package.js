const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.json');
const updateRoot = path.join(__dirname, 'updates');

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
  try {
    const dirs = fs.readdirSync(updateRoot, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(dir => dir.name)
      .sort()
      .reverse(); // latest first
    return dirs[0] || null;
  } catch (err) {
    console.error('❌ Failed to read updates directory:', err);
    return null;
  }
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
  const buildJsonPath = path.join(updateRoot, latestDir, 'build.json');
  if (!fs.existsSync(buildJsonPath)) {
    console.error(`❌ build.json not found at ${buildJsonPath}`);
    process.exit(1);
  }

  const buildData = JSON.parse(fs.readFileSync(buildJsonPath, 'utf8'));
  const binaries = buildData.binaries || [];
  const memoryBinaries = buildData.binary_data || {}; // optional: { "binaryName": base64String }

  if (binaries.length === 0) {
    console.error('❌ No binaries listed in build.json');
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
        const srcPath = path.join(updateRoot, latestDir, bin);
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

function cleanupUpdates() {
    exec('node cleanup.js --cleanup', (err, stdout, stderr) => {
      if (err) {
        console.error('❌ Failed to cleanup updates:', err);
      } else {
        console.log('✅ Updates cleaned up.');
      }
    });
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

if (!updateDir) {
  console.log('❌ No update directory found.');
  process.exit(1);
}

applyUpdate(updateDir);
updateConfig(updateDir);
// cleanupUpdates();
