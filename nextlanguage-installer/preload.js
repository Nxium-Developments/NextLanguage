const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    getBuilds: () => ipcRenderer.invoke('get-builds'),
    install: (version, installPath) => ipcRenderer.invoke('install', version, installPath),
    getLogs: () => ipcRenderer.invoke('get-logs')
});
