import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as fs from "fs";
let mainWindow = null;
const CFG_PATH = path.join(__dirname, "../resources/cfg.ini");
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
ipcMain.handle("read-config", async () => {
  try {
    if (fs.existsSync(CFG_PATH)) {
      const content = fs.readFileSync(CFG_PATH, "utf-8");
      return { success: true, data: content };
    } else {
      return { success: false, error: "Config file not found" };
    }
  } catch (error) {
    return { success: false, error: String(error) };
  }
});
ipcMain.handle("write-config", async (_event, content) => {
  try {
    const dir = path.dirname(CFG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CFG_PATH, content, "utf-8");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
});
ipcMain.handle("change-color", async (_event, colorIndex) => {
  try {
    const configContent = fs.readFileSync(CFG_PATH, "utf-8");
    const lines = configContent.split("\n");
    let modified = false;
    const newLines = lines.map((line) => {
      if (line.includes("color") || line.includes("Color") || line.includes("rgb")) {
        modified = true;
        if (colorIndex !== void 0) {
          return line.replace(/=\s*\d+/, `=${colorIndex}`);
        }
        const match = line.match(/=\s*(\d+)/);
        if (match) {
          const currentValue = parseInt(match[1]);
          const nextValue = (currentValue + 1) % 16;
          return line.replace(/=\s*\d+/, `=${nextValue}`);
        }
      }
      return line;
    });
    if (modified) {
      fs.writeFileSync(CFG_PATH, newLines.join("\n"), "utf-8");
      return { success: true, message: "Color changed" };
    } else {
      return { success: false, error: "No color setting found in config" };
    }
  } catch (error) {
    return { success: false, error: String(error) };
  }
});
ipcMain.handle("breathing-speed", async (_event, direction) => {
  try {
    const configContent = fs.readFileSync(CFG_PATH, "utf-8");
    const lines = configContent.split("\n");
    let modified = false;
    const newLines = lines.map((line) => {
      if (line.includes("breath") || line.includes("speed") || line.includes("Speed")) {
        modified = true;
        const match = line.match(/=\s*(\d+)/);
        if (match) {
          let currentValue = parseInt(match[1]);
          if (direction === "faster") {
            currentValue = Math.min(currentValue + 1, 10);
          } else {
            currentValue = Math.max(currentValue - 1, 1);
          }
          return line.replace(/=\s*\d+/, `=${currentValue}`);
        }
      }
      return line;
    });
    if (modified) {
      fs.writeFileSync(CFG_PATH, newLines.join("\n"), "utf-8");
      return { success: true, message: `Breathing ${direction}` };
    } else {
      return { success: false, error: "No breathing setting found in config" };
    }
  } catch (error) {
    return { success: false, error: String(error) };
  }
});
ipcMain.handle("toggle-light-style", async () => {
  try {
    const configContent = fs.readFileSync(CFG_PATH, "utf-8");
    const lines = configContent.split("\n");
    let modified = false;
    const newLines = lines.map((line) => {
      if (line.includes("mode") || line.includes("style") || line.includes("effect")) {
        modified = true;
        const match = line.match(/=\s*(\d+)/);
        if (match) {
          const currentValue = parseInt(match[1]);
          const nextValue = (currentValue + 1) % 8;
          return line.replace(/=\s*\d+/, `=${nextValue}`);
        }
      }
      return line;
    });
    if (modified) {
      fs.writeFileSync(CFG_PATH, newLines.join("\n"), "utf-8");
      return { success: true, message: "Light style toggled" };
    } else {
      return { success: false, error: "No style setting found in config" };
    }
  } catch (error) {
    return { success: false, error: String(error) };
  }
});
