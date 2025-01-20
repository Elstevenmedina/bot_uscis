const { app, BrowserWindow } = require('electron');
const path = require('path');
const { autoUpdater, AppUpdater } = require('electron-updater');

const server = require('./index');

let mainWindow;

autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

app.on('ready', () => {
  
    mainWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: false, 
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'), 
      },
      icon: path.join(__dirname, 'assets', 'logo.ico')
    });
  
    mainWindow.maximize();
    mainWindow.show();
  
    const serverPort = server.address().port || 3000;
    mainWindow.loadURL(`http://localhost:${serverPort}`);
  
    autoUpdater.checkForUpdates();

    if(autoUpdater.isUpdateAvailable){
      autoUpdater.downloadUpdate();
    }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
