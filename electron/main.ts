import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let mainWindow: BrowserWindow | null = null;

// Path to cfg.ini file
const CFG_PATH = path.join(__dirname, '../resources/cfg.ini');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers for keyboard control

// Read cfg.ini file
ipcMain.handle('read-config', async () => {
  try {
    if (fs.existsSync(CFG_PATH)) {
      const content = fs.readFileSync(CFG_PATH, 'utf-8');
      return { success: true, data: content };
    } else {
      return { success: false, error: 'Config file not found' };
    }
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

// Write to cfg.ini file
ipcMain.handle('write-config', async (_event, content: string) => {
  try {
    const dir = path.dirname(CFG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CFG_PATH, content, 'utf-8');
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

// Change keyboard color
ipcMain.handle('change-color', async (_event, colorIndex?: number) => {
  try {
    // Read current config
    const configContent = fs.readFileSync(CFG_PATH, 'utf-8');
    const lines = configContent.split('\n');
    
    // Parse and modify color settings
    let modified = false;
    const newLines = lines.map(line => {
      // Look for color-related settings in cfg.ini
      if (line.includes('color') || line.includes('Color') || line.includes('rgb')) {
        modified = true;
        // If colorIndex is provided, set specific color
        if (colorIndex !== undefined) {
          return line.replace(/=\s*\d+/, `=${colorIndex}`);
        }
        // Otherwise cycle to next color
        const match = line.match(/=\s*(\d+)/);
        if (match) {
          const currentValue = parseInt(match[1]);
          const nextValue = (currentValue + 1) % 16; // Assuming 16 colors
          return line.replace(/=\s*\d+/, `=${nextValue}`);
        }
      }
      return line;
    });

    if (modified) {
      fs.writeFileSync(CFG_PATH, newLines.join('\n'), 'utf-8');
      return { success: true, message: 'Color changed' };
    } else {
      return { success: false, error: 'No color setting found in config' };
    }
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

// Breathing effect speed
ipcMain.handle('breathing-speed', async (_event, direction: 'faster' | 'slower') => {
  try {
    const configContent = fs.readFileSync(CFG_PATH, 'utf-8');
    const lines = configContent.split('\n');
    
    let modified = false;
    const newLines = lines.map(line => {
      // Look for breathing/speed settings
      if (line.includes('breath') || line.includes('speed') || line.includes('Speed')) {
        modified = true;
        const match = line.match(/=\s*(\d+)/);
        if (match) {
          let currentValue = parseInt(match[1]);
          if (direction === 'faster') {
            currentValue = Math.min(currentValue + 1, 10); // Max speed 10
          } else {
            currentValue = Math.max(currentValue - 1, 1); // Min speed 1
          }
          return line.replace(/=\s*\d+/, `=${currentValue}`);
        }
      }
      return line;
    });

    if (modified) {
      fs.writeFileSync(CFG_PATH, newLines.join('\n'), 'utf-8');
      return { success: true, message: `Breathing ${direction}` };
    } else {
      return { success: false, error: 'No breathing setting found in config' };
    }
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

// Toggle light style
ipcMain.handle('toggle-light-style', async () => {
  try {
    const configContent = fs.readFileSync(CFG_PATH, 'utf-8');
    const lines = configContent.split('\n');
    
    let modified = false;
    const newLines = lines.map(line => {
      // Look for light mode/style settings
      if (line.includes('mode') || line.includes('style') || line.includes('effect')) {
        modified = true;
        const match = line.match(/=\s*(\d+)/);
        if (match) {
          const currentValue = parseInt(match[1]);
          const nextValue = (currentValue + 1) % 8; // Assuming 8 different styles
          return line.replace(/=\s*\d+/, `=${nextValue}`);
        }
      }
      return line;
    });

    if (modified) {
      fs.writeFileSync(CFG_PATH, newLines.join('\n'), 'utf-8');
      return { success: true, message: 'Light style toggled' };
    } else {
      return { success: false, error: 'No style setting found in config' };
    }
  } catch (error) {
    return { success: false, error: String(error) };
  }
});
