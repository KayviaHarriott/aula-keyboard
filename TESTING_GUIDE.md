# 🧪 Testing Guide - Aula F99 Control Center

## 🎯 Quick Start

1. **Connect your Aula F99 keyboard via USB**

2. **Run the app:**
   ```bash
   npm run electron:dev
   ```

3. **Check the Electron DevTools Console** (it opens automatically)

---

## ✅ What You Should See

### 1. **Keyboard Detection**
Look for this in the console:
```
✅ Aula F99 Pro detected
Vendor ID: 0x258a
Product ID: 0x010c
```

### 2. **When Clicking Buttons**
Each button click should log:
```
Sent packet: 0x03 0x00 0x00 0x00 0x00 0x9a 0x0e 0x01 ...
✅ Color: Red
```

### 3. **Keyboard LED Changes**
- **Change Color button** → LEDs should change color
- **Breathing Faster/Slower** → Animation speed should change
- **Toggle Light Style** → Effect should switch (Static, Breathing, Wave, etc.)

---

## ⚠️ Troubleshooting

### Issue: "Keyboard not found"
**Solutions:**
1. Unplug and replug your USB keyboard
2. Check if VID/PID match in `electron/main.cjs`:
   ```javascript
   const AULA_VID = 0x258a;
   const AULA_PID = 0x010c;
   ```
3. Run this to see all HID devices:
   ```bash
   node electron/list.cjs
   ```

### Issue: "Buttons don't change keyboard LEDs"
**This means:**
- ✅ Structure is correct
- ⚠️ Command bytes need adjustment

**What to do:**
1. Copy the console output showing the packet:
   ```
   Sent packet: 0x03 0x00 0x00 0x00 0x00 0x9a 0x0e 0x01 ...
   ```
2. Tell me which button you clicked
3. I'll adjust the command bytes

### Issue: "Error: cannot open device"
**macOS Permission Issue:**
1. Go to **System Settings** → **Privacy & Security**
2. Click **Input Monitoring**
3. Enable permission for **Terminal** or **Electron**

---

## 🔍 Advanced Debugging

### See All Connected HID Devices:
```bash
cd /home/user/webapp
node electron/list.cjs
```

Look for your Aula keyboard in the output!

### Check Console Logs:
Press `Cmd+Option+I` (macOS) to open DevTools if it doesn't open automatically.

### Test Feature Report Support:
If commands still don't work, we might need to try:
- Regular `write()` instead of `sendFeatureReport()`
- Different report IDs (0x01, 0x02, 0x03)
- Different packet lengths (32, 64, or 256 bytes)

---

## 📊 Expected Behavior

| Button | Expected Result |
|--------|----------------|
| **Change Color** | Cycle: Red → Green → Blue → Yellow → Cyan → Magenta → White → Red |
| **Breathing Faster** | Speed increases (0→1→2→3→4, max) |
| **Breathing Slower** | Speed decreases (4→3→2→1→0, min) |
| **Toggle Light Style** | Mode changes: Static → Breathing → Wave → Rainbow → ... (18 modes) |

---

## 🎮 Success Checklist

- [ ] Keyboard detected in console
- [ ] Buttons show success messages
- [ ] Console shows packet hex dumps
- [ ] Keyboard LEDs physically change
- [ ] No error messages in console

---

## 💬 Report Results

After testing, let me know:

1. **Did the keyboard get detected?** (Yes/No)
2. **What do the console logs show?**
3. **Do the LEDs change at all?** (Yes/No)
4. **Any error messages?**

With this info, I can fine-tune the exact command bytes if needed! 🚀
