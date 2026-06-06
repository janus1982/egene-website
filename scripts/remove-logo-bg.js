// Fjerner den hvide baggrund fra logoet og gemmer som gennemsigtig PNG.
// Køres med:  node scripts/remove-logo-bg.js
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const pub = path.join(__dirname, "..", "public");
const input = path.join(pub, "logo.jpg");
const output = path.join(pub, "logo.png");

(async () => {
  if (!fs.existsSync(input)) {
    console.error("Kan ikke finde public/logo.jpg");
    process.exit(1);
  }

  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels; // 4 (RGBA)
  const threshold = 235; // pixels lysere end dette bliver gennemsigtige

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r >= threshold && g >= threshold && b >= threshold) {
      data[i + 3] = 0; // gør pixel gennemsigtig
    }
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels },
  })
    .png()
    .toFile(output);

  console.log("✅ Lavet public/logo.png med gennemsigtig baggrund");
})();
