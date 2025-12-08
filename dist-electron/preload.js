import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("electronAPI", {
  readConfig: () => ipcRenderer.invoke("read-config"),
  writeConfig: (content) => ipcRenderer.invoke("write-config", content),
  changeColor: (colorIndex) => ipcRenderer.invoke("change-color", colorIndex),
  breathingSpeed: (direction) => ipcRenderer.invoke("breathing-speed", direction),
  toggleLightStyle: () => ipcRenderer.invoke("toggle-light-style")
});
