const fs = require('fs');
const https = require('https');
const path = require('path');
const AdmZip = require('adm-zip');
const { pipeline } = require('stream');
const { promisify } = require('util');

const streamPipeline = promisify(pipeline);

/**
 * Downloads and extracts a ZIP file, then renames the folder.
 * @param {string} url - The URL of the ZIP file.
 * @param {string} outputDir - Directory where the ZIP is downloaded and extracted.
 * @param {string} finalName - The name you want to rename the extracted folder to.
 */
async function downloadAndExtract(url, outputDir, finalName) {
  const zipName = path.basename(url);
  const zipPath = path.join(outputDir, zipName);

  // Download ZIP
  console.log(`Downloading ${zipName}...`);
  await new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode !== 200) {
        reject(new Error(`Download failed. Status code: ${res.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(zipPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => fileStream.close(resolve));
    }).on('error', reject);
  });

  // Extract ZIP
  console.log('Extracting ZIP...');
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(outputDir, true);

  // Find extracted folder
  const extractedFolders = fs.readdirSync(outputDir)
    .filter(name => fs.statSync(path.join(outputDir, name)).isDirectory() && name.includes('node-v'));

  if (extractedFolders.length === 0) throw new Error('Extraction failed: No node folder found.');

  const extractedPath = path.join(outputDir, extractedFolders[0]);
  const finalPath = path.join(outputDir, finalName);

  // Rename folder
  fs.renameSync(extractedPath, finalPath);
  console.log(`Renamed folder to ${finalName}`);

  // Cleanup
  fs.unlinkSync(zipPath);
  console.log('Done.');
}

const args = process.argv.slice(2);
const urlArg = args.find(arg => arg.startsWith('--url='));
const url = urlArg ? urlArg.split('=')[1] : 'https://nodejs.org/dist/v22.16.0/node-v22.16.0-win-x64.zip';

const outputDirArg = args.find(arg => arg.startsWith('--output-dir='));
const outputDir = outputDirArg ? outputDirArg.split('=')[1] : './downloads';

const finalNameArg = args.find(arg => arg.startsWith('--final-name='));
const finalName = finalNameArg ? finalNameArg.split('=')[1] : 'my-node';

// Example usage
(async () => {
  await downloadAndExtract(url, outputDir, finalName);
})();
