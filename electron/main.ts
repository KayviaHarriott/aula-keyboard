import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let HID: any = null;

// Aula F99 Pro USB IDs (from KB.ini)
const AULA_VID = 0x258a;
const AULA_PID = 0x010C;

// Current lighting state
let currentColor = 0;
let currentSpeed = 2;
let currentMode = 0;

// Load node-hid dynamically
async function loadHID() {
  try {
    HID = await import('node-hid');
    console.log('node-hid loaded successfully');
  } catch (error) {
    console.error('Failed to load node-hid:', error);
  }
}

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

app.whenReady().then(async () => {
  await loadHID();
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
    if (!HID) {
      console.error('node-hid not loaded');
      return null;
    }
    const devices = HID.default ? HID.default.devices() : HID.devices();
    const keyboard = devices.find((d: any) => d.vendorId === AULA_VID && d.productId === AULA_PID);
    return keyboard;
  } catch (error) {
    console.error('Error finding keyboard:', error);
    return null;
  }
}

function sendCommandToKeyboard(data: number[]) {
  try {
    if (!HID) {
      return { success: false, error: 'node-hid not loaded' };
    }
    
    const deviceInfo = findAulaKeyboard();
    if (!deviceInfo || !deviceInfo.path) {
      return { success: false, error: 'Keyboard not found' };
    }

    const HIDClass = HID.default ? HID.default.HID : HID.HID;
    const device = new HIDClass(deviceInfo.path);
    
    // Prepare the command packet (typically 64 bytes for HID)
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

// IPC Handlers for keyboard control using USB HID

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

// Change keyboard color using USB commands
// Based on common mechanical keyboard protocols
ipcMain.handle('change-color', async () => {
  try {
    // Cycle to next color
    currentColor = (currentColor + 1) % 7; // 7 colors: Red, Green, Blue, Yellow, Cyan, Magenta, White
    
    // Standard color command format for mechanical keyboards
    // Header: 0x07, Command: 0x02 (set color), Color index, Footer
    const command = [
      0x07,          // Report ID / Header
      0x02,          // Command: Set Color
      0x03,          // Sub-command
      currentColor,  // Color index
      0x00, 0x00, 0x00, 0x00 // Padding
    ];
    
    const result = sendCommandToKeyboard(command);
    if (result.success) {
      return { success: true, message: `Color changed to ${['Red', 'Green', 'Blue', 'Yellow', 'Cyan', 'Magenta', 'White'][currentColor]}` };
    } else {
      return result;
    }
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

// Breathing effect speed control
ipcMain.handle('breathing-speed', async (_event, direction: 'faster' | 'slower') => {
  try {
    if (direction === 'faster') {
      currentSpeed = Math.min(currentSpeed + 1, 4); // Max speed 4
    } else {
      currentSpeed = Math.max(currentSpeed - 1, 0); // Min speed 0
    }
    
    // Standard speed command for mechanical keyboards
    const command = [
      0x07,          // Report ID / Header
      0x03,          // Command: Set Speed
      0x02,          // Sub-command
      currentSpeed,  // Speed value
      0x00, 0x00, 0x00, 0x00 // Padding
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

// Toggle light style/mode
ipcMain.handle('toggle-light-style', async () => {
  try {
    // Cycle through lighting modes
    // Modes: 0=Static, 1=Breathing, 2=Wave, 3=Rainbow, 4=Reactive, etc.
    currentMode = (currentMode + 1) % 18; // 18 modes based on KB.ini LedOpt entries
    
    // Standard mode command
    const command = [
      0x07,         // Report ID / Header
      0x04,         // Command: Set Mode
      0x01,         // Sub-command
      currentMode,  // Mode index
      currentSpeed, // Speed
      currentColor, // Color
      0x00, 0x00    // Padding
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
