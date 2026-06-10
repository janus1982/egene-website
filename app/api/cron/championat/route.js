import { writeClient } from "../../../../sanity/lib/writeClient";
import { soegResultaterForKlub, mapEquipeTilChampionat } from "../../../../lib/equipe/client";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request) {
  // Lokalt (udvikling) er routen åben, så den kan testes direkte i browseren.
  // På den live side (production) kræves Bearer-tokenet - Vercel Cron sender det automatisk.
  const erProduktion = process.env.NODE_ENV === "production";
  if (erProduktion && request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Kig-funktion: ?debug=1 viser de RÅ klubnavne fra Equipe (uden filter)
  const debug = new URL(request.url).searchParams.get("debug") === "1";
  if (debug) {
    const r = await fetch("https://online.equipe.com/api/v1/searches.json?q=Egene&qc=Start&discipline=H&page=1");
    const data = await r.json();
    const items = Array.isArray(data) ? data : [];
    const klubber = {};
    for (const it of items) klubber[it.club_name] = (klubber[it.club_name] || 0) + 1;
    return Response.json({
      antalPaaSide1: items.length,
      klubber,
      eksempler: items.slice(0, 8).map((i) => ({ rytter: i.rider_name, klub: i.club_name, klasse: i.meeting_class_name })),
    });
  }

  // 1. Find aktiv sæson
  const saeson = await writeClient.fetch(`*[_type=="championatSaeson" && aktiv==true][0]{_id, aar}`);
  if (!saeson) {
    return Response.json({ ok: false, fejl: "Ingen aktiv sæson fundet" });
  }

  // Nulstilling: ?reset=1 sletter ALLE automatisk-importerede resultater først,
  // så vi kan hente rent forfra (manuelle indberetninger røres ikke).
  const reset = new URL(request.url).searchParams.get("reset") === "1";
  if (reset) {
    await writeClient.delete({ query: `*[_type=="championatResultat" && kilde=="Equipe (automatisk)"]` });
  }

  // 2. Hent alle Egene-resultater fra Equipe og filtrér til sæsonens år
  const alle = await soegResultaterForKlub("Egene", saeson.aar);
  const starts = alle.filter((s) =>
    String(s.meeting_class_start_at || "").startsWith(String(saeson.aar))
  );

  // Tør-test: ?dryrun=1 henter kun data og gemmer IKKE (til fejlsøgning)
  const dryrun = new URL(request.url).searchParams.get("dryrun") === "1";
  if (dryrun) {
    return Response.json({ ok: true, dryrun: true, aar: saeson.aar, fundet: alle.length, iAaret: starts.length });
  }

  // 3. Hent allerede importerede start-ID'er (deduplikering)
  const eksisterende = await writeClient.fetch(
    `*[_type=="championatResultat" && defined(equipe_start_id)].equipe_start_id`
  );
  const kendt = new Set(eksisterende);

  // 4. Saml nye resultater (spring allerede importerede over)
  const nye = [];
  for (const start of starts) {
    if (kendt.has(start.id)) continue;
    kendt.add(start.id);
    nye.push(mapEquipeTilChampionat(start, saeson._id));
  }

  // 5. Gem i bundter af 50 (én forsendelse pr. bundt = hurtigt)
  let importeret = 0;
  for (let i = 0; i < nye.length; i += 50) {
    const bundt = nye.slice(i, i + 50);
    const tx = writeClient.transaction();
    for (const doc of bundt) tx.create(doc);
    await tx.commit();
    importeret += bundt.length;
  }

  return Response.json({
    ok: true,
    aar: saeson.aar,
    fundet: alle.length,
    iAaret: starts.length,
    importeret,
  });
}
