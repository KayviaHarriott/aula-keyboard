"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = __importStar(require("path"));
var url_1 = require("url");
var path_1 = require("path");
// ES module equivalent of __dirname
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = (0, path_1.dirname)(__filename);
var mainWindow = null;
var HID = null;
// Aula F99 Pro USB IDs (from KB.ini)
var AULA_VID = 0x1a2c;
var AULA_PID = 0x4b64;
// Current lighting state
var currentColor = 0;
var currentSpeed = 2;
var currentMode = 0;
// Load node-hid dynamically
function loadHID() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('node-hid')); })];
                case 1:
                    HID = _a.sent();
                    console.log('node-hid loaded successfully');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Failed to load node-hid:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
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
    }
    else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}
electron_1.app.whenReady().then(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, loadHID()];
            case 1:
                _a.sent();
                createWindow();
                electron_1.app.on('activate', function () {
                    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
                        createWindow();
                    }
                });
                return [2 /*return*/];
        }
    });
}); });
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
// Helper functions for USB communication
function findAulaKeyboard() {
    try {
        if (!HID) {
            console.error('node-hid not loaded');
            return null;
        }
        var devices = HID.default ? HID.default.devices() : HID.devices();
        var keyboard = devices.find(function (d) { return d.vendorId === AULA_VID && d.productId === AULA_PID; });
        return keyboard;
    }
    catch (error) {
        console.error('Error finding keyboard:', error);
        return null;
    }
}
function sendCommandToKeyboard(data) {
    try {
        if (!HID) {
            return { success: false, error: 'node-hid not loaded' };
        }
        var deviceInfo = findAulaKeyboard();
        if (!deviceInfo || !deviceInfo.path) {
            return { success: false, error: 'Keyboard not found' };
        }
        var HIDClass = HID.default ? HID.default.HID : HID.HID;
        var device = new HIDClass(deviceInfo.path);
        // Prepare the command packet (typically 64 bytes for HID)
        var packet_1 = new Array(64).fill(0);
        data.forEach(function (byte, index) {
            if (index < packet_1.length) {
                packet_1[index] = byte;
            }
        });
        device.write(packet_1);
        device.close();
        return { success: true };
    }
    catch (error) {
        console.error('Error sending command:', error);
        return { success: false, error: String(error) };
    }
}
// IPC Handlers for keyboard control using USB HID
// Detect keyboard
electron_1.ipcMain.handle('detect-keyboard', function () { return __awaiter(void 0, void 0, void 0, function () {
    var keyboard;
    return __generator(this, function (_a) {
        try {
            keyboard = findAulaKeyboard();
            if (keyboard) {
                return [2 /*return*/, {
                        success: true,
                        keyboard: {
                            manufacturer: keyboard.manufacturer,
                            product: keyboard.product,
                            vendorId: keyboard.vendorId,
                            productId: keyboard.productId
                        }
                    }];
            }
            else {
                return [2 /*return*/, { success: false, error: 'Aula F99 Pro keyboard not found. Make sure it\'s connected.' }];
            }
        }
        catch (error) {
            return [2 /*return*/, { success: false, error: String(error) }];
        }
        return [2 /*return*/];
    });
}); });
// Change keyboard color using USB commands
// Based on common mechanical keyboard protocols
electron_1.ipcMain.handle('change-color', function () { return __awaiter(void 0, void 0, void 0, function () {
    var command, result;
    return __generator(this, function (_a) {
        try {
            // Cycle to next color
            currentColor = (currentColor + 1) % 7; // 7 colors: Red, Green, Blue, Yellow, Cyan, Magenta, White
            command = [
                0x07, // Report ID / Header
                0x02, // Command: Set Color
                0x03, // Sub-command
                currentColor, // Color index
                0x00, 0x00, 0x00, 0x00 // Padding
            ];
            result = sendCommandToKeyboard(command);
            if (result.success) {
                return [2 /*return*/, { success: true, message: "Color changed to ".concat(['Red', 'Green', 'Blue', 'Yellow', 'Cyan', 'Magenta', 'White'][currentColor]) }];
            }
            else {
                return [2 /*return*/, result];
            }
        }
        catch (error) {
            return [2 /*return*/, { success: false, error: String(error) }];
        }
        return [2 /*return*/];
    });
}); });
// Breathing effect speed control
electron_1.ipcMain.handle('breathing-speed', function (_event, direction) { return __awaiter(void 0, void 0, void 0, function () {
    var command, result;
    return __generator(this, function (_a) {
        try {
            if (direction === 'faster') {
                currentSpeed = Math.min(currentSpeed + 1, 4); // Max speed 4
            }
            else {
                currentSpeed = Math.max(currentSpeed - 1, 0); // Min speed 0
            }
            command = [
                0x07, // Report ID / Header
                0x03, // Command: Set Speed
                0x02, // Sub-command
                currentSpeed, // Speed value
                0x00, 0x00, 0x00, 0x00 // Padding
            ];
            result = sendCommandToKeyboard(command);
            if (result.success) {
                return [2 /*return*/, { success: true, message: "Breathing speed ".concat(direction, ": Level ").concat(currentSpeed) }];
            }
            else {
                return [2 /*return*/, result];
            }
        }
        catch (error) {
            return [2 /*return*/, { success: false, error: String(error) }];
        }
        return [2 /*return*/];
    });
}); });
// Toggle light style/mode
electron_1.ipcMain.handle('toggle-light-style', function () { return __awaiter(void 0, void 0, void 0, function () {
    var command, modeNames, result;
    return __generator(this, function (_a) {
        try {
            // Cycle through lighting modes
            // Modes: 0=Static, 1=Breathing, 2=Wave, 3=Rainbow, 4=Reactive, etc.
            currentMode = (currentMode + 1) % 18; // 18 modes based on KB.ini LedOpt entries
            command = [
                0x07, // Report ID / Header
                0x04, // Command: Set Mode
                0x01, // Sub-command
                currentMode, // Mode index
                currentSpeed, // Speed
                currentColor, // Color
                0x00, 0x00 // Padding
            ];
            modeNames = ['Static', 'Breathing', 'Wave', 'Rainbow', 'Reactive', 'Ripple', 'Neon', 'Starry', 'Laser', 'Raindrop', 'Custom 1', 'Custom 2', 'Custom 3', 'Custom 4', 'Custom 5', 'Custom 6', 'Custom 7', 'Custom 8'];
            result = sendCommandToKeyboard(command);
            if (result.success) {
                return [2 /*return*/, { success: true, message: "Mode: ".concat(modeNames[currentMode] || "Mode ".concat(currentMode)) }];
            }
            else {
                return [2 /*return*/, result];
            }
        }
        catch (error) {
            return [2 /*return*/, { success: false, error: String(error) }];
        }
        return [2 /*return*/];
    });
}); });
