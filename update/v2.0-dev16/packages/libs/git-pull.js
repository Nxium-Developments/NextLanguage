const fs = require('fs');
const path = require('path');
const { simpleGit } = require('simple-git');

async function pull(repository = 'https://github.com/Nxium-Developments/NextLanguage.git', destination = path.join(__dirname, 'additionals'), params = {
    '--branch': 'updates',
    '--depth': '1'
}) {
    const repoPath = path.join(__dirname, destination);
    if (fs.existsSync(repoPath)) fs.rmSync(repoPath, { recursive: true, force: true });

    await simpleGit().clone(repository, repoPath, {
        ...params,
    });
}

const args = process.argv.slice(2);
const repositoryArg = args.find(arg => arg.startsWith('--repository='));
const repository = repositoryArg ? repositoryArg.split('=')[1] : 'https://github.com/Nxium-Developments/NextLanguage.git';

const destinationArg = args.find(arg => arg.startsWith('--destination='));
const destination = destinationArg ? destinationArg.split('=')[1] : path.join(__dirname, 'additionals');

const paramsArg = args.find(arg => arg.startsWith('--params='));
const params = paramsArg ? JSON.parse(paramsArg.split('=')[1]) : {
    '--branch': 'updates',
    '--depth': '1'
};
pull(repository, destination, params);