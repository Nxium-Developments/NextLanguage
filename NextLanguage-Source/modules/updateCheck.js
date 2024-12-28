// githubLatestBuild.js

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Custom modules
const debugOutput = require('./debugOutput');
const addOutput = require('./addOutput');

async function getLatestBuildTag(owner, repo) {
  /**
   * Fetches the latest release tag from a GitHub repository.
   * @param {string} owner - The owner of the repository (e.g., "Nxium-Developments").
   * @param {string} repo - The name of the repository (e.g., "NextLanguage").
   * @returns {string|null} The latest release tag, or null if an error occurs.
   * @throws {Error} If an error occurs while fetching the latest release tag.
   * @description This function uses the GitHub API to fetch the latest release tag from the specified repository.
   */

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);
    if (!response.ok) {
      throw new Error(`Failed to fetch latest release: ${response.statusText}`);
    }
    const data = await response.json();
    return data.tag_name;
  } catch (error) {
    addOutput(`Error: Failed to fetch latest build tag\n\n Error from GitHub:\n  ${error.message}\n\n  Full stack trace:\n   ${error.stack}\n`);
    return null;
  }
}

// Example usage
module.exports = async function install() {
  /**
   * Example usage of the getLatestBuildTag function.
   * @description This function demonstrates how to use the getLatestBuildTag function to fetch the latest release tag from a GitHub repository.
   * @see getLatestBuildTag
   * @see https://github.com/Nxium-Developments/NextLanguage
   */
  addOutput("Fetching latest build tag...");
  addOutput("GitHub repository: https://github.com/Nxium-Developments/NextLanguage");
  addOutput("-------------------------------");

  try {
    const owner = 'Nxium-Developments';
    const repo = 'NextLanguage';
    const latestTag = await getLatestBuildTag(owner, repo);
    const currentPackage = fs.readFileSync(path.join(__dirname, '../package/current_package'), 'utf-8');
    const buildVersion = currentPackage.split('\nver: Build_').pop().trim().split('\n\r')[0];
    const developmentStatus = currentPackage.split('status: ').pop().trim().split('\r\n')[0];

    debugOutput(`Latest build tag: ${latestTag}`);
    debugOutput(`Current package version: ${buildVersion}`);

    if (developmentStatus === "indev") {
      addOutput("Development build detected. Ignoring latest build.");
      addOutput("-------------------------------");
      // Install the latest development build here
      // Example: npm install --save https://github.com/Nxium-Developments/NextLanguage/releases/download/v${latestTag}/NextLanguage-v${latestTag}.tgz
      return;
    }

    if (latestTag === buildVersion) {
      addOutput("No new build available.");
      addOutput("-------------------------------");
      return;
    } else {
      addOutput("New build available:", latestTag);
      addOutput("-------------------------------");
      // Install the latest build here
      // Example: npm install --save https://github.com/Nxium-Developments/NextLanguage/releases/download/v${latestTag}/NextLanguage-v${latestTag}.tgz
      return;
    }
    
  } catch (error) {
    console.error("Error:", error);
  }
}