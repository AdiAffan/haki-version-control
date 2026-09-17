const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data");

function getFilePath(fileName) {
  return path.join(DATA_DIR, fileName);
}

function readJson(fileName) {
  const filePath = getFilePath(fileName);

  if (!fs.existsSync(filePath)) {
    return [];
  }

  const data = fs.readFileSync(filePath, "utf-8");

  if (!data.trim()) {
    return [];
  }

  return JSON.parse(data);
}

function writeJson(fileName, data) {
  const filePath = getFilePath(fileName);

  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

module.exports = {
  readJson,
  writeJson,
};