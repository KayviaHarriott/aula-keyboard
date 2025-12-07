
console.log("Attempting to read HID devices…");

try {
  const devices = HID.devices();
  console.log(JSON.stringify(devices, null, 2));
} catch (e) {
  console.error("ERROR:", e);
}
