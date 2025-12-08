import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("electronAPI", {
  detectKeyboard: () => ipcRenderer.invoke("detect-keyboard"),
  changeColor: (colorIndex) => ipcRenderer.invoke("change-color", colorIndex),
  breathingSpeed: (direction) => ipcRenderer.invoke("breathing-speed", direction),
  toggleLightStyle: () => ipcRenderer.invoke("toggle-light-style")
});
