const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const HID = require('node-hid');

let mainWindow = null;

// Aula F99 Pro USB IDs
const AULA_VID = 0x258a;
const AULA_PID = 0x010C;

// Current lighting state
let currentColor = 0;
let currentSpeed = 2;
let currentMode = 0;

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

  // Load the app from Vite dev server
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  
  if (isDev) {
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

// Helper functions for USB communication
function findAulaKeyboard() {
  try {
    const devices = HID.devices();
    const keyboard = devices.find(d => d.vendorId === AULA_VID && d.productId === AULA_PID);
    return keyboard;
  } catch (error) {
    console.error('Error finding keyboard:', error);
    return null;
  }
}

function sendCommandToKeyboard(data) {
  try {
    const deviceInfo = findAulaKeyboard();
    if (!deviceInfo || !deviceInfo.path) {
      return { success: false, error: 'Keyboard not found' };
    }

    const device = new HID.HID(deviceInfo.path);
    
    // Prepare the command packet (64 bytes for HID)
    const packet = new Array(64).fill(0);
    data.forEach((byte, index) => {
      if (index < packet.length) {
        packet[index] = byte;
      }
    });

    device.write(packet);
    device.close();
    
    return { success: true };
  } catch (error) {
    console.error('Error sending command:', error);
    return { success: false, error: String(error) };
  }
}

// IPC Handlers

// Detect keyboard
ipcMain.handle('detect-keyboard', async () => {
  try {
    const keyboard = findAulaKeyboard();
    if (keyboard) {
      return { 
        success: true, 
        keyboard: {
          manufacturer: keyboard.manufacturer,
          product: keyboard.product,
          vendorId: keyboard.vendorId,
          productId: keyboard.productId
        }
      };
    } else {
      return { success: false, error: 'Aula F99 Pro keyboard not found. Make sure it\'s connected.' };
    }
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

// Change color
ipcMain.handle('change-color', async () => {
  try {
    currentColor = (currentColor + 1) % 7;
    
    const command = [
      0x07, 0x02, 0x03, currentColor,
      0x00, 0x00, 0x00, 0x00
    ];
    
    const result = sendCommandToKeyboard(command);
    if (result.success) {
      const colors = ['Red', 'Green', 'Blue', 'Yellow', 'Cyan', 'Magenta', 'White'];
      return { success: true, message: `Color changed to ${colors[currentColor]}` };
    } else {
      return result;
    }
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

// Breathing speed
ipcMain.handle('breathing-speed', async (_event, direction) => {
  try {
    if (direction === 'faster') {
      currentSpeed = Math.min(currentSpeed + 1, 4);
    } else {
      currentSpeed = Math.max(currentSpeed - 1, 0);
    }
    
    const command = [
      0x07, 0x03, 0x02, currentSpeed,
      0x00, 0x00, 0x00, 0x00
    ];
    
    const result = sendCommandToKeyboard(command);
    if (result.success) {
      return { success: true, message: `Breathing speed ${direction}: Level ${currentSpeed}` };
    } else {
      return result;
    }
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

// Toggle light style
ipcMain.handle('toggle-light-style', async () => {
  try {
    currentMode = (currentMode + 1) % 18;
    
    const command = [
      0x07, 0x04, 0x01, currentMode,
      currentSpeed, currentColor, 0x00, 0x00
    ];
    
    const modeNames = ['Static', 'Breathing', 'Wave', 'Rainbow', 'Reactive', 'Ripple', 'Neon', 'Starry', 'Laser', 'Raindrop', 'Custom 1', 'Custom 2', 'Custom 3', 'Custom 4', 'Custom 5', 'Custom 6', 'Custom 7', 'Custom 8'];
    
    const result = sendCommandToKeyboard(command);
    if (result.success) {
      return { success: true, message: `Mode: ${modeNames[currentMode] || `Mode ${currentMode}`}` };
    } else {
      return result;
    }
  } catch (error) {
    return { success: false, error: String(error) };
  }
});
