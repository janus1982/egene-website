// Egene Rideklub - championat-pointberegning (spring)
// Ren funktion uden side effects. Bruges af både hjemmesiden og valideringsscriptet.
//
// To dimensioner:
//   Række  <- DRF-stævnekategori <- Equipe `statuses` på meeting-niveau
//   Kolonne <- sværhedsgrad <- præfiks-token i meeting_class_name
//
// Kilde: DRF Disciplinafsnit Springning 2025 + klubbens pointskema (jan 2023).

// ---- Dimension 1: meeting statuses -> championat-række ----
// Equipe statuses rangeret højest->lavest: international, elite, national, regional, local, club
const STATUS_PRIORITET = ["international", "elite", "national", "regional", "local", "club"];

const STATUS_TIL_RAEKKE = {
  international: "A",
  elite: "A",
  national: "B",
  regional: "C",
  local: "ED",
  club: "ED",
};

const RAEKKE_NAVNE = {
  A: "A-klasser (internat.)",
  B: "B-klasser",
  C: "C-klasser",
  ED: "E og D-klasser",
};

export function raekkeFraStatuses(statuses) {
  if (!Array.isArray(statuses) || statuses.length === 0) return null;
  const normaliseret = statuses.map((s) => String(s).toLowerCase().trim());
  for (const status of STATUS_PRIORITET) {
    if (normaliseret.includes(status)) return STATUS_TIL_RAEKKE[status];
  }
  return null;
}

// ---- Dimension 2: klassenavn -> kolonne (sværhedsgrad) ----
// VIGTIGE FÆLDER:
// 1) "S2" til sidst i et klassenavn er typisk stilsprings-METODE, ikke S2*-KLASSEN.
//    Klasse-tokens kræver derfor tal og/eller stjerne (S2*, LA1*, LB2**).
// 2) Sponsornavne kan ligne tokens ("Latoyas" ~ LA). Derfor kræves tal/stjerne,
//    og den TIDLIGSTE forekomst i navnet vinder (klassekoden står før sponsorteksten).
const KOLONNE_MOENSTRE = [
  { col: "S34", re: /\bS[234]\*{1,2}/g },
  { col: "S12", re: /\bS1\*{1,2}/g },
  { col: "MA", re: /\bMA(?:\d\*{0,2}|\*{1,2})/g },
  { col: "MB", re: /\bMB(?:\d\*{0,2}|\*{1,2})/g },
  { col: "LA", re: /\bLA(?:\d\*{0,2}|\*{1,2})/g },
  { col: "LB", re: /\bLB(?:\d\*{0,2}|\*{1,2})/g },
  { col: "LELDLC", re: /\bL[CDEF]\d*\b/g },
];

export function kolonneFraKlassenavn(klassenavn) {
  const navn = String(klassenavn || "").toUpperCase();
  let bedste = null;
  for (const { col, re } of KOLONNE_MOENSTRE) {
    re.lastIndex = 0;
    const m = re.exec(navn);
    if (m && (bedste === null || m.index < bedste.index)) {
      bedste = { col, index: m.index };
    }
  }
  return bedste ? bedste.col : null;
}

// ---- Pointtabellen (gældende fra januar 2023) ----
// Format pr. celle: [1.plads, 2., 3., 4., 5., øvrige]. null = ikke pointgivende.
export const POINT_TABEL = {
  ED: {
    LELDLC: [6, 5, 4, 3, 2, 1],
    LB: [7, 6, 5, 4, 3, 2],
    LA: [8, 7, 6, 5, 4, 3],
    MB: [9, 8, 7, 6, 5, 4],
    MA: null,
    S12: null,
    S34: null,
  },
  C: {
    LELDLC: [6, 5, 4, 3, 2, 1],
    LB: [11, 10, 9, 8, 7, 6],
    LA: [12, 11, 10, 9, 8, 7],
    MB: [13, 12, 11, 10, 9, 8],
    MA: [14, 13, 12, 11, 10, 9],
    S12: [15, 14, 13, 12, 11, 10],
    S34: null,
  },
  B: {
    LELDLC: null,
    LB: null,
    LA: [17, 16, 15, 14, 13, 12],
    MB: [18, 17, 16, 15, 14, 13],
    MA: [19, 18, 17, 16, 15, 14],
    S12: [20, 19, 18, 17, 16, 15],
    S34: [21, 20, 19, 18, 17, 16],
  },
  A: {
    LELDLC: null,
    LB: null,
    LA: [22, 21, 20, 19, 18, 17],
    MB: [23, 22, 21, 20, 19, 18],
    MA: [24, 23, 22, 21, 20, 19],
    S12: [25, 24, 23, 22, 21, 20],
    // NB: 23 på både 4. og 5. plads er bevidst - står sådan i klubbens skema.
    S34: [26, 25, 24, 23, 23, 21],
  },
};

// ---- Detektion af særlige klassetyper ----
export function erSloejfespring(klassenavn) {
  const navn = String(klassenavn || "").toUpperCase();
  // Sløjfeklasse i fast højde (10/20/30 cm ...), metode B0
  return /SLØJF/.test(navn) || (/\bB0\b/.test(navn) && /\b\d{2,3}\s*CM\b/.test(navn) && !kolonneFraKlassenavn(navn));
}

export function erB0(klassenavn) {
  return /\bB0\b/.test(String(klassenavn || "").toUpperCase());
}

// Stilsprings-METODE: S2/S3/S4 uden stjerne, typisk sidst i navnet, eller ordet "stilspring"
export function erStilspringsMetode(klassenavn) {
  const navn = String(klassenavn || "").toUpperCase().trimEnd();
  if (/STILSPRING/.test(navn)) return true;
  // "... B7" / "... S2" til sidst = metode-angivelse. S2 uden stjerne = metode.
  return /\bS[234]\s*$/.test(navn);
}

// ---- Hovedfunktion ----
// beregnPoint(statuses, className, rank, { fejlfri, stilKarakter })
// -> { points, row, col, trace }
export function beregnPoint(statuses, className, rank, opts = {}) {
  const { fejlfri = null, stilKarakter = null } = opts;
  const trace = [];

  // 1. Sløjfespring: 1 point pr. fejlfri runde, uanset række/kolonne
  if (erSloejfespring(className)) {
    if (fejlfri === false) {
      trace.push(`Sløjfespring, ikke fejlfri -> 0 point`);
      return { points: 0, row: null, col: null, trace };
    }
    trace.push(`Sløjfespring i fast højde -> 1 point (fejlfri runde)`);
    return { points: 1, row: null, col: null, trace };
  }

  // 2. Række fra meeting statuses
  const row = raekkeFraStatuses(statuses);
  if (!row) {
    trace.push(`UKENDT række: statuses=${JSON.stringify(statuses)} -> 0 point, flag til manuel`);
    return { points: 0, row: null, col: null, trace, ukendt: true };
  }
  trace.push(`Række: ${RAEKKE_NAVNE[row]} (statuses: ${(statuses || []).join(", ")})`);

  // 3. Kolonne fra klassenavn
  const col = kolonneFraKlassenavn(className);
  if (!col) {
    trace.push(`UKENDT kolonne: "${className}" -> 0 point, flag til manuel`);
    return { points: 0, row, col: null, trace, ukendt: true };
  }
  trace.push(`Kolonne: ${col} (fra "${String(className).trim()}")`);

  const celle = POINT_TABEL[row][col];
  if (!celle) {
    trace.push(`Kombination ${row} x ${col} er ikke pointgivende (null i tabel) -> 0 point`);
    return { points: 0, row, col, trace };
  }

  // 4. B0 (ikke sløjfe): point som "Øvrige" - kun ved fejlfri runde
  if (erB0(className)) {
    if (fejlfri === false) {
      trace.push(`B0-klasse, ikke fejlfri -> 0 point`);
      return { points: 0, row, col, trace };
    }
    trace.push(`B0-klasse -> "Øvrige"-sats: ${celle[5]} point`);
    return { points: celle[5], row, col, trace };
  }

  // 5. Placering 1-5 -> tabelsats. 6+ -> "Øvrige". Placeringspoint går forud for stilbonus.
  if (rank != null && rank >= 1) {
    const idx = rank <= 5 ? rank - 1 : 5;
    const label = rank <= 5 ? `${rank}. plads` : `Øvrige (${rank}. plads)`;
    trace.push(`${label} -> ${celle[idx]} point`);
    return { points: celle[idx], row, col, trace };
  }

  // 6. Ingen placering: stilspringsmetode med slutkarakter >= 8,0
  if (erStilspringsMetode(className) && stilKarakter != null && stilKarakter >= 8.0) {
    const bonus = row === "ED" || row === "C" ? 2 : 4;
    trace.push(`Stilspring, karakter ${stilKarakter} >= 8,0, ingen placering -> ${bonus} point`);
    return { points: bonus, row, col, trace };
  }

  // 7. Ellers: 0 point
  trace.push(`Ingen placering, ikke fejlfri B0, ikke stilkarakter >= 8,0 -> 0 point`);
  return { points: 0, row, col, trace };
}
