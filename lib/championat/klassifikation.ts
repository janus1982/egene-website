// Best-effort klassifikation af Equipe-klassenavne til Egenes championat-model.
// Følger DRF-præfiksreglen. Usikre klasser markeres som "ukendt" og finjusteres
// manuelt i Studio (så beregnes point bagefter).

export interface Klassifikation {
  kategori: 'Pony spring' | 'Hest spring';
  klasseGruppe: string | null;
  svaerhedsgrad: string | null;
  erB0: boolean;
  erSloejfespring: boolean;
  ukendt: boolean;
}

export function klassificer(meetingClassName: string): Klassifikation {
  const navn = (meetingClassName || '').toUpperCase();

  const kategori: 'Pony spring' | 'Hest spring' = /PONY/.test(navn) ? 'Pony spring' : 'Hest spring';
  const erSloejfespring = /SLØJF/.test(navn);
  const erB0 = /\bB0\b/.test(navn);

  // Sværhedsgrad (højde-kode) - tjek de højeste først
  let svaerhedsgrad: string | null = null;
  if (/S\*{3}/.test(navn)) svaerhedsgrad = 'S***/S****';
  else if (/S\*{1,2}/.test(navn) || /\bS\d/.test(navn)) svaerhedsgrad = 'S*/S**';
  else if (/MA/.test(navn)) svaerhedsgrad = 'MA*/MA**';
  else if (/MB/.test(navn)) svaerhedsgrad = 'MB*/MB**';
  else if (/LA/.test(navn)) svaerhedsgrad = 'LA*/LA**';
  else if (/LB/.test(navn)) svaerhedsgrad = 'LB*/LB**';
  else if (/L[EDC]/.test(navn)) svaerhedsgrad = 'LE/LD/LC';

  // Klassegruppe (DRF-præfiksregel)
  let klasseGruppe: string | null = null;
  if (/S\*{3}/.test(navn) || /CSI/.test(navn)) klasseGruppe = 'A-klasser (internat.)';
  else if (/S\*{1,2}/.test(navn) || /\bS\d/.test(navn) || /\bB\d/.test(navn)) klasseGruppe = 'B-klasser';
  else if (/LB|LA|MB|MA/.test(navn)) klasseGruppe = 'C-klasser';
  else if (/L[EDC]/.test(navn)) klasseGruppe = 'E og D-klasser';

  // Sløjfespring giver altid 1 point uanset gruppe, så den er aldrig "ukendt"
  const ukendt = erSloejfespring ? false : (klasseGruppe == null || svaerhedsgrad == null);

  return {kategori, klasseGruppe, svaerhedsgrad, erB0, erSloejfespring, ukendt};
}
