import {klassificer} from '../championat/klassifikation';
import {beregnTotalPoint} from '../championat/pointmodel';

const BASE = 'https://online.equipe.com/api/v1';

export interface EquipeStart {
  id: number;
  class_section_id: number;
  rank: number | null;
  meeting_class_start_at: string;
  meeting_name: string;
  meeting_class_name: string;
  rider_name: string;
  horse_name: string;
  club_name: string;
  discipline: string;
}

// 1. Søg alle starts for en klub i et givent år (paginerer automatisk)
export async function soegResultaterForKlub(klubNavn: string, _fraAar: number): Promise<EquipeStart[]> {
  const alle: EquipeStart[] = [];
  const sete = new Set<number>();
  let page = 1;

  while (page <= 25) {
    const url = `${BASE}/searches.json?q=${encodeURIComponent(klubNavn)}&qc=Start&discipline=H&page=${page}`;

    let res: Response;
    try {
      res = await fetch(url, {headers: {Accept: 'application/json'}, signal: AbortSignal.timeout(8000)});
    } catch {
      break; // timeout eller netværksfejl - stop pænt
    }
    if (!res.ok) break;

    const data = await res.json();
    const items: EquipeStart[] = Array.isArray(data) ? data : (data.results ?? data.data ?? []);
    if (!items.length) break;

    // Tæl kun NYE resultater - hvis siden gentager sig selv, stopper vi
    let nye = 0;
    for (const it of items) {
      if (it && it.id != null && !sete.has(it.id)) {
        sete.add(it.id);
        alle.push(it);
        nye++;
      }
    }
    if (nye === 0) break; // ingen nye -> paginering giver samme igen
    if (items.length < 20) break; // sidste side nået
    page++;
  }

  // Behold KUN ryttere hvis klub er præcis "Egene Rideklub",
  // og sortér ALTID tilmeldingsklasser fra (ikke rigtige resultater).
  return alle.filter(
    (s) =>
      (s.club_name || '').trim().toLowerCase() === 'egene rideklub' &&
      !/TILMELDING/i.test(s.meeting_class_name || '')
  );
}

// 2. Map ét Equipe-resultat til et Sanity championatResultat-dokument
export function mapEquipeTilChampionat(start: EquipeStart, saesonId: string) {
  const k = klassificer(start.meeting_class_name);
  const placering = start.rank ?? null;
  const erOvrige = placering != null && placering > 5;

  const point = k.ukendt
    ? 0
    : beregnTotalPoint({
        klasseGruppe: k.klasseGruppe ?? '',
        svaerhedsgrad: k.svaerhedsgrad ?? '',
        placering,
        erOvrige,
        fejlfriB0: k.erB0 && placering == null,
        stilspringKarakter: null,
        erSloejfespring: k.erSloejfespring,
      });

  return {
    _type: 'championatResultat',
    saeson: {_type: 'reference', _ref: saesonId},
    rytter: start.rider_name,
    hest: start.horse_name,
    kategori: k.kategori,
    staevne_navn: start.meeting_name,
    staevne_dato: (start.meeting_class_start_at || '').slice(0, 10),
    staevne_type: 'Klub', // Equipe oplyser ikke type - default, kan rettes manuelt
    klasse_navn: (start.meeting_class_name || '').trim(),
    klasse_gruppe: k.klasseGruppe ?? undefined,
    svaerhedsgrad: k.svaerhedsgrad ?? undefined,
    placering: placering ?? undefined,
    er_ovrige: erOvrige,
    fejlfri_b0: k.erB0,
    beregnede_point: point,
    kilde: 'Equipe (automatisk)',
    equipe_start_id: start.id,
    noter: k.ukendt
      ? 'Ukendt klasse - sæt klassegruppe og sværhedsgrad manuelt, så beregnes point automatisk.'
      : undefined,
  };
}
