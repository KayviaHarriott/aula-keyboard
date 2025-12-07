
const devices = HID.devices();
console.log("ALL DEVICES:\n");

devices.forEach((d, i) => {
  console.log(i, d.vendorId, d.productId, d.usagePage, d.usage, d.path);
});
