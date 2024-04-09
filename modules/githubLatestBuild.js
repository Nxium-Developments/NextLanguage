// githubLatestBuild.js

const fetch = require('node-fetch');

async function getLatestBuildTag(owner, repo) {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);
    if (!response.ok) {
      throw new Error(`Failed to fetch latest release: ${response.statusText}`);
    }
    const data = await response.json();
    return data.tag_name;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// Example usage
async function main() {
  try {
    const owner = 'Nxium-Developments';
    const repo = 'NextLanguage';
    const latestTag = await getLatestBuildTag(owner, repo);
    console.log("Latest build tag:", latestTag);
  } catch (error) {
    console.error("Error:", error);
  }
}

module.exports = { getLatestBuildTag, main };
