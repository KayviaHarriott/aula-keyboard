
// Pick the RGB-capable interfaces
const devices = HID.devices().filter(
  d =>
    d.vendorId === 6700 &&
    d.productId === 32767 &&
    (
      (d.usagePage === 12 && d.usage === 1) ||   // Most AULA RGB endpoints
      (d.usagePage === 1 && d.usage === 128)     // Backup endpoint
    )
);

if (devices.length === 0) {
  console.log("No RGB-capable AULA interface found.");
  process.exit();
}

console.log("Opening:", devices[0].path);

const dev = new HID.HID(devices[0].path);

// UNIVERSAL AULA COLOR-CYCLE TEST PACKET
const packet = [5, 1, 1, 2, 5, 0, 0, 0];

console.log("Sending packet:", packet);
dev.write(packet);

console.log("DONE. Check your keyboard.");
dev.close();
