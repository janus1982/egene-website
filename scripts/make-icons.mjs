// Laver PWA-ikoner (192 og 512 px) af logoet, på hvid baggrund med luft omkring.
// Kør med:  node scripts/make-icons.mjs
import sharp from "sharp";

const KILDE = "public/logo.png";

for (const str of [192, 512]) {
  const luft = Math.round(str * 0.12);
  await sharp(KILDE)
    .resize(str - luft * 2, str - luft * 2, { fit: "contain", background: "#ffffff" })
    .extend({ top: luft, bottom: luft, left: luft, right: luft, background: "#ffffff" })
    .flatten({ background: "#ffffff" })
    .png()
    .toFile(`public/icon-${str}.png`);
  console.log(`public/icon-${str}.png oprettet`);
}
