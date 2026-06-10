// Egenes pointmodel (januar 2023).
// VIGTIGT: Denne fil har ingen side effects - kun rene funktioner.

type PointRaekke = { 1: number; 2: number; 3: number; 4: number; 5: number; øvrige: number };

const POINT_TABEL: Record<string, Record<string, PointRaekke | null>> = {
  "E og D-klasser": {
    "LE/LD/LC":   { 1: 6,  2: 5,  3: 4,  4: 3,  5: 2,  øvrige: 1 },
    "LB*/LB**":   { 1: 7,  2: 6,  3: 5,  4: 4,  5: 3,  øvrige: 2 },
    "LA*/LA**":   { 1: 8,  2: 7,  3: 6,  4: 5,  5: 4,  øvrige: 3 },
    "MB*/MB**":   { 1: 9,  2: 8,  3: 7,  4: 6,  5: 5,  øvrige: 4 },
    "MA*/MA**":   null,
    "S*/S**":     null,
    "S***/S****": null,
  },
  "C-klasser": {
    "LE/LD/LC":   { 1: 6,  2: 5,  3: 4,  4: 3,  5: 2,  øvrige: 1 },
    "LB*/LB**":   { 1: 11, 2: 10, 3: 9,  4: 8,  5: 7,  øvrige: 6 },
    "LA*/LA**":   { 1: 12, 2: 11, 3: 10, 4: 9,  5: 8,  øvrige: 7 },
    "MB*/MB**":   { 1: 13, 2: 12, 3: 11, 4: 10, 5: 9,  øvrige: 8 },
    "MA*/MA**":   { 1: 14, 2: 13, 3: 12, 4: 11, 5: 10, øvrige: 9 },
    "S*/S**":     { 1: 15, 2: 14, 3: 13, 4: 12, 5: 11, øvrige: 10 },
    "S***/S****": null,
  },
  "B-klasser": {
    "LE/LD/LC":   null,
    "LB*/LB**":   null,
    "LA*/LA**":   { 1: 17, 2: 16, 3: 15, 4: 14, 5: 13, øvrige: 12 },
    "MB*/MB**":   { 1: 18, 2: 17, 3: 16, 4: 15, 5: 14, øvrige: 13 },
    "MA*/MA**":   { 1: 19, 2: 18, 3: 17, 4: 16, 5: 15, øvrige: 14 },
    "S*/S**":     { 1: 20, 2: 19, 3: 18, 4: 17, 5: 16, øvrige: 15 },
    "S***/S****": { 1: 21, 2: 20, 3: 19, 4: 18, 5: 17, øvrige: 16 },
  },
  "A-klasser (internat.)": {
    "LE/LD/LC":   null,
    "LB*/LB**":   null,
    "LA*/LA**":   { 1: 22, 2: 21, 3: 20, 4: 19, 5: 18, øvrige: 17 },
    "MB*/MB**":   { 1: 23, 2: 22, 3: 21, 4: 20, 5: 19, øvrige: 18 },
    "MA*/MA**":   { 1: 24, 2: 23, 3: 22, 4: 21, 5: 20, øvrige: 19 },
    "S*/S**":     { 1: 25, 2: 24, 3: 23, 4: 22, 5: 21, øvrige: 20 },
    "S***/S****": { 1: 26, 2: 25, 3: 24, 4: 23, 5: 23, øvrige: 21 },
  },
};

export interface ResultatType {
  klasseGruppe: string;
  svaerhedsgrad: string;
  placering: number | null;
  erOvrige: boolean;
  fejlfriB0: boolean;
  stilspringKarakter: number | null;
  erSloejfespring: boolean;
}

export interface RanglisteResultat {
  rytter: string;
  hest: string;
  kategori: string;
  beregnede_point?: number | null;
}

export interface RanglisteEntry {
  placering: number;
  rytter: string;
  hest: string;
  totalPoint: number;
  antalResultater: number;
}

// 1. Placeringspoint
export function beregnPlaceringsPoint(
  klasseGruppe: string,
  svaerhedsgrad: string,
  placering: number | null,
  erOvrige: boolean
): number {
  const raekke = POINT_TABEL[klasseGruppe]?.[svaerhedsgrad];
  if (!raekke) return 0;
  if (erOvrige || (placering != null && placering > 5)) return raekke.øvrige;
  if (placering != null && placering >= 1 && placering <= 5) {
    return raekke[placering as 1 | 2 | 3 | 4 | 5];
  }
  return 0;
}

// 2. B0: point svarende til "øvrige" i sværhedsgraden
export function beregnB0Point(klasseGruppe: string, svaerhedsgrad: string): number {
  return beregnPlaceringsPoint(klasseGruppe, svaerhedsgrad, null, true);
}

// 3. Sløjfespring: altid 1 point
export function beregnSloejfespringPoint(): number {
  return 1;
}

// 4. Stilspringbonus (gives KUN hvis ingen placering)
export function beregnStilspringBonus(klasseGruppe: string, karakter: number | null): number {
  if (karakter == null || karakter < 8.0) return 0;
  // C og D-niveau giver 2, B og A-niveau giver 4
  if (klasseGruppe === 'E og D-klasser' || klasseGruppe === 'C-klasser') return 2;
  if (klasseGruppe === 'B-klasser' || klasseGruppe === 'A-klasser (internat.)') return 4;
  return 0;
}

// 5. Samlet point for ét resultat
export function beregnTotalPoint(resultat: ResultatType): number {
  const {klasseGruppe, svaerhedsgrad, placering, erOvrige, fejlfriB0, stilspringKarakter, erSloejfespring} = resultat;

  if (erSloejfespring) return beregnSloejfespringPoint();
  if (fejlfriB0) return beregnB0Point(klasseGruppe, svaerhedsgrad);

  // Placering tæller alene - bonus lægges ikke oveni
  if (placering != null) {
    return beregnPlaceringsPoint(klasseGruppe, svaerhedsgrad, placering, erOvrige);
  }

  // Ingen placering: stilspringbonus hvis relevant
  if (stilspringKarakter != null) {
    return beregnStilspringBonus(klasseGruppe, stilspringKarakter);
  }

  // Øvrige uden placering
  if (erOvrige) {
    return beregnPlaceringsPoint(klasseGruppe, svaerhedsgrad, null, true);
  }

  return 0;
}

// 6. Rangliste pr. kategori (grupperet på rytter+hest)
export function beregnRangliste(
  resultater: RanglisteResultat[],
  kategori: 'Pony spring' | 'Hest spring'
): RanglisteEntry[] {
  const ekvipager = new Map<string, {rytter: string; hest: string; totalPoint: number; antalResultater: number}>();

  // Fjern Equipes " - tal"-suffiks på hestenavne, så samme hest ikke splittes op
  const rentHestNavn = (h: string) => (h || '').replace(/\s*-\s*\d+\s*$/, '').trim();

  for (const r of resultater) {
    if (r.kategori !== kategori) continue;
    const rytter = (r.rytter || '').trim();
    const hest = rentHestNavn(r.hest);
    const noegle = `${rytter.toLowerCase()}||${hest.toLowerCase()}`;
    const eksisterende = ekvipager.get(noegle) ?? {rytter, hest, totalPoint: 0, antalResultater: 0};
    eksisterende.totalPoint += r.beregnede_point ?? 0;
    eksisterende.antalResultater += 1;
    ekvipager.set(noegle, eksisterende);
  }

  return Array.from(ekvipager.values())
    .sort((a, b) => b.totalPoint - a.totalPoint)
    .map((e, i) => ({
      placering: i + 1,
      rytter: e.rytter,
      hest: e.hest,
      totalPoint: e.totalPoint,
      antalResultater: e.antalResultater,
    }));
}

// 7. Kvalificerer kategorien til præmier?
export function kvalificererTilPraemie(
  rangliste: RanglisteEntry[]
): { praemieres: boolean; aarsag?: string } {
  if (rangliste.length < 5) {
    return {praemieres: false, aarsag: 'Der skal minimum 5 ekvipager med point for at uddele præmier i denne kategori.'};
  }
  const topFem = rangliste.slice(0, 5);
  const alleOver25 = topFem.every((e) => e.totalPoint >= 25);
  if (!alleOver25) {
    return {praemieres: false, aarsag: 'De 5 bedst placerede skal have minimum 25 point hver.'};
  }
  return {praemieres: true};
}
