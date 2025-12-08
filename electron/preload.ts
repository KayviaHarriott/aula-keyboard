import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  detectKeyboard: () => ipcRenderer.invoke('detect-keyboard'),
  changeColor: (colorIndex?: number) => ipcRenderer.invoke('change-color', colorIndex),
  breathingSpeed: (direction: 'faster' | 'slower') => ipcRenderer.invoke('breathing-speed', direction),
  toggleLightStyle: () => ipcRenderer.invoke('toggle-light-style'),
});
