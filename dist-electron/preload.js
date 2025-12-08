"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    detectKeyboard: function () { return electron_1.ipcRenderer.invoke('detect-keyboard'); },
    changeColor: function (colorIndex) { return electron_1.ipcRenderer.invoke('change-color', colorIndex); },
    breathingSpeed: function (direction) { return electron_1.ipcRenderer.invoke('breathing-speed', direction); },
    toggleLightStyle: function () { return electron_1.ipcRenderer.invoke('toggle-light-style'); },
});
