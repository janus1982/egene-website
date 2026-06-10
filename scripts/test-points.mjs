// Unit tests af championat-pointberegningen.
// Kør med:  node scripts/test-points.mjs
// Alle tests skal vise OK. Fejl udskrives med forventet vs faktisk.

import { beregnPoint, kolonneFraKlassenavn, raekkeFraStatuses, POINT_TABEL } from "../lib/championship/points.mjs";

let ok = 0;
let fejl = 0;

function test(navn, faktisk, forventet) {
  const f = JSON.stringify(faktisk);
  const e = JSON.stringify(forventet);
  if (f === e) {
    ok++;
  } else {
    fejl++;
    console.log(`FEJL: ${navn}`);
    console.log(`   forventet: ${e}`);
    console.log(`   faktisk:   ${f}`);
  }
}

const p = (statuses, klasse, rank, opts) => beregnPoint(statuses, klasse, rank, opts).points;

// ---- Række fra statuses ----
test("regional -> C", raekkeFraStatuses(["regional"]), "C");
test("local -> ED", raekkeFraStatuses(["local"]), "ED");
test("club -> ED", raekkeFraStatuses(["club"]), "ED");
test("national -> B", raekkeFraStatuses(["national"]), "B");
test("elite -> A", raekkeFraStatuses(["elite"]), "A");
test("international -> A", raekkeFraStatuses(["international"]), "A");
test("højeste status vinder", raekkeFraStatuses(["club", "national"]), "B");
test("tom -> null", raekkeFraStatuses([]), null);

// ---- Kolonne fra klassenavn ----
test("LB1* -> LB", kolonneFraKlassenavn("GRÆSCUP 2. pointrunde LB1* Springning Ponyer (85/75/65 cm) B7"), "LB");
test("LB2** -> LB", kolonneFraKlassenavn("Heri - LB2** Springning Ponyer (90/80/70 cm) S2"), "LB");
test("LA1* -> LA", kolonneFraKlassenavn("Slagter Lindhart - LA1* Springning Ponyer (95/85/75)"), "LA");
test("LC25 -> LELDLC", kolonneFraKlassenavn("LC25 Springning"), "LELDLC");
test("MB1* -> MB", kolonneFraKlassenavn("MB1* Springning Heste"), "MB");
test("MA2** -> MA", kolonneFraKlassenavn("MA2** Springning"), "MA");
test("S1* -> S12", kolonneFraKlassenavn("S1* Springning Heste"), "S12");
test("S2* -> S34 (klasse MED stjerne)", kolonneFraKlassenavn("S2* Springning"), "S34");
test("FÆLDE: 'S2' uden stjerne sidst = metode, ikke klasse", kolonneFraKlassenavn("Bronze Tour Pony 2. Kval S2 (65/75/85)"), null);
test("ukendt navn -> null", kolonneFraKlassenavn("BANETRÆNING Hest 60-110 cm."), null);
test("FÆLDE: sponsornavn 'Latoyas' må ikke matche LA", kolonneFraKlassenavn("LB2** Springning Ponyer (90/80/70 cm) B7 - LM Horse Retreat, Latoyas Engler & Ll. Haspeholm"), "LB");
test("FÆLDE: tidligste token vinder", kolonneFraKlassenavn("LA1* Springning - sponsoreret af LB2** ApS"), "LA");

// ---- Pointtabellen: stikprøver i alle fire rækker ----
test("ED x LELDLC, 1. plads = 6", p(["club"], "LC25 Springning", 1), 6);
test("ED x MB, 5. plads = 5", p(["local"], "MB1* Springning", 5), 5);
test("ED x MA = ikke pointgivende", p(["local"], "MA1* Springning", 1), 0);
test("C x LB, 1. plads = 11", p(["regional"], "LB1* Springning", 1), 11);
test("C x LA, øvrige (7.) = 7  <- REFERENCECASE Nikoline", p(["regional"], "Slagter Lindhart - LA1* Springning Ponyer", 7), 7);
test("C x S1*, 1. plads = 15", p(["regional"], "S1* Springning", 1), 15);
test("C x S2* = ikke pointgivende", p(["regional"], "S2* Springning", 1), 0);
test("B x LA, 1. plads = 17", p(["national"], "LA1* Springning", 1), 17);
test("B x LELDLC = ikke pointgivende", p(["national"], "LC25 Springning", 1), 0);
test("B x S2*, 2. plads = 20", p(["national"], "S2* Springning", 2), 20);
test("A x S2*, 4. plads = 23 (bevidst skævhed)", p(["international"], "S2* Springning", 4), 23);
test("A x S2*, 5. plads = 23 (bevidst skævhed)", p(["international"], "S2* Springning", 5), 23);
test("A x LA, øvrige = 17", p(["elite"], "LA1* Springning", 9), 17);

// ---- Placering 6+ = øvrige ----
test("6. plads = øvrige", p(["regional"], "LB1* Springning", 6), 6);
test("15. plads = øvrige", p(["regional"], "LB1* Springning", 15), 6);

// ---- B0 ----
test("B0 fejlfri = øvrige-sats", p(["regional"], "LA1* metode B0 Springning", null, { fejlfri: true }), 7);
test("B0 ikke fejlfri = 0", p(["regional"], "LA1* metode B0 Springning", null, { fejlfri: false }), 0);

// ---- Sløjfespring ----
test("sløjfeklasse = 1 point", p(["local"], "D4HS Sløjfeklasse for pony. Vælg imellem 10 cm - 100 cm B0", null, {}), 1);
test("sløjfeklasse ikke fejlfri = 0", p(["local"], "Sløjfeklasse 10-100 cm B0", null, { fejlfri: false }), 0);

// ---- Stilspring (metode) ----
test("stil >= 8.0 i C-række, ingen placering = 2", p(["regional"], "LB2** Springning Ponyer S2", null, { stilKarakter: 8.5 }), 2);
test("stil >= 8.0 i B-række = 4", p(["national"], "LA1* Springning S2", null, { stilKarakter: 8.0 }), 4);
test("stil < 8.0 = 0", p(["regional"], "LB2** Springning S2", null, { stilKarakter: 7.5 }), 0);
test("stil MED placering: placeringen gælder, ikke bonus", p(["regional"], "LB2** Springning Ponyer S2", 3, { stilKarakter: 9.0 }), 9);

// ---- Ukendte ----
test("ukendt klasse = 0 + flag", beregnPoint(["regional"], "BANETRÆNING Hest 60-110 cm.", 1).ukendt, true);
test("ukendt statuses = 0 + flag", beregnPoint(null, "LB1* Springning", 1).ukendt, true);

// ---- Tabellens struktur ----
let celler = 0;
for (const r of Object.values(POINT_TABEL)) for (const c of Object.values(r)) if (c) celler += c.length;
test("alle pointgivende celler har 6 satser", celler % 6, 0);

console.log("-".repeat(50));
console.log(`${ok} OK, ${fejl} fejl`);
process.exit(fejl ? 1 : 0);
