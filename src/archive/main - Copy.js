const { app, BrowserWindow, dialog, Menu, ipcMain } = require('electron');
const path = require('node:path');
const { execFile } = require('node:child_process');
const fs = require('fs').promises;
const JSZip = require('jszip');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
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

async function saveToAppDataWithSubdir(subdir, fileName, content) {
  const appDataDir = path.join(app.getPath('userData'), subdir);
  await fs.mkdir(appDataDir, { recursive: true }); // Ensure the subdirectory exists
  const filePath = path.join(appDataDir, fileName);
  await fs.writeFile(filePath, content);
  console.log(`File saved to app data: ${filePath}`);
  return filePath;
}

const openPanxFile = async () => {
  try {
    // Step 1: Open a file dialog to select a .panx file
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'PANX Files', extensions: ['panx'] }],
    });

    if (canceled) {
      return { success: false, message: 'No file selected' };
    }

    // Step 2: Read the selected .panx file
    const fileData = await fs.readFile(filePaths[0]);

    // Step 3: Unzip the file using JSZip
    const zip = await JSZip.loadAsync(fileData);

    // Step 4: Catalog all files and directories
    // const catalog = [];
    // await Promise.all(
    //   Object.keys(zip.files).map(async (relativePath) => {
    //     const entry = zip.files[relativePath];
    //     catalog.push({
    //       path: relativePath, // Full relative path in the ZIP
    //       isDirectory: entry.dir,
    //       size: entry.dir ? 0 : entry._data.uncompressedSize, // File size (0 for directories)
    //       type: entry.dir ? 'directory' : path.extname(relativePath), // File type or 'directory'
    //     });
    //   })
    // );

    // Step 5: Find .pan file
    const panFileEntry = Object.keys(zip.files).find(
      (relativePath) => path.extname(relativePath).toLowerCase() === '.pan'
    );

    if (!panFileEntry) {
      throw new Error(`Pan File not found in the archive.`);
    }

    const panFile = zip.files[panFileEntry];

    const subdir = `session-${Date.now()}`;
    await saveToAppDataWithSubdir(subdir, panFile.name, 'Sample file content');

    return { success: true, panFile };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open .panx File',
          click: async () => {
            await openPanxFile();
          },
        },
        { role: 'quit' },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
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
