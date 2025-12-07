const { app, BrowserWindow } = require("electron");
const path = require("path");

const isDev = !app.isPackaged;  // <-- reliable dev detection

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  if (isDev) {
    console.log("DEV MODE → Loading Vite URL");
    win.loadURL("http://localhost:5173/");
    win.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, "../dist/index.html");
    console.log("PROD MODE → Loading:", indexPath);
    win.loadFile(indexPath);
  }
}

app.whenReady().then(createWindow);
