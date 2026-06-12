"use client";

// Admin (CO trin 2-4): godkendelser, guardian-kobling og holdadministration.
// Kun admin kan bruge siden - håndhævet af RLS, ikke kun af UI'et.

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabase } from "../../../lib/supabase/client";

const ALLE_TAGS = ["klubmedlem", "pensionær", "ekstern_elev"];

export default function Admin() {
  const supabase = getSupabase();
  const [klar, setKlar] = useState(false);
  const [erAdmin, setErAdmin] = useState(false);
  const [migId, setMigId] = useState(null);
  const [klubId, setKlubId] = useState(null);
  const [ventende, setVentende] = useState([]);
  const [relationer, setRelationer] = useState([]);
  const [alleMedlemmer, setAlleMedlemmer] = useState([]);
  const [holdListe, setHoldListe] = useState([]);
  const [holdMedlemmer, setHoldMedlemmer] = useState([]);
  const [tagValg, setTagValg] = useState({});
  const [besked, setBesked] = useState("");

  async function hentAlt() {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return setKlar(true);
    const { data: mig } = await supabase
      .from("members").select("id, role, status, club_id").eq("auth_user_id", session.session.user.id).maybeSingle();
    const admin = mig?.role === "admin" && mig?.status === "approved";
    setErAdmin(admin);
    setMigId(mig?.id);
    setKlubId(mig?.club_id);
    if (admin) {
      const [{ data: pend }, { data: rel }, { data: alle }, { data: hold }, { data: hm }] = await Promise.all([
        supabase.from("members").select("*").eq("status", "pending").order("created_at"),
        supabase.from("guardians").select("*"),
        supabase.from("members").select("id, full_name, role, status, is_minor").order("full_name"),
        supabase.from("holds").select("*").order("name"),
        supabase.from("hold_members").select("*"),
      ]);
      setVentende(pend ?? []);
      setRelationer(rel ?? []);
      setAlleMedlemmer(alle ?? []);
      setHoldListe(hold ?? []);
      setHoldMedlemmer(hm ?? []);
    }
    setKlar(true);
  }

  useEffect(() => {
    hentAlt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navnFor = (id) => alleMedlemmer.find((m) => m.id === id)?.full_name ?? "?";

  // ---------- Godkend medlem ----------
  function skiftTag(medlemId, tag) {
    setTagValg((v) => {
      const nuv = new Set(v[medlemId] ?? ["klubmedlem"]);
      nuv.has(tag) ? nuv.delete(tag) : nuv.add(tag);
      return { ...v, [medlemId]: [...nuv] };
    });
  }
  async function godkendMedlem(m) {
    const tags = tagValg[m.id] ?? ["klubmedlem"];
    const { error } = await supabase.from("members").update({ status: "approved", tags }).eq("id", m.id);
    setBesked(error ? `Fejl: ${error.message}` : `${m.full_name} er godkendt.`);
    if (!error) hentAlt();
  }

  // ---------- Guardian-relationer ----------
  const [valgGuardian, setValgGuardian] = useState("");
  const [valgBarn, setValgBarn] = useState("");
  async function opretRelation(e) {
    e.preventDefault();
    if (!valgGuardian || !valgBarn) return;
    // Markér barnet som mindreårigt, så trigger-reglen om automatisk
    // guardian-inklusion ved direkte beskeder træder i kraft.
    const [{ error: f1 }, { error: f2 }] = await Promise.all([
      supabase.from("guardians").insert({ guardian_id: valgGuardian, child_id: valgBarn, status: "approved" }),
      supabase.from("members").update({ is_minor: true }).eq("id", valgBarn),
    ]);
    const fejl = f1 || f2;
    setBesked(fejl ? `Fejl: ${fejl.message}` : "Relationen er oprettet og godkendt.");
    if (!fejl) hentAlt();
  }
  async function godkendRelation(r) {
    const { error } = await supabase.from("guardians").update({ status: "approved" })
      .eq("guardian_id", r.guardian_id).eq("child_id", r.child_id);
    setBesked(error ? `Fejl: ${error.message}` : "Relationen er godkendt.");
    if (!error) hentAlt();
  }

  // ---------- Hold ----------
  const [nytHoldNavn, setNytHoldNavn] = useState("");
  async function opretHold(e) {
    e.preventDefault();
    const n = nytHoldNavn.trim();
    if (!n) return;
    const { error } = await supabase.from("holds").insert({ club_id: klubId, name: n });
    setBesked(error ? `Fejl: ${error.message}` : "");
    setNytHoldNavn("");
    if (!error) hentAlt();
  }
  const [holdValg, setHoldValg] = useState({});
  async function tilfoejTilHold(holdId) {
    const medlemId = holdValg[holdId];
    if (!medlemId) return;
    const { error } = await supabase.from("hold_members").insert({ hold_id: holdId, member_id: medlemId });
    setBesked(error ? `Fejl: ${error.message}` : "");
    if (!error) hentAlt();
  }
  async function fjernFraHold(holdId, medlemId) {
    const { error } = await supabase.from("hold_members").delete().eq("hold_id", holdId).eq("member_id", medlemId);
    if (!error) hentAlt();
  }

  if (!klar) return <main className="min-h-screen bg-green-50/40" />;

  const godkendte = alleMedlemmer.filter((m) => m.status === "approved" && m.id !== migId);
  const guardianKandidater = godkendte.filter((m) => m.role === "guardian");
  const pendingRel = relationer.filter((r) => r.status === "pending");

  const Kort = ({ children }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-4">{children}</div>
  );

  return (
    <main className="min-h-screen bg-green-50/40 text-[#1a1a1a]">
      <header className="bg-green-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="bg-white rounded-lg p-1">
            <Image src="/logo.png" alt="" width={28} height={28} className="object-contain" />
          </span>
          <span className="font-semibold text-sm">Admin</span>
        </div>
        <Link href="/platform" className="text-white/70 hover:text-white text-sm">Til væggen</Link>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {!erAdmin ? (
          <p className="text-gray-600 text-sm mt-8 text-center">Denne side kræver administrator-adgang.</p>
        ) : (
          <>
            {besked && <p className="text-sm text-green-700">{besked}</p>}

            {/* Ventende medlemmer */}
            <section>
              <h2 className="text-lg font-bold text-green-900 mb-3">Ventende medlemmer ({ventende.length})</h2>
              {ventende.length === 0 ? (
                <p className="text-gray-500 text-sm">Ingen ventende tilmeldinger.</p>
              ) : (
                <div className="space-y-3">
                  {ventende.map((m) => (
                    <Kort key={m.id}>
                      <p className="font-semibold text-green-900">{m.full_name}</p>
                      <p className="text-gray-500 text-xs">{m.email} · {m.role === "guardian" ? "Forælder/værge" : "Rytter"}</p>
                      {m.signup_note && <p className="text-gray-600 text-sm mt-1">{m.signup_note}</p>}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {ALLE_TAGS.map((tag) => {
                          const valgt = (tagValg[m.id] ?? ["klubmedlem"]).includes(tag);
                          return (
                            <button key={tag} type="button" onClick={() => skiftTag(m.id, tag)}
                              className={"text-xs rounded-full px-3 py-1 border transition-colors " +
                                (valgt ? "bg-green-800 text-white border-green-800" : "bg-white text-green-800 border-green-200 hover:bg-green-50")}>
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                      <button onClick={() => godkendMedlem(m)}
                        className="mt-3 w-full bg-green-800 hover:bg-green-700 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors">
                        Godkend
                      </button>
                    </Kort>
                  ))}
                </div>
              )}
            </section>

            {/* Guardian-relationer */}
            <section>
              <h2 className="text-lg font-bold text-green-900 mb-3">Forælder/barn-relationer</h2>
              {pendingRel.length > 0 && (
                <div className="space-y-3 mb-3">
                  {pendingRel.map((r) => (
                    <Kort key={`${r.guardian_id}-${r.child_id}`}>
                      <p className="text-sm text-gray-700">
                        <b className="text-green-900">{navnFor(r.guardian_id)}</b> er værge for{" "}
                        <b className="text-green-900">{navnFor(r.child_id)}</b>
                      </p>
                      <button onClick={() => godkendRelation(r)}
                        className="mt-2 w-full bg-green-800 hover:bg-green-700 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors">
                        Godkend relation
                      </button>
                    </Kort>
                  ))}
                </div>
              )}
              <Kort>
                <p className="text-sm font-semibold text-green-900 mb-2">Kobl forælder og barn</p>
                <form onSubmit={opretRelation} className="flex flex-col gap-2">
                  <select required value={valgGuardian} onChange={(e) => setValgGuardian(e.target.value)}
                    className="rounded-xl border border-green-200 px-3 py-2 text-sm bg-white">
                    <option value="">Vælg forælder/værge...</option>
                    {guardianKandidater.map((m) => <option key={m.id} value={m.id}>{m.full_name}</option>)}
                  </select>
                  <select required value={valgBarn} onChange={(e) => setValgBarn(e.target.value)}
                    className="rounded-xl border border-green-200 px-3 py-2 text-sm bg-white">
                    <option value="">Vælg barn...</option>
                    {godkendte.filter((m) => m.role === "medlem").map((m) => <option key={m.id} value={m.id}>{m.full_name}</option>)}
                  </select>
                  <button type="submit" className="bg-green-800 hover:bg-green-700 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors">
                    Opret godkendt relation
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-2">
                  Barnet markeres som mindreårigt, så forælderen automatisk får alle direkte beskeder til barnet.
                </p>
              </Kort>
            </section>

            {/* Holdadministration */}
            <section>
              <h2 className="text-lg font-bold text-green-900 mb-3">Hold</h2>
              <Kort>
                <form onSubmit={opretHold} className="flex gap-2">
                  <input type="text" value={nytHoldNavn} onChange={(e) => setNytHoldNavn(e.target.value)}
                    placeholder='Nyt hold, fx "Onsdag 16:00 - Begyndere"'
                    className="flex-1 rounded-xl border border-green-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
                  <button type="submit" className="bg-green-800 hover:bg-green-700 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors">
                    Opret
                  </button>
                </form>
              </Kort>
              <div className="space-y-3 mt-3">
                {holdListe.map((h) => {
                  const paaHold = holdMedlemmer.filter((x) => x.hold_id === h.id).map((x) => x.member_id);
                  const kanTilfoejes = godkendte.filter((m) => !paaHold.includes(m.id));
                  return (
                    <Kort key={h.id}>
                      <p className="font-semibold text-green-900 text-sm mb-2">{h.name}</p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {paaHold.length === 0 && <p className="text-xs text-gray-400">Ingen medlemmer endnu.</p>}
                        {paaHold.map((id) => (
                          <span key={id} className="text-xs bg-green-50 text-green-900 rounded-full px-3 py-1 flex items-center gap-1">
                            {navnFor(id)}
                            <button onClick={() => fjernFraHold(h.id, id)} className="text-green-700 hover:text-red-600">✕</button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <select value={holdValg[h.id] ?? ""} onChange={(e) => setHoldValg((v) => ({ ...v, [h.id]: e.target.value }))}
                          className="flex-1 rounded-xl border border-green-200 px-3 py-1.5 text-sm bg-white">
                          <option value="">Tilføj medlem...</option>
                          {kanTilfoejes.map((m) => <option key={m.id} value={m.id}>{m.full_name}</option>)}
                        </select>
                        <button onClick={() => tilfoejTilHold(h.id)} className="text-sm text-green-800 font-medium px-2">Tilføj</button>
                      </div>
                    </Kort>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
