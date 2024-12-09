// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onFileOpened: (callback) =>
    ipcRenderer.on('file-opened', (_event, value) => callback(value)),
  isWindowMaximized: () => ipcRenderer.invoke('is-window-maximized'),
  onMaximizeChange: (callback) => {
    ipcRenderer.on('maximize-change', (event, isMaximized) =>
      callback(isMaximized)
    );
  },
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),
  openFile: async () => {
    return await ipcRenderer.invoke('dialog:openFile');
  },
});
