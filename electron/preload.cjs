const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script loading...');

// Expose electronAPI to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  detectKeyboard: () => {
    console.log('Preload: detectKeyboard called');
    return ipcRenderer.invoke('detect-keyboard');
  },
  changeColor: (colorIndex) => {
    console.log('Preload: changeColor called');
    return ipcRenderer.invoke('change-color', colorIndex);
  },
  breathingSpeed: (direction) => {
    console.log('Preload: breathingSpeed called with direction:', direction);
    return ipcRenderer.invoke('breathing-speed', direction);
  },
  toggleLightStyle: () => {
    console.log('Preload: toggleLightStyle called');
    return ipcRenderer.invoke('toggle-light-style');
  },
});

console.log('✅ electronAPI exposed to window object');
