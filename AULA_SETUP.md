# Aula Keyboard Control Center - Setup Guide

## 🎮 Setup Instructions

### 1. Add Your Aula Keyboard Configuration

Replace the sample `resources/cfg.ini` file with your actual Aula keyboard configuration file:

```bash
# Copy your cfg.ini from your Aula keyboard software directory
# Typically found in:
# Windows: C:\Program Files\Aula\cfg.ini
# Or wherever your Aula software is installed

cp /path/to/your/aula/cfg.ini ./resources/cfg.ini
```

### 2. Understanding the cfg.ini File

The Electron app reads and modifies the `cfg.ini` file to control your keyboard. Common settings include:

- **color** - RGB color index (0-15)
- **brightness** - Backlight brightness (0-100)
- **mode** - Lighting effect mode (0=Static, 1=Breathing, 2=Wave, etc.)
- **breathingSpeed** - Speed of breathing effect (1-10)
- **style** - Lighting style/pattern

### 3. Running the Application

#### Browser Mode (Development)
```bash
npm run dev
```
This runs the UI in your browser (Electron features will be disabled)

#### Electron Mode
```bash
npm run dev:electron
```
This runs the full Electron app with keyboard control capabilities

#### Build for Production
```bash
npm run build:electron
```
Creates a distributable Electron app

### 4. How It Works

The control center buttons trigger these actions:

1. **Change Color** - Cycles through color index in cfg.ini
2. **Breathing Faster** - Increases breathingSpeed value
3. **Breathing Slower** - Decreases breathingSpeed value
4. **Toggle Light Style** - Cycles through mode/style values

### 5. Customization

If your Aula keyboard uses different setting names in cfg.ini, update the following files:

- `electron/main.ts` - Modify the setting names to match your cfg.ini
- Look for lines like `line.includes('color')` and adjust accordingly

### 6. Advanced: Direct USB Communication (Future Enhancement)

For direct USB control without cfg.ini, you would need:
- USB HID library (e.g., `node-hid`)
- Aula keyboard's USB vendor ID and product ID
- Protocol documentation for sending commands

This current version modifies the cfg.ini file which should work with Aula's software.

## 🔧 Troubleshooting

### Config file not found
- Make sure `resources/cfg.ini` exists
- Check the path in `electron/main.ts` (CFG_PATH variable)

### Changes not applying
- Ensure Aula's software is running and monitoring the cfg.ini file
- Try restarting the Aula keyboard software
- Check file permissions on cfg.ini

### Button clicks do nothing
- Check browser console for errors
- Make sure you're running in Electron mode, not browser mode
- Verify cfg.ini has the correct setting names

## 📝 Notes

- This app modifies the cfg.ini file that Aula's software reads
- Aula's software should be running to apply the changes to the hardware
- You may need to restart Aula software after changes
- Keep a backup of your original cfg.ini file
