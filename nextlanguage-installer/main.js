const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const installer = require('./installer');
const sudo = require('sudo-prompt');

const options = {
    name: 'NextLanguage Installer'
};

async function ensureAdminPrivileges() {
    const isElevated = await (await import('is-elevated')).default(); // Optional but useful
    if (!isElevated) {
        const execPath = process.execPath;
        sudo.exec(`"${execPath}"`, options, (error, stdout, stderr) => {
            if (error) {
                console.error('Elevation failed:', error);
                app.quit();
            } else {
                app.quit(); // Quit the current unelevated instance
            }
        });
        return false;
    }
    return true;
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true
        },
        icon: path.join(__dirname, 'icon.ico'),
        title: 'NextLanguage Installer',
        autoHideMenuBar: true
    });

    win.loadFile(path.join(__dirname, 'views', 'index.html'));
}

const portableDataPath = path.join(process.cwd(), 'user_data');
app.setPath('userData', portableDataPath);

app.whenReady().then(async () => {
    const hasAdmin = await ensureAdminPrivileges();
    if (hasAdmin) createWindow();
});

ipcMain.handle('get-builds', installer.getLatestBuilds);
ipcMain.handle('install', async (event, version, installPath) => {
    return await installer.installBuild(version, installPath);
});
ipcMain.handle('get-logs', () => installer.logs());

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
