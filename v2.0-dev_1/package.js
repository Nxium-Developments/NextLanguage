const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const configPath = path.join(__dirname, 'config.json');
const updateRoot = path.join(__dirname, 'updates');
const binaryName = 'nextlang'; // Adjust as needed for platform

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

function stopRunningBinary(tempName = `${binaryName}_old`) {
  try {
    // Rename the old binary instead of deleting it immediately
    if (fs.existsSync(binaryName)) {
      fs.renameSync(binaryName, tempName);
    }
  } catch (err) {
    console.error(`❌ Could not safely move ${binaryName}:`, err);
    throw err;
  }
}

function applyUpdate(latestDir) {
  const srcPath = path.join(updateRoot, latestDir, binaryName);
  const destPath = path.join(__dirname, binaryName);

  if (!fs.existsSync(srcPath)) {
    console.error(`❌ Update binary not found at ${srcPath}`);
    process.exit(1);
  }

  try {
    stopRunningBinary(); // Avoid ETXTBSY

    fs.copyFileSync(srcPath, destPath);
    fs.chmodSync(destPath, 0o755);
    console.log(`✅ Updated to version ${latestDir}`);
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

if (!updateDir) {
  console.log('❌ No update directory found.');
  process.exit(1);
}

applyUpdate(updateDir);
updateConfig(updateDir);
