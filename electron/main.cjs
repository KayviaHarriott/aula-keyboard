const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const HID = require('node-hid');

let mainWindow = null;

// Aula F99 Pro USB IDs
// Note: Your specific keyboard variant uses these IDs
const AULA_VID = 0x258a;
const AULA_PID = 0x010c;

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
    
    // Find all Aula keyboards
    const keyboards = devices.filter(d => d.vendorId === AULA_VID && d.productId === AULA_PID);
    
    if (keyboards.length === 0) {
      return null;
    }
    
    // On macOS/Linux, keyboards have multiple interfaces
    // We want the one that supports Feature Reports (usually interface 0 or usage page 0xFF00)
    // Try to find the right interface:
    
    // 1. Prefer interface with usagePage 0xFF00 or 0xFF01 (vendor-specific)
    let keyboard = keyboards.find(d => d.usagePage === 0xFF00 || d.usagePage === 0xFF01);
    
    // 2. Fall back to interface 0
    if (!keyboard) {
      keyboard = keyboards.find(d => d.interface === 0);
    }
    
    // 3. Fall back to first device
    if (!keyboard) {
      keyboard = keyboards[0];
    }
    
    console.log('Selected keyboard interface:', {
      interface: keyboard.interface,
      usagePage: '0x' + (keyboard.usagePage || 0).toString(16),
      usage: '0x' + (keyboard.usage || 0).toString(16),
      path: keyboard.path
    });
    
    return keyboard;
  } catch (error) {
    console.error('Error finding keyboard:', error);
    return null;
  }
}

function calculateCRC(data) {
  // Simple XOR checksum as per Aula protocol
  let crc = 0;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
  }
  return crc;
}

function sendCommandToKeyboard(data) {
  try {
    const deviceInfo = findAulaKeyboard();
    if (!deviceInfo) {
      return { success: false, error: 'Keyboard not found' };
    }

    // macOS fix: Open by VID/PID instead of path
    // macOS uses special paths like "DevSrvsID:xxx" which node-hid can't open directly
    let device;
    try {
      // Try opening by path first (works on Windows/Linux)
      if (deviceInfo.path && !deviceInfo.path.includes('DevSrvsID')) {
        console.log('Opening by path:', deviceInfo.path);
        device = new HID.HID(deviceInfo.path);
      } else {
        // macOS: Open by VID/PID
        console.log('Opening by VID/PID:', '0x' + AULA_VID.toString(16), '0x' + AULA_PID.toString(16));
        device = new HID.HID(AULA_VID, AULA_PID);
      }
    } catch (err) {
      // Fallback: Try by VID/PID
      console.log('Fallback: Opening by VID/PID after error:', err.message);
      device = new HID.HID(AULA_VID, AULA_PID);
    }
    
    console.log('✅ Device opened successfully!');
    
    // Build packet based on KB.ini protocol structure
    // Psd=3,0,0,0,0,9A means: [reportId=3, 0x00, 0x00, 0x00, 0x00, 0x9A, ...payload, CRC]
    const packet = new Array(64).fill(0);
    
    // Header from KB.ini
    packet[0] = 0x03;  // Report ID (from Psd line)
    packet[1] = 0x00;
    packet[2] = 0x00;
    packet[3] = 0x00;
    packet[4] = 0x00;
    packet[5] = 0x9A;  // Protocol signature
    
    // Insert command data starting at position 6
    data.forEach((byte, index) => {
      if (index + 6 < packet.length - 1) {  // Leave last byte for CRC
        packet[index + 6] = byte;
      }
    });
    
    // Calculate and add CRC at the end (as per CRC=1 in KB.ini)
    const dataForCRC = packet.slice(0, 63);
    packet[63] = calculateCRC(dataForCRC);
    
    // Use sendFeatureReport instead of write (as per HidD_SetFeature in OemDrv.exe)
    device.sendFeatureReport(packet);
    device.close();
    
    console.log('Sent packet:', packet.slice(0, 20).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' '));
    
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

// Change color (Fn + End)
ipcMain.handle('change-color', async () => {
  try {
    currentColor = (currentColor + 1) % 7;
    
    // Based on KB.ini LedOpt structure: effect, speed, light, direction, random, color
    // Command format: [CMD, SUBCMD, EFFECT_ID, COLOR, SPEED, BRIGHTNESS, ...]
    const command = [
      0x0E,           // LED command type
      0x01,           // Set color subcommand
      currentMode,    // Current effect mode
      currentColor,   // RGB color index (0-6)
      currentSpeed,   // Speed level (0-4)
      0x04,           // Brightness level (max)
      0x00, 0x00      // Padding
    ];
    
    const result = sendCommandToKeyboard(command);
    if (result.success) {
      const colors = ['Red', 'Green', 'Blue', 'Yellow', 'Cyan', 'Magenta', 'White'];
      return { success: true, message: `✅ Color: ${colors[currentColor]}` };
    } else {
      return result;
    }
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

// Breathing speed (Fn + Left/Right Arrow)
ipcMain.handle('breathing-speed', async (_event, direction) => {
  try {
    if (direction === 'faster') {
      currentSpeed = Math.min(currentSpeed + 1, 4);
    } else {
      currentSpeed = Math.max(currentSpeed - 1, 0);
    }
    
    // Update speed while keeping current color and mode
    // Based on KB.ini: Speed=0,1,2,3,4 (5 levels)
    const command = [
      0x0E,           // LED command type
      0x02,           // Set speed subcommand
      currentMode,    // Current effect mode
      currentColor,   // Keep current color
      currentSpeed,   // New speed level (0-4)
      0x04,           // Brightness
      0x00, 0x00      // Padding
    ];
    
    const result = sendCommandToKeyboard(command);
    if (result.success) {
      const speedNames = ['Very Slow', 'Slow', 'Medium', 'Fast', 'Very Fast'];
      return { success: true, message: `✅ Speed: ${speedNames[currentSpeed]} (${currentSpeed}/4)` };
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
    
    // Based on KB.ini LedOpt1-LedOpt18 (18 modes)
    // LedOpt format: effect, hw_effect, speed_enabled, light_enabled, direction, random, color_enabled
    const command = [
      0x0E,           // LED command type
      0x03,           // Set mode subcommand
      currentMode,    // Mode ID (0-17, maps to LedOpt1-LedOpt18)
      currentColor,   // Color
      currentSpeed,   // Speed
      0x04,           // Brightness
      0x01,           // Direction (forward)
      0x00            // Padding
    ];
    
    // Mode names based on KB.ini LedOpt comments
    const modeNames = [
      'Static', 'Breathing', 'Wave', 'Reactive', 'Ripple',
      'Rainbow Wave', 'Neon', 'Starry', 'Laser', 'Raindrop',
      'Gradient', 'Flash', 'Trigger', 'Fire', 'Aurora',
      'Custom 1', 'Custom 2', 'Custom 3'
    ];
    
    const result = sendCommandToKeyboard(command);
    if (result.success) {
      return { success: true, message: `✅ Mode: ${modeNames[currentMode]}` };
    } else {
      return result;
    }
  } catch (error) {
    return { success: false, error: String(error) };
  }
});
