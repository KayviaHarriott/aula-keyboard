const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("keyboard", {
  pressFnEnd: () => ipcRenderer.invoke("keyboard:fnEnd"),
});
