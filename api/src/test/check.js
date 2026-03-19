const fs = require("fs");
const path = require("path");

// /c:/Users/HP/Desktop/web-automation-tool/src/test/check.js

const candidatePaths = [
  path.join(process.cwd(), "data", "players.json"), // projectRoot/data/players.json
  path.join(__dirname, "..", "data", "players.json"), // src/data/players.json
  path.join(__dirname, "..", "..", "data", "players.json"), // data/players.json at repo root
];

let filePath;
for (const p of candidatePaths) {
  if (fs.existsSync(p)) {
    filePath = p;
    break;
  }
}

if (!filePath) {
  console.error(
    "players.json not found in expected locations:",
    candidatePaths,
  );
  process.exitCode = 1;
} else {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      console.log(`total players: ${data.length}`);
    } else if (data && typeof data === "object") {
      console.log(
        `players.json is an object. keys: ${Object.keys(data).length}`,
      );
    } else {
      console.log("players.json parsed to a non-object/non-array value:", data);
    }
  } catch (err) {
    console.error("Failed to read/parse players.json:", err.message);
    process.exitCode = 1;
  }
}
