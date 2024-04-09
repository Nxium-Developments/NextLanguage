const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;
let htmlFilePath = path.join(__dirname, './code/html/defaultWeb.html');

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false, // To remove the Electron menu bar
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(url.format({
        pathname: htmlFilePath,
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

// Function to change window icon
function changeIcon(iconPath) {
    if (mainWindow) {
        mainWindow.setIcon(iconPath);
    }
}

// Function to change window title
function changeTitle(title) {
    if (mainWindow) {
        mainWindow.setTitle(title);
    }
}

// Function to change HTML file path
function changeHTMLFilePath(newPath) {
    htmlFilePath = newPath;
    if (mainWindow) {
        mainWindow.loadURL(url.format({
            pathname: htmlFilePath,
            protocol: 'file:',
            slashes: true
        }));
    }
}

module.exports = {
    changeIcon,
    changeTitle,
    changeHTMLFilePath
};
