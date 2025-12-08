# Aula F99 USB Protocol - Reverse Engineering Needed

## Current Status
✅ Keyboard is being detected (VID/PID working)
❌ Commands not working - need correct protocol

## What We Know from KB.ini

**Packet Header:** `Psd=3,0,0,0,0,9A`
- This likely means packets start with: `[0x03, 0x00, 0x00, 0x00, 0x00, 0x9A]`

**CRC:** `CRC=1`
- Packets might need a CRC checksum

**LED Options:** 18 different modes (LedOpt1-LedOpt18)
- Format: `effect, speed, light, direct, random, color`
- Example: `LedOpt1=  1,1,0,1,0,1,1`

**Speed/Light Ranges:**
- Speed: 0-4
- Light (brightness): 0-4

## To Make It Work: Reverse Engineer Protocol

### Option 1: USB Packet Sniffing (Recommended)

**On macOS:**
1. Install Wireshark with USB capture support
2. Start capture on USB bus
3. Open official Aula software
4. Change colors, speed, modes
5. Stop capture
6. Analyze packets sent to VID:0x258a PID:0x010c

**What to look for:**
- Packet structure (header, command byte, parameters)
- Command codes for:
  - Change color/mode
  - Adjust speed
  - Adjust brightness
  - Set custom colors

### Option 2: Look for Existing Protocol Documentation

Search for:
- "Aula F99 USB protocol"
- "Aula keyboard HID commands"
- Similar Aula models (might use same protocol)
- Chinese forums (Aula is Chinese brand)

### Option 3: Try Common HID LED Commands

Some keyboards use standard HID LED commands. You could try:
- Report ID: 0x00-0x0F
- Common command structures:
  - `[ReportID, Command, Param1, Param2, ...]`
  - `[Header, Length, Command, Data..., CRC]`

## Current Command Attempts

**What we're trying (probably wrong):**
```javascript
// Change color
[0x07, 0x02, 0x03, colorIndex, 0x00, 0x00, 0x00, 0x00]

// Speed
[0x07, 0x03, 0x02, speed, 0x00, 0x00, 0x00, 0x00]

// Mode  
[0x07, 0x04, 0x01, mode, speed, color, 0x00, 0x00]
```

**What might work (based on Psd):**
```javascript
// Header: [0x03, 0x00, 0x00, 0x00, 0x00, 0x9A]
// Then: command byte + parameters
[0x03, 0x00, 0x00, 0x00, 0x00, 0x9A, CMD, PARAM1, PARAM2, ...]
```

## Testing Different Commands

You can modify `electron/main.cjs` and try different command structures:

```javascript
// Try different headers
const headers = [
  [0x03, 0x00, 0x00, 0x00, 0x00, 0x9A],  // From Psd
  [0x07, 0x02],                           // Common HID
  [0x00],                                  // Report ID 0
  [0x01],                                  // Report ID 1
];

// Try different command bytes
const commandBytes = [
  0x01, 0x02, 0x03, 0x04, 0x05,  // Sequential
  0x10, 0x20, 0x30,               // Common patterns
  0xA0, 0xB0, 0xC0,               // Alternative range
];
```

## Next Steps

1. **Capture real USB packets** from official Aula software
2. **Identify packet structure** (header, command, parameters, CRC)
3. **Update main.cjs** with correct commands
4. **Test and verify** each function works

## Resources

- **Wireshark**: https://www.wireshark.org/
- **USBPcap** (Windows): https://desowin.org/usbpcap/
- **USB Prober** (macOS): Part of Additional Tools for Xcode

## Alternative: Use Aula Software Integration

If USB protocol proves too difficult, consider:
- Reading/writing keyboard configuration files
- Calling Aula software command-line interface (if exists)
- Simulating keyboard shortcuts (Fn+End, etc.)
