const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

// Define the function to create the window
function createWindow() {
  // Create a new browser window
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true // This allows Node.js integration in the renderer process
    }
  });

  // Load the HTML file into the window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../modules/code/html/defaultWeb.html'),
    protocol: 'file:',
    slashes: true
  }));
}

// When Electron has initialized and is ready to create browser windows
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS (due to macOS specific behavior)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// When the application is activated (typically, after closing other windows in macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
