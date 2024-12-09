const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { ipcMain } = require('electron');

import { createAppDataFolder } from './modules/AppDataFolder.js';
import { extractPanxToAppData } from './modules/PanX.js';
import unicornIcon from './assets/unicorn2.ico';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;
let appDataDir;

// Determine the base path for the supporting files
const isDev = !app.isPackaged;
const pfuDir = isDev
  ? path.join(__dirname, './pfu') // Development path
  : path.join(process.resourcesPath, 'pfu'); // Production path
console.log(pfuDir);
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    frame: false,
    icon: path.join(__dirname, unicornIcon),
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  try {
    const appName = 'MyElectronApp'; // Replace with your app's name
    appDataDir = await createAppDataFolder(app);

    console.log(`App data folder path: ${appDataDir}`);
  } catch (error) {
    console.error(`Error creating app data folder: ${error.message}`);
  }

  createWindow();

  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open .panx File',
          click: async () => {
            await extractPanxToAppData(pfuDir, appDataDir);
          },
        },
        { role: 'quit' },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(menuTemplate);
  // Menu.setApplicationMenu(menu);

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Send initial maximize state
  ipcMain.handle('is-window-maximized', () => mainWindow.isMaximized());

  // Listen for file dialog requests from renderer
  ipcMain.handle('dialog:openFile', async () => {
    const result = await extractPanxToAppData(pfuDir, appDataDir);
    // console.log(result);

    // Return the selected file path or undefined if canceled
    return result;
  });

  // Notify renderer on maximize or unmaximize
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('maximize-change', true);
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('maximize-change', false);
  });

  // Window control events
  ipcMain.on('minimize-window', () => mainWindow.minimize());
  ipcMain.on('maximize-window', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });
  ipcMain.on('close-window', () => mainWindow.close());
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
