// Valideringsscript for championat-pointberegning (CO trin 6).
// Testcase: Nikoline Kierkegaard (aftalt med Janus).
//
// Kør med:  node scripts/validate-championship.mjs
// Valgfrit: node scripts/validate-championship.mjs "Andet Navn"
//
// Kæden pr. start:
//   start (Equipe-søgning) -> class_section_id
//   -> meeting (navn+dato-match) -> /meetings/{id}/schedule.json
//   -> meeting_class med status PR. KLASSE (local/regional/national/...)
//   -> række i pointtabellen
//
// Udskriver pr. start: klassenavn -> kolonne, klasse-status -> række,
// placering, beregnede point med begrundelse. Summerer total.
// Sammenlign med https://egene-championat.lovable.app/ og den manuelle opgørelse.

import { beregnPoint } from "../lib/championship/points.mjs";

const BASE = "https://online.equipe.com/api/v1";
const RYTTER = process.argv[2] || "Nikoline Kierkegaard";
const AAR = "2026";

async function hentJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

// ---- Starts for rytteren (paginerer, dedupliker) ----
async function hentStarts(navn) {
  const alle = [];
  const sete = new Set();
  for (let page = 1; page <= 25; page++) {
    const url = `${BASE}/searches.json?q=${encodeURIComponent(navn)}&qc=Start&discipline=H&page=${page}`;
    let data;
    try {
      data = await hentJson(url);
    } catch {
      break;
    }
    const items = Array.isArray(data) ? data : data.results ?? data.data ?? [];
    if (!items.length) break;
    let nye = 0;
    for (const it of items) {
      if (it?.id != null && !sete.has(it.id)) {
        sete.add(it.id);
        alle.push(it);
        nye++;
      }
    }
    if (nye === 0 || items.length < 20) break;
  }
  return alle;
}

// ---- Find meeting-id via navn + dato ----
function datoIPeriode(klasseDato, m, slaekDage = 3) {
  const start = m.start_on || m.starts_on || m.start_at || null;
  const slut = m.end_on || m.ends_on || m.end_at || start;
  if (!start) return null;
  const d = new Date(klasseDato).getTime();
  const s = new Date(String(start).slice(0, 10)).getTime() - slaekDage * 86400000;
  const e = new Date(String(slut).slice(0, 10)).getTime() + slaekDage * 86400000;
  return d >= s && d <= e;
}

const meetingCache = new Map();
async function findMeeting(meetingNavn, klasseDato) {
  const noegle = `${meetingNavn.trim().toLowerCase()}|${String(klasseDato).slice(0, 10)}`;
  if (meetingCache.has(noegle)) return meetingCache.get(noegle);

  let resultat = { id: null, statuses: null, matchInfo: "intet match" };
  try {
    const data = await hentJson(`${BASE}/searches.json?q=${encodeURIComponent(meetingNavn)}&qc=Meeting`);
    const items = Array.isArray(data) ? data : data.results ?? data.data ?? [];
    const navnLower = meetingNavn.trim().toLowerCase();
    const navneMatch = items.filter(
      (m) => String(m.name || m.meeting_name || "").trim().toLowerCase() === navnLower
    );
    const kandidater = navneMatch.length ? navneMatch : items;
    const match =
      kandidater.find((m) => datoIPeriode(klasseDato, m) === true) ??
      kandidater.find((m) => datoIPeriode(klasseDato, m) === null) ??
      kandidater[0];
    if (match) {
      let statuses = match.statuses ?? null;
      if (statuses && !Array.isArray(statuses)) statuses = [statuses];
      resultat = {
        id: match.id ?? null,
        statuses,
        matchInfo: `"${match.name || match.meeting_name}" (id ${match.id ?? "?"}, ${String(match.start_on || "?").slice(0, 10)})`,
      };
    }
  } catch {
    // intet match
  }
  meetingCache.set(noegle, resultat);
  return resultat;
}

// ---- Pr.-klasse status fra schedule.json ----
// Returnerer Map: class_section_id -> { status, klasseNavn, horsePonies }
const scheduleCache = new Map();
async function hentKlasseKort(meetingId) {
  if (scheduleCache.has(meetingId)) return scheduleCache.get(meetingId);
  const kort = new Map();
  try {
    const schedule = await hentJson(`${BASE}/meetings/${meetingId}/schedule.json`);
    const klasser = schedule.meeting_classes ?? [];
    for (const mc of klasser) {
      const info = {
        status: mc.status ?? null,
        klasseNavn: mc.name ?? "",
        horsePonies: mc.horse_ponies ?? null,
      };
      for (const cs of mc.class_sections ?? []) {
        if (cs?.id != null) kort.set(cs.id, info);
      }
    }
  } catch {
    // tomt kort -> fallback til meeting-statuses
  }
  scheduleCache.set(meetingId, kort);
  return kort;
}

function udledPlacering(start) {
  if (start.rank != null && start.rank >= 1) return start.rank;
  return null;
}

const linje = "-".repeat(100);

async function main() {
  console.log(linje);
  console.log(`VALIDERING AF CHAMPIONAT-POINT  |  Rytter: ${RYTTER}  |  År: ${AAR}  |  (status pr. KLASSE)`);
  console.log(linje);

  const alleStarts = await hentStarts(RYTTER);

  // Rytter-match: alle ord i det søgte navn skal indgå i rider_name
  // (håndterer FEI-format som "CLAUSEN Sophie Lund" ved internationale stævner)
  const soegOrd = RYTTER.trim().toLowerCase().split(/\s+/);
  const rytterMatch = (s) => {
    const navn = String(s.rider_name || "").toLowerCase();
    return soegOrd.every((ord) => navn.includes(ord));
  };
  // Klub-match: "Egene Rideklub" - men ved internationale stævner kan klubfeltet
  // være landet (DEN/Denmark) eller tomt, så dem markerer vi i stedet for at smide ud.
  const klubEgene = (s) => String(s.club_name || "").trim().toLowerCase() === "egene rideklub";
  const klubInternational = (s) => {
    const k = String(s.club_name || "").trim().toLowerCase();
    return k === "" || k === "den" || k === "denmark" || k === "danmark";
  };

  const starts = alleStarts.filter(
    (s) =>
      rytterMatch(s) &&
      (klubEgene(s) || klubInternational(s)) &&
      String(s.meeting_class_start_at || "").startsWith(AAR) &&
      !/TILMELDING/i.test(s.meeting_class_name || "")
  );

  console.log(`Fundet i søgning: ${alleStarts.length}  |  Efter filter: ${starts.length}\n`);

  // DIAGNOSE: hvorfor blev resten sorteret fra?
  const frasorterede = alleStarts.filter((s) => !starts.includes(s));
  if (frasorterede.length) {
    const grunde = {};
    for (const s of frasorterede) {
      let grund;
      if (!rytterMatch(s)) grund = `andet rytternavn: "${s.rider_name}"`;
      else if (!klubEgene(s) && !klubInternational(s)) grund = `anden klub: "${s.club_name}"`;
      else if (!String(s.meeting_class_start_at || "").startsWith(AAR)) grund = `andet år: ${String(s.meeting_class_start_at || "?").slice(0, 4)}`;
      else grund = "tilmeldingsklasse";
      grunde[grund] = (grunde[grund] || 0) + 1;
    }
    console.log("Frasorteret:");
    for (const [g, n] of Object.entries(grunde)) console.log(`  ${n} x ${g}`);
    console.log("");
  }

  let total = 0;
  let ukendte = 0;
  let fallbacks = 0;
  starts.sort((a, b) => String(a.meeting_class_start_at).localeCompare(String(b.meeting_class_start_at)));

  for (const s of starts) {
    const dato = String(s.meeting_class_start_at || "").slice(0, 10);
    const meeting = await findMeeting(s.meeting_name, dato);

    // Status pr. klasse via class_section_id; fallback: meeting-statuses (flagges)
    let statuses = null;
    let statusKilde = "";
    if (meeting.id != null) {
      const kort = await hentKlasseKort(meeting.id);
      const info = kort.get(s.class_section_id);
      if (info?.status) {
        statuses = [info.status];
        statusKilde = `pr. klasse: ${info.status}` + (info.horsePonies ? ` (${info.horsePonies.join("/")})` : "");
      }
    }
    if (!statuses) {
      statuses = meeting.statuses;
      statusKilde = `FALLBACK meeting-statuses: ${statuses ? statuses.join(", ") : "UKENDT"}`;
      fallbacks++;
    }

    const placering = udledPlacering(s);
    // B0/sløjfe kræver bevis for gennemført runde: en placering eller resultatdata.
    // Uden begge (fx fremtidige stævner) må fejlfri ikke antages.
    const harResultat = placering != null || String(s.result_preview || "").trim() !== "";
    const resultat = beregnPoint(statuses, s.meeting_class_name, placering, {
      fejlfri: harResultat ? null : false,
    });
    total += resultat.points;
    if (resultat.ukendt) ukendte++;

    console.log(`${dato}  ${s.meeting_name}`);
    console.log(`  Klasse:    ${String(s.meeting_class_name || "").trim()}`);
    console.log(`  Hest:      ${s.horse_name}   Placering: ${placering ?? "-"}   Status: ${statusKilde}`);
    console.log(`  Stævne-match: ${meeting.matchInfo}`);
    for (const t of resultat.trace) console.log(`  -> ${t}`);
    console.log(`  POINT: ${resultat.points}\n`);
  }

  console.log(linje);
  console.log(
    `TOTAL for ${RYTTER}: ${total} point  (${starts.length} starter, ${ukendte} UKENDT, ${fallbacks} med meeting-fallback)`
  );
  console.log(linje);
  console.log(`Sammenlign med https://egene-championat.lovable.app/ og den manuelle opgørelse.`);
  console.log(`Referencecheck: Værløse 6/6, LA1*, 7. plads, klasse-status regional -> C x LA x Øvrige = 7 point`);
}

main().catch((e) => {
  console.error("FEJL:", e.message);
  process.exit(1);
});
