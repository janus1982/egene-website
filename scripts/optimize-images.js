// Formindsker store billeder i /public så siden loader hurtigt.
// Køres med:  node scripts/optimize-images.js
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const publicDir = path.join(__dirname, "..", "public");

// Billeder der skal formindskes (max bredde i pixels)
const jobs = [
  { fil: "faciliteter.jpg", bredde: 2000 },
  { fil: "cafe.jpg", bredde: 2000 },
  { fil: "spring.jpg", bredde: 2000 },
  { fil: "springbane.jpg", bredde: 2000 },
  { fil: "ridebanen.jpg", bredde: 2000 },
  { fil: "ryttere.jpg", bredde: 1400 },
  // Forsidebilledet: konverteres fra PNG til mindre JPG
  { fil: "forside.png", bredde: 2400, udTil: "forside.jpg" },
];

(async () => {
  for (const job of jobs) {
    const indSti = path.join(publicDir, job.fil);
    if (!fs.existsSync(indSti)) {
      console.log("⏭️  Springer over (findes ikke):", job.fil);
      continue;
    }
    const udNavn = job.udTil || job.fil;
    const udSti = path.join(publicDir, udNavn);

    const før = fs.statSync(indSti).size;
    const buffer = fs.readFileSync(indSti); // læs ind i hukommelsen først

    await sharp(buffer)
      .resize({ width: job.bredde, withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(udSti);

    const efter = fs.statSync(udSti).size;
    const mb = (n) => (n / 1024 / 1024).toFixed(2);
    console.log(`✅ ${job.fil}: ${mb(før)} MB → ${udNavn}: ${mb(efter)} MB`);
  }
  console.log("\nFærdig! 🎉");
})();
