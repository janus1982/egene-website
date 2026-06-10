// Sonde: find feltet der bærer kategorien PR. KLASSE (E/D/C/B/A) i Equipe.
// Equipes UI viser "Regional | C stævne | Pony" pr. klasselinje, så feltet findes.
//
// Kør med:  node scripts/inspect-meeting.mjs           (Værløse, id 79840)
// Eller:    node scripts/inspect-meeting.mjs 12345     (andet meeting-id)

const BASE = "https://online.equipe.com/api/v1";
const MEETING_ID = process.argv[2] || "79840";

async function hentJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

function visFelter(obj, label) {
  console.log(`\n--- ${label} ---`);
  for (const [k, v] of Object.entries(obj)) {
    const vis = typeof v === "object" && v !== null ? JSON.stringify(v).slice(0, 120) : String(v);
    console.log(`  ${k}: ${vis}`);
  }
}

async function main() {
  // 1. Meeting-objektet selv
  try {
    const meeting = await hentJson(`${BASE}/meetings/${MEETING_ID}.json`);
    visFelter(meeting, `MEETING ${MEETING_ID}`);
  } catch (e) {
    console.log(`Meeting-objekt: ${e.message}`);
  }

  // 2. Programmet (schedule) - her viser UI'et kategori pr. klasse
  try {
    const schedule = await hentJson(`${BASE}/meetings/${MEETING_ID}/schedule.json`);
    const dage = Array.isArray(schedule) ? schedule : schedule.days ?? schedule.data ?? [schedule];
    console.log(`\nSchedule hentet. Topniveau: ${Array.isArray(schedule) ? `array[${schedule.length}]` : Object.keys(schedule).join(", ")}`);

    // Find de første 3 klasse-agtige objekter og print ALLE deres felter
    let fundet = 0;
    const led = (node, dybde = 0) => {
      if (fundet >= 3 || dybde > 4 || node == null) return;
      if (Array.isArray(node)) {
        for (const n of node) led(n, dybde + 1);
      } else if (typeof node === "object") {
        const noegler = Object.keys(node);
        if (noegler.some((k) => /class|name/i.test(k)) && noegler.length > 3) {
          fundet++;
          visFelter(node, `KLASSE-OBJEKT #${fundet} (dybde ${dybde})`);
        }
        for (const v of Object.values(node)) led(v, dybde + 1);
      }
    };
    led(dage);
    if (!fundet) console.log("Ingen klasse-objekter fundet i schedule - print rå:", JSON.stringify(schedule).slice(0, 1500));
  } catch (e) {
    console.log(`Schedule: ${e.message}`);
  }
}

main().catch((e) => {
  console.error("FEJL:", e.message);
  process.exit(1);
});
