"use client";

// Egene Medlemsplatform (CO Fase 1, trin 1-5)
// Væg (alle/hold) + Beskeder (direkte) er SAMME objekt (posts) med forskelligt scope.
// Al adgangskontrol håndhæves af RLS i databasen - UI'et er kun den pæne overflade.

import Image from "next/image";
import { useEffect, useState } from "react";
import { getSupabase } from "../../lib/supabase/client";

function urlBase64TilUint8Array(base64) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

function datoKort(d) {
  return new Date(d).toLocaleString("da-DK", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function Platform() {
  const supabase = getSupabase();
  const [klar, setKlar] = useState(false);
  const [session, setSession] = useState(null);
  const [klub, setKlub] = useState(null);
  const [medlem, setMedlem] = useState(null);
  const [medlemmer, setMedlemmer] = useState([]);
  const [holdListe, setHoldListe] = useState([]);
  const [opslag, setOpslag] = useState([]);
  const [kommentarer, setKommentarer] = useState({});
  const [fane, setFane] = useState("vaeg");
  const [email, setEmail] = useState("");
  const [besked, setBesked] = useState("");
  const [pushStatus, setPushStatus] = useState("");

  // ---------- Session ----------
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setKlar(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  async function hentData(mig) {
    const [{ data: ops }, { data: alle }, { data: hold }] = await Promise.all([
      supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("members").select("id, full_name, role, is_minor").eq("status", "approved"),
      supabase.from("holds").select("id, name").order("name"),
    ]);
    setOpslag(ops ?? []);
    setMedlemmer((alle ?? []).filter((m) => m.id !== mig.id));
    setHoldListe(hold ?? []);
    if (ops?.length) {
      const { data: komm } = await supabase
        .from("comments")
        .select("*")
        .in("post_id", ops.map((o) => o.id))
        .order("created_at");
      const grupperet = {};
      for (const k of komm ?? []) (grupperet[k.post_id] ??= []).push(k);
      setKommentarer(grupperet);
    }
  }

  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data: klubber } = await supabase.from("clubs").select("*").limit(1);
      setKlub(klubber?.[0] ?? null);
      const { data: mig } = await supabase
        .from("members").select("*").eq("auth_user_id", session.user.id).maybeSingle();
      setMedlem(mig);
      if (mig?.status === "approved") await hentData(mig);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const navnFor = (id) => {
    if (id === medlem?.id) return medlem.full_name;
    return medlemmer.find((m) => m.id === id)?.full_name ?? "Ukendt";
  };

  // ---------- Login ----------
  async function sendMagicLink(e) {
    e.preventDefault();
    setBesked("");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/platform` },
    });
    setBesked(error ? `Fejl: ${error.message}` : "Tjek din mail - vi har sendt dig et login-link.");
  }

  const [linkTekst, setLinkTekst] = useState("");
  async function logIndMedLink(e) {
    e.preventDefault();
    setBesked("");
    try {
      const url = new URL(linkTekst.trim());
      const tokenHash = url.searchParams.get("token") || url.searchParams.get("token_hash");
      if (!tokenHash) throw new Error("Kunne ikke finde koden i linket");
      let { error } = await supabase.auth.verifyOtp({ type: "magiclink", token_hash: tokenHash });
      if (error) ({ error } = await supabase.auth.verifyOtp({ type: "email", token_hash: tokenHash }));
      setBesked(error ? `Fejl: ${error.message}` : "");
    } catch (err) {
      setBesked(`Fejl: ${err.message}`);
    }
  }

  async function logUd() {
    await supabase.auth.signOut();
    setMedlem(null);
    setOpslag([]);
  }

  // ---------- Tilmelding ----------
  const [navn, setNavn] = useState("");
  const [rolleValg, setRolleValg] = useState("medlem");
  const [barnNavn, setBarnNavn] = useState("");
  async function tilmeld(e) {
    e.preventDefault();
    setBesked("");
    const { data: klubber } = await supabase.from("clubs").select("id").limit(1);
    const { error } = await supabase.from("members").insert({
      club_id: klubber?.[0]?.id,
      auth_user_id: session.user.id,
      full_name: navn.trim(),
      email: session.user.email,
      role: rolleValg,
      status: "pending",
      signup_note: rolleValg === "guardian" && barnNavn.trim() ? `Forælder til: ${barnNavn.trim()}` : null,
    });
    if (error) setBesked(`Fejl: ${error.message}`);
    else {
      const { data: mig } = await supabase.from("members").select("*").eq("auth_user_id", session.user.id).maybeSingle();
      setMedlem(mig);
    }
  }

  // ---------- Push ----------
  async function aktiverPush() {
    setPushStatus("");
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setPushStatus("Din browser understøtter ikke push. På iPhone: føj siden til hjemmeskærmen først.");
        return;
      }
      const reg = await navigator.serviceWorker.register("/sw.js");
      const tilladelse = await Notification.requestPermission();
      if (tilladelse !== "granted") return setPushStatus("Notifikationer blev ikke tilladt.");
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64TilUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
      });
      const { error } = await supabase
        .from("push_subscriptions").insert({ member_id: medlem.id, subscription: sub.toJSON() });
      setPushStatus(error ? `Kunne ikke gemme: ${error.message}` : "Notifikationer er slået til.");
    } catch (err) {
      setPushStatus(`Fejl: ${err.message}`);
    }
  }

  async function sendPush(postId) {
    const { data: s } = await supabase.auth.getSession();
    fetch("/api/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${s.session.access_token}` },
      body: JSON.stringify({ post_id: postId }),
    }).catch(() => {});
  }

  // ---------- Nyt opslag (væg: alle/hold) ----------
  const [nytOpslag, setNytOpslag] = useState("");
  const [opslagScope, setOpslagScope] = useState("all");
  async function opslaa(e) {
    e.preventDefault();
    const tekst = nytOpslag.trim();
    if (!tekst) return;
    const erHold = opslagScope !== "all";
    const { data: nyt, error } = await supabase
      .from("posts")
      .insert({
        club_id: medlem.club_id,
        author_id: medlem.id,
        scope: erHold ? "hold" : "all",
        hold_id: erHold ? opslagScope : null,
        body: tekst,
      })
      .select().single();
    if (error) return setBesked(`Fejl: ${error.message}`);
    setOpslag((o) => [nyt, ...o]);
    setNytOpslag("");
    sendPush(nyt.id);
  }

  // ---------- Ny direkte besked ----------
  const [nyBesked, setNyBesked] = useState("");
  const [valgteModtagere, setValgteModtagere] = useState([]);
  function skiftModtager(id) {
    setValgteModtagere((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]));
  }
  async function sendDirekte(e) {
    e.preventDefault();
    const tekst = nyBesked.trim();
    if (!tekst || valgteModtagere.length === 0) return setBesked("Vælg mindst én modtager.");
    const { data: nyt, error } = await supabase
      .from("posts")
      .insert({ club_id: medlem.club_id, author_id: medlem.id, scope: "direct", body: tekst })
      .select().single();
    if (error) return setBesked(`Fejl: ${error.message}`);
    // Modtagere - guardians til mindreårige tilføjes AUTOMATISK af databasens trigger
    const { error: prFejl } = await supabase
      .from("post_recipients")
      .insert(valgteModtagere.map((id) => ({ post_id: nyt.id, member_id: id })));
    if (prFejl) return setBesked(`Fejl: ${prFejl.message}`);
    setOpslag((o) => [nyt, ...o]);
    setNyBesked("");
    setValgteModtagere([]);
    setBesked("");
    sendPush(nyt.id);
  }

  // ---------- Kommentar ----------
  const [svarTekst, setSvarTekst] = useState({});
  async function svar(postId) {
    const tekst = (svarTekst[postId] || "").trim();
    if (!tekst) return;
    const { data: ny, error } = await supabase
      .from("comments")
      .insert({ post_id: postId, author_id: medlem.id, body: tekst })
      .select().single();
    if (error) return setBesked(`Fejl: ${error.message}`);
    setKommentarer((k) => ({ ...k, [postId]: [...(k[postId] ?? []), ny] }));
    setSvarTekst((s) => ({ ...s, [postId]: "" }));
  }

  const kanSkriveAlle = ["admin", "beridder"].includes(medlem?.role);
  const kanSkriveDirekte = ["admin", "beridder", "underviser", "guardian"].includes(medlem?.role);
  const vaegOpslag = opslag.filter((o) => o.scope === "all" || o.scope === "hold");
  const direkteOpslag = opslag.filter((o) => o.scope === "direct");
  const klubNavn = klub?.name ?? "Medlemsplatform";

  if (!klar) return <main className="min-h-screen bg-green-50/40" />;

  // ---------- Opslagskort (genbruges af begge faner) ----------
  // NB: almindelig funktion (ikke komponent) - ellers genskabes felterne ved
  // hvert tastetryk og input-fokus ryger.
  function kort(o) {
    const erHold = o.scope === "hold";
    const holdNavn = erHold ? holdListe.find((h) => h.id === o.hold_id)?.name : null;
    return (
      <article key={o.id} className="bg-white rounded-2xl shadow-sm border border-green-100 p-4">
        <div className="flex items-baseline justify-between gap-2">
          <p className="font-semibold text-green-900 text-sm">{navnFor(o.author_id)}</p>
          <p className="text-gray-400 text-xs shrink-0">{datoKort(o.created_at)}</p>
        </div>
        {(holdNavn || o.scope === "direct") && (
          <p className="text-xs text-green-700 mt-0.5">{o.scope === "direct" ? "Direkte besked" : `Hold: ${holdNavn}`}</p>
        )}
        <p className="text-gray-800 text-sm whitespace-pre-wrap mt-2">{o.body}</p>

        {/* Kommentartråd */}
        <div className="mt-3 pt-3 border-t border-green-50 space-y-2">
          {(kommentarer[o.id] ?? []).map((k) => (
            <div key={k.id} className="bg-green-50/60 rounded-xl px-3 py-2">
              <p className="text-xs font-semibold text-green-900">{navnFor(k.author_id)}</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{k.body}</p>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="text"
              value={svarTekst[o.id] ?? ""}
              onChange={(e) => setSvarTekst((s) => ({ ...s, [o.id]: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && svar(o.id)}
              placeholder="Svar..."
              className="flex-1 rounded-full border border-green-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <button onClick={() => svar(o.id)} className="text-sm text-green-800 font-medium px-2">Send</button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <main className="min-h-screen bg-green-50/40 text-[#1a1a1a]">
      <header className="bg-green-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="bg-white rounded-lg p-1">
            <Image src={klub?.branding?.logo ?? "/logo.png"} alt="" width={28} height={28} className="object-contain" />
          </span>
          <span className="font-semibold text-sm">{klubNavn}</span>
        </div>
        {session && <button onClick={logUd} className="text-white/70 hover:text-white text-sm">Log ud</button>}
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* ---------- Login ---------- */}
        {!session && (
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 mt-8">
            <h1 className="text-xl font-bold text-green-900 mb-2">Log ind</h1>
            <p className="text-gray-600 text-sm mb-4">Indtast din e-mail, så sender vi dig et login-link. Ingen adgangskode.</p>
            <form onSubmit={sendMagicLink} className="flex flex-col gap-3">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="din@mail.dk"
                className="rounded-xl border border-green-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
              <button type="submit" className="bg-green-800 hover:bg-green-700 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors">
                Send login-link
              </button>
            </form>
            {besked && <p className="text-sm text-green-700 mt-3">{besked}</p>}
            <details className="mt-5">
              <summary className="text-sm text-green-800 cursor-pointer">Logger du ind i appen på iPhone? Tryk her</summary>
              <p className="text-gray-600 text-xs mt-2 mb-2">Hold fingeren på login-knappen/linket i mailen, vælg "Kopiér link", og indsæt det her:</p>
              <form onSubmit={logIndMedLink} className="flex flex-col gap-2">
                <textarea rows={3} value={linkTekst} onChange={(e) => setLinkTekst(e.target.value)} placeholder="Indsæt linket fra mailen..."
                  className="rounded-xl border border-green-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-green-300" />
                <button type="submit" className="bg-green-100 hover:bg-green-200 text-green-900 rounded-xl px-4 py-2 text-sm font-medium transition-colors">
                  Log ind med linket
                </button>
              </form>
            </details>
          </div>
        )}

        {/* ---------- Tilmelding ---------- */}
        {session && !medlem && (
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 mt-8">
            <h1 className="text-xl font-bold text-green-900 mb-2">Tilmeld dig</h1>
            <p className="text-gray-600 text-sm mb-4">Udfyld dine oplysninger. En administrator godkender dig, før du får adgang.</p>
            <form onSubmit={tilmeld} className="flex flex-col gap-3">
              <input type="text" required value={navn} onChange={(e) => setNavn(e.target.value)} placeholder="Dit fulde navn"
                className="rounded-xl border border-green-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
              <select value={rolleValg} onChange={(e) => setRolleValg(e.target.value)}
                className="rounded-xl border border-green-200 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-300">
                <option value="medlem">Jeg er rytter</option>
                <option value="guardian">Jeg er forælder/værge</option>
              </select>
              {rolleValg === "guardian" && (
                <input type="text" value={barnNavn} onChange={(e) => setBarnNavn(e.target.value)} placeholder="Mit barns fulde navn"
                  className="rounded-xl border border-green-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
              )}
              <button type="submit" className="bg-green-800 hover:bg-green-700 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors">
                Send tilmelding
              </button>
            </form>
            {besked && <p className="text-sm text-green-700 mt-3">{besked}</p>}
          </div>
        )}

        {/* ---------- Afventer godkendelse ---------- */}
        {session && medlem && medlem.status !== "approved" && (
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 mt-8 text-center">
            <h1 className="text-xl font-bold text-green-900 mb-2">Din konto afventer godkendelse</h1>
            <p className="text-gray-600 text-sm">
              Tak for din tilmelding, {medlem.full_name?.split(" ")[0]}. En administrator godkender dig snarest.
            </p>
          </div>
        )}

        {/* ---------- Godkendt: faner ---------- */}
        {session && medlem?.status === "approved" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-1 bg-white border border-green-100 rounded-full p-1">
                <button onClick={() => setFane("vaeg")}
                  className={"text-sm rounded-full px-4 py-1.5 transition-colors " + (fane === "vaeg" ? "bg-green-800 text-white" : "text-green-800")}>
                  Væggen
                </button>
                <button onClick={() => setFane("beskeder")}
                  className={"text-sm rounded-full px-4 py-1.5 transition-colors " + (fane === "beskeder" ? "bg-green-800 text-white" : "text-green-800")}>
                  Beskeder {direkteOpslag.length > 0 && `(${direkteOpslag.length})`}
                </button>
              </div>
              <div className="flex gap-2">
                {medlem.role === "admin" && (
                  <a href="/platform/admin" className="text-sm bg-green-800 hover:bg-green-700 text-white rounded-full px-3 py-1.5 transition-colors">Admin</a>
                )}
                <button onClick={aktiverPush} title="Aktivér notifikationer"
                  className="text-sm bg-white border border-green-200 hover:bg-green-50 text-green-800 rounded-full px-3 py-1.5 transition-colors">
                  🔔
                </button>
              </div>
            </div>
            {pushStatus && <p className="text-sm text-green-700 mb-3">{pushStatus}</p>}
            {besked && <p className="text-sm text-red-600 mb-3">{besked}</p>}

            {/* ---------- VÆGGEN ---------- */}
            {fane === "vaeg" && (
              <>
                {kanSkriveAlle && (
                  <form onSubmit={opslaa} className="bg-white rounded-2xl shadow-sm border border-green-100 p-4 mb-4 flex flex-col gap-2">
                    <textarea rows={3} value={nytOpslag} onChange={(e) => setNytOpslag(e.target.value)} placeholder="Skriv et opslag..."
                      className="rounded-xl border border-green-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 resize-none" />
                    <div className="flex items-center justify-between gap-2">
                      <select value={opslagScope} onChange={(e) => setOpslagScope(e.target.value)}
                        className="rounded-xl border border-green-200 px-3 py-1.5 text-sm bg-white focus:outline-none">
                        <option value="all">Til alle</option>
                        {holdListe.map((h) => (
                          <option key={h.id} value={h.id}>Hold: {h.name}</option>
                        ))}
                      </select>
                      <button type="submit" className="bg-green-800 hover:bg-green-700 text-white rounded-full px-5 py-1.5 text-sm font-medium transition-colors">
                        Slå op
                      </button>
                    </div>
                  </form>
                )}
                {vaegOpslag.length === 0 ? (
                  <p className="text-gray-500 text-sm">Ingen opslag endnu.</p>
                ) : (
                  <div className="space-y-3">{vaegOpslag.map((o) => kort(o))}</div>
                )}
              </>
            )}

            {/* ---------- BESKEDER ---------- */}
            {fane === "beskeder" && (
              <>
                {kanSkriveDirekte && (
                  <form onSubmit={sendDirekte} className="bg-white rounded-2xl shadow-sm border border-green-100 p-4 mb-4 flex flex-col gap-2">
                    <textarea rows={3} value={nyBesked} onChange={(e) => setNyBesked(e.target.value)} placeholder="Skriv en direkte besked..."
                      className="rounded-xl border border-green-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 resize-none" />
                    <p className="text-xs text-gray-500">
                      Vælg modtagere. Beskeder til børn sendes automatisk også til deres forældre.
                    </p>
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                      {medlemmer.map((m) => (
                        <button key={m.id} type="button" onClick={() => skiftModtager(m.id)}
                          className={"text-xs rounded-full px-3 py-1 border transition-colors " +
                            (valgteModtagere.includes(m.id)
                              ? "bg-green-800 text-white border-green-800"
                              : "bg-white text-green-800 border-green-200 hover:bg-green-50")}>
                          {m.full_name}
                        </button>
                      ))}
                    </div>
                    <button type="submit" className="self-end bg-green-800 hover:bg-green-700 text-white rounded-full px-5 py-1.5 text-sm font-medium transition-colors">
                      Send besked
                    </button>
                  </form>
                )}
                {!kanSkriveDirekte && (
                  <p className="text-xs text-gray-500 mb-3">Du kan svare i tråde, men ikke starte nye beskeder.</p>
                )}
                {direkteOpslag.length === 0 ? (
                  <p className="text-gray-500 text-sm">Ingen beskeder endnu.</p>
                ) : (
                  <div className="space-y-3">{direkteOpslag.map((o) => kort(o))}</div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
