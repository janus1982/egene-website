"use client";

// Egene Medlemsplatform - tynd ende-til-ende-skive (CO trin 1):
// magic link-login -> væg med opslag -> aktivér push.
// Klubnavn/branding hentes fra clubs-tabellen (template-disciplin: intet hardcodet klubnavn i logik).

import Image from "next/image";
import { useEffect, useState } from "react";
import { getSupabase } from "../../lib/supabase/client";

function urlBase64TilUint8Array(base64) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export default function Platform() {
  const supabase = getSupabase();
  const [klar, setKlar] = useState(false);
  const [session, setSession] = useState(null);
  const [klub, setKlub] = useState(null);
  const [medlem, setMedlem] = useState(null);
  const [opslag, setOpslag] = useState([]);
  const [email, setEmail] = useState("");
  const [besked, setBesked] = useState("");
  const [pushStatus, setPushStatus] = useState("");

  // Session + data
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setKlar(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data: klubber } = await supabase.from("clubs").select("*").limit(1);
      setKlub(klubber?.[0] ?? null);
      const { data: mig } = await supabase
        .from("members")
        .select("*")
        .eq("auth_user_id", session.user.id)
        .maybeSingle();
      setMedlem(mig);
      if (mig?.status === "approved") {
        const { data: ops } = await supabase
          .from("posts")
          .select("id, body, created_at, author_id")
          .order("created_at", { ascending: false })
          .limit(50);
        setOpslag(ops ?? []);
      }
    })();
  }, [session, supabase]);

  async function sendMagicLink(e) {
    e.preventDefault();
    setBesked("");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/platform` },
    });
    setBesked(error ? `Fejl: ${error.message}` : "Tjek din mail - vi har sendt dig et login-link.");
  }

  async function aktiverPush() {
    setPushStatus("");
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setPushStatus("Din browser understøtter ikke push. På iPhone: føj siden til hjemmeskærmen først.");
        return;
      }
      const reg = await navigator.serviceWorker.register("/sw.js");
      const tilladelse = await Notification.requestPermission();
      if (tilladelse !== "granted") {
        setPushStatus("Notifikationer blev ikke tilladt.");
        return;
      }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64TilUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
      });
      const { error } = await supabase
        .from("push_subscriptions")
        .insert({ member_id: medlem.id, subscription: sub.toJSON() });
      setPushStatus(error ? `Kunne ikke gemme: ${error.message}` : "Notifikationer er slået til.");
    } catch (err) {
      setPushStatus(`Fejl: ${err.message}`);
    }
  }

  async function logUd() {
    await supabase.auth.signOut();
    setMedlem(null);
    setOpslag([]);
  }

  const klubNavn = klub?.name ?? "Medlemsplatform";

  if (!klar) return <main className="min-h-screen bg-green-50/40" />;

  return (
    <main className="min-h-screen bg-green-50/40 text-[#1a1a1a]">
      {/* App-header */}
      <header className="bg-green-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="bg-white rounded-lg p-1">
            <Image src={klub?.branding?.logo ?? "/logo.png"} alt="" width={28} height={28} className="object-contain" />
          </span>
          <span className="font-semibold text-sm">{klubNavn}</span>
        </div>
        {session && (
          <button onClick={logUd} className="text-white/70 hover:text-white text-sm">Log ud</button>
        )}
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Ikke logget ind: magic link */}
        {!session && (
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 mt-8">
            <h1 className="text-xl font-bold text-green-900 mb-2">Log ind</h1>
            <p className="text-gray-600 text-sm mb-4">
              Indtast din e-mail, så sender vi dig et login-link. Ingen adgangskode.
            </p>
            <form onSubmit={sendMagicLink} className="flex flex-col gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@mail.dk"
                className="rounded-xl border border-green-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <button type="submit" className="bg-green-800 hover:bg-green-700 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors">
                Send login-link
              </button>
            </form>
            {besked && <p className="text-sm text-green-700 mt-3">{besked}</p>}
          </div>
        )}

        {/* Logget ind, men afventer godkendelse (pending ser intet - håndhævet af RLS) */}
        {session && (!medlem || medlem.status !== "approved") && (
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 mt-8 text-center">
            <h1 className="text-xl font-bold text-green-900 mb-2">Din konto afventer godkendelse</h1>
            <p className="text-gray-600 text-sm">
              Du er logget ind, men en administrator skal godkende dig, før du kan se indhold.
              Du får adgang, så snart det er sket.
            </p>
          </div>
        )}

        {/* Godkendt: væggen */}
        {session && medlem?.status === "approved" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-bold text-green-900">Væggen</h1>
              <button onClick={aktiverPush} className="text-sm bg-white border border-green-200 hover:bg-green-50 text-green-800 rounded-full px-4 py-1.5 transition-colors">
                Aktivér notifikationer
              </button>
            </div>
            {pushStatus && <p className="text-sm text-green-700 mb-3">{pushStatus}</p>}

            {opslag.length === 0 ? (
              <p className="text-gray-500 text-sm">Ingen opslag endnu.</p>
            ) : (
              <div className="space-y-3">
                {opslag.map((o) => (
                  <article key={o.id} className="bg-white rounded-2xl shadow-sm border border-green-100 p-4">
                    <p className="text-gray-800 text-sm whitespace-pre-wrap">{o.body}</p>
                    <p className="text-gray-400 text-xs mt-2">
                      {new Date(o.created_at).toLocaleString("da-DK", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
