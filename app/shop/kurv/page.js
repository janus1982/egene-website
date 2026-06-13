"use client";

// Bestillingsside: viser kurven, samler kundens oplysninger og afslutter.
// BETALING: MobilePay tilføjes som næste skridt. Indtil da vises klubbens
// MobilePay-nummer, og bestillingen kan sendes til klubben.

import Link from "next/link";
import { useEffect, useState } from "react";
import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";

const KURV_NOEGLE = "egene-kurv";

export default function Kurv() {
  const [kurv, setKurv] = useState([]);
  const [navn, setNavn] = useState("");
  const [email, setEmail] = useState("");
  const [sendt, setSendt] = useState(false);

  useEffect(() => {
    try {
      setKurv(JSON.parse(localStorage.getItem(KURV_NOEGLE) || "[]"));
    } catch {
      setKurv([]);
    }
  }, []);

  const prisIalt = kurv.reduce((sum, l) => sum + l.antal * l.pris, 0);

  function afslut(e) {
    e.preventDefault();
    // Placeholder indtil MobilePay-integration: marker som modtaget og tøm kurv.
    setSendt(true);
    localStorage.removeItem(KURV_NOEGLE);
  }

  return (
    <main className="text-[#1a1a1a] min-h-screen">
      <SiteNav />
      <div className="max-w-2xl mx-auto px-6 py-28">
        <Link href="/shop" className="inline-flex items-center gap-1 text-green-800 hover:text-green-600 text-sm mb-6">
          ← Fortsæt med at handle
        </Link>
        <h1 className="text-3xl font-bold text-green-900 mb-8">Din bestilling</h1>

        {sendt ? (
          <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-8 text-center">
            <h2 className="text-xl font-bold text-green-900 mb-3">Tak for din bestilling!</h2>
            <p className="text-gray-600">
              Vi har modtaget den. Du hører fra os om afhentning og betaling.
            </p>
            <Link href="/shop" className="inline-block mt-6 text-green-800 font-medium">← Tilbage til shoppen</Link>
          </div>
        ) : kurv.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-500 mb-6">Din kurv er tom.</p>
            <Link href="/shop" className="text-green-800 font-medium">← Gå til shoppen</Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6 mb-6">
              {kurv.map((l, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-green-50 last:border-0">
                  <span className="text-sm text-gray-700">
                    {l.antal} × {l.navn}{l.str ? ` (${l.str})` : ""}
                  </span>
                  <span className="text-sm font-medium text-green-900">{l.antal * l.pris} kr.</span>
                </div>
              ))}
              <div className="flex justify-between pt-4 mt-2 border-t border-green-100">
                <span className="font-semibold">I alt</span>
                <span className="font-bold text-green-900">{prisIalt} kr.</span>
              </div>
            </div>

            <form onSubmit={afslut} className="bg-white rounded-2xl border border-green-100 shadow-sm p-6 flex flex-col gap-3">
              <h2 className="font-semibold text-green-900">Dine oplysninger</h2>
              <input type="text" required value={navn} onChange={(e) => setNavn(e.target.value)} placeholder="Navn"
                className="rounded-xl border border-green-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail"
                className="rounded-xl border border-green-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
              <p className="text-xs text-gray-500">
                Betaling aftales ved afhentning (MobilePay tilføjes snart i shoppen).
              </p>
              <button type="submit" className="mt-2 bg-green-800 hover:bg-green-700 text-white rounded-full px-5 py-2.5 text-sm font-medium transition-colors">
                Afslut bestilling
              </button>
            </form>
          </>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}
