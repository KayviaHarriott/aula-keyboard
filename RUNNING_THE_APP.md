# 🚀 Running the Aula Keyboard Control Center

## ✅ Fixed Issues
- ✅ ES Module `__dirname` error - FIXED
- ✅ node-hid module loading - FIXED
- ✅ Vite build configuration - FIXED
- ✅ Removed old dist-electron files

## 🎮 How to Run

### Option 1: Vite + Electron (Recommended)
```bash
npm run dev:electron
```
This will:
1. Start Vite dev server on http://localhost:5173
2. Build electron files automatically
3. Launch Electron app
4. Connect to Vite dev server for hot reload

### Option 2: Separate Processes
```bash
# Terminal 1 - Start Vite dev server
npm run dev

# Terminal 2 - After dev server is running, start Electron
npm run electron-dev
```

## 🔍 Troubleshooting

### Blank Screen Issue
The blank screen was caused by:
1. Old compiled `dist-electron/main.js` without USB support
2. node-hid not being externalized in Vite config
3. node-hid import failing

**Solution**: All fixed in latest commit! The app will now:
- Dynamically load node-hid
- Use the new USB HID implementation
- Display the control center UI

### If You Still See a Blank Screen:

1. **Check the Electron DevTools Console**:
   - The app should auto-open DevTools
   - Look for any error messages
   - Check if keyboard detection succeeded

2. **Verify Vite is Building Electron Files**:
   ```bash
   # You should see output like:
   # build started...
   # dist-electron/main.js
   # dist-electron/preload.js
   ```

3. **Check if Keyboard is Detected**:
   - Look for "node-hid loaded successfully" in console
   - Should see keyboard detection message in UI

### macOS Permissions

On macOS, you may need to grant permissions:

1. **Input Monitoring Permission**:
   - Go to System Settings > Privacy & Security > Input Monitoring
   - Add Electron/Your App to the list

2. **USB Access**:
   - macOS may prompt for USB access
   - Click "Allow" when prompted

### If Buttons Don't Work

1. **Keyboard Not Detected**:
   - Make sure Aula F99 Pro is connected via USB
   - Check if it shows up in System Information > USB
   - VID should be: `0x1a2c`
   - PID should be: `0x4b64`

2. **Commands Not Working**:
   - The USB HID commands are based on standard protocols
   - Aula might use a custom protocol that differs
   - Check Electron console for error messages
   - You may need to sniff the USB traffic from the official Aula software

## 🐛 Debug Mode

To see detailed logging:

1. Open Electron DevTools (should open automatically)
2. Look for console messages:
   - "node-hid loaded successfully" - HID module loaded
   - "Aula F99 Pro detected!" - Keyboard found
   - Command responses from button clicks

## 📝 Next Steps if Commands Don't Work

If the app runs but keyboard doesn't respond to commands:

1. **USB Traffic Analysis Needed**:
   - The command bytes might need adjustment
   - Would need to capture actual USB packets from Aula software
   - Tools: Wireshark with USBPcap (Windows) or USB Prober (macOS)

2. **Alternative: Find Protocol Documentation**:
   - Look for Aula F99 Pro USB protocol documentation
   - Check if there's an SDK available
   - Look in the Aula software's resource files

3. **Test Basic Communication**:
   - Try sending simple HID reports
   - See if keyboard responds at all
   - Might need to adjust packet format

## 🎯 Expected Behavior

When working correctly:

1. **On Startup**:
   - Electron window opens
   - Shows "Aula F99 Pro detected!" message
   - 4 control buttons displayed

2. **Clicking Buttons**:
   - Shows loading state
   - Displays success message with current setting
   - Keyboard lighting should change
   - Message: "Color changed to Red" or "Mode: Breathing", etc.

3. **If Keyboard Not Connected**:
   - Shows warning message
   - Buttons still work but show error
   - Error: "Keyboard not found"

## 💡 Tips

- Keep DevTools open to see console messages
- Try clicking each button to test
- If one command works, others likely will too
- Commands might need 2-3 second delay between clicks

Good luck! 🎮
