const { contextBridge } = require("electron");
const fs = require("fs");
const path = require("path");

function parseIni(data) {
  const result = {};
  const lines = data.split(/\r?\n/);
  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith(";")) continue;
    const [key, value] = line.split("=", 2);
    if (key && value !== undefined) result[key.trim()] = value.trim();
  }
  return result;
}

function loadConfig() {
  // Vite dev path (your real project root)
  const devPath = path.join(__dirname, "..", "resources", "Cfg.ini");

  // Production path (inside app bundle)
  const prodPath = path.join(process.resourcesPath, "resources", "Cfg.ini");

  let filePath = null;

  if (fs.existsSync(devPath)) {
    filePath = devPath;
  } else if (fs.existsSync(prodPath)) {
    filePath = prodPath;
  } else {
    console.error("❌ Cfg.ini NOT FOUND at:", devPath, "or", prodPath);
    return {};
  }

  const file = fs.readFileSync(filePath, "utf-8");
  return parseIni(file);
}
