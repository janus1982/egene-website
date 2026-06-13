"use client";

// Webshop-klient: produktoversigt + kurv (gemt i browseren via localStorage).
// Betaling tilføjes som næste skridt (MobilePay) - kurven er klar til det.

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const KURV_NOEGLE = "egene-kurv";

export default function ShopKlient({ produkter }) {
  const [kurv, setKurv] = useState([]);
  const [valgtStr, setValgtStr] = useState({});
  const [kurvAaben, setKurvAaben] = useState(false);

  // Læs kurv fra browseren ved start
  useEffect(() => {
    try {
      const gemt = JSON.parse(localStorage.getItem(KURV_NOEGLE) || "[]");
      setKurv(gemt);
    } catch {
      setKurv([]);
    }
  }, []);

  // Gem kurv ved ændring
  useEffect(() => {
    localStorage.setItem(KURV_NOEGLE, JSON.stringify(kurv));
  }, [kurv]);

  function tilfoej(p) {
    const str = valgtStr[p._id] || (p.stoerrelser?.length ? p.stoerrelser[0] : null);
    setKurv((k) => {
      const eksisterende = k.find((l) => l.id === p._id && l.str === str);
      if (eksisterende) {
        return k.map((l) => (l === eksisterende ? { ...l, antal: l.antal + 1 } : l));
      }
      return [...k, { id: p._id, navn: p.navn, pris: p.pris, str, antal: 1 }];
    });
    setKurvAaben(true);
  }

  function aendrAntal(linje, delta) {
    setKurv((k) =>
      k
        .map((l) => (l === linje ? { ...l, antal: l.antal + delta } : l))
        .filter((l) => l.antal > 0)
    );
  }

  const antalIalt = kurv.reduce((sum, l) => sum + l.antal, 0);
  const prisIalt = kurv.reduce((sum, l) => sum + l.antal * l.pris, 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Kurv-knap */}
      <div className="flex justify-end mb-8">
        <button
          onClick={() => setKurvAaben((v) => !v)}
          className="relative bg-green-800 hover:bg-green-700 text-white rounded-full px-5 py-2.5 text-sm font-medium transition-colors"
        >
          Kurv
          {antalIalt > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-green-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border border-green-200">
              {antalIalt}
            </span>
          )}
        </button>
      </div>

      {(!produkter || produkter.length === 0) ? (
        <p className="text-center text-gray-500">
          Der er ingen varer i shoppen endnu. De dukker op her, så snart de oprettes.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {produkter.map((p) => (
            <div key={p._id} className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden flex flex-col">
              <div className="relative w-full aspect-square bg-green-50">
                {p.billedeUrl ? (
                  <Image src={p.billedeUrl} alt={p.billede?.alt || p.navn} fill sizes="(min-width:1024px) 300px, 50vw" className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-green-200 text-sm">Intet billede</div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-green-900">{p.navn}</h3>
                {p.beskrivelse && <p className="text-sm text-gray-600 mt-1 flex-1">{p.beskrivelse}</p>}
                <p className="text-green-800 font-semibold mt-3">{p.pris} kr.</p>

                {p.stoerrelser?.length > 0 && (
                  <select
                    value={valgtStr[p._id] || p.stoerrelser[0]}
                    onChange={(e) => setValgtStr((v) => ({ ...v, [p._id]: e.target.value }))}
                    className="mt-3 rounded-xl border border-green-200 px-3 py-2 text-sm bg-white"
                  >
                    {p.stoerrelser.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                )}

                <button
                  onClick={() => tilfoej(p)}
                  disabled={p.paaLager === false}
                  className="mt-4 bg-green-800 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-full px-4 py-2 text-sm font-medium transition-colors"
                >
                  {p.paaLager === false ? "Udsolgt" : "Læg i kurv"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Kurv-panel */}
      {kurvAaben && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setKurvAaben(false)} />
          <aside className="relative bg-white w-full max-w-sm h-full shadow-2xl flex flex-col">
            <div className="bg-green-900 text-white px-5 py-4 flex items-center justify-between">
              <span className="font-semibold">Din kurv</span>
              <button onClick={() => setKurvAaben(false)} className="text-white/70 hover:text-white">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {kurv.length === 0 ? (
                <p className="text-gray-500 text-sm">Kurven er tom.</p>
              ) : (
                kurv.map((l, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 border-b border-green-50 pb-3">
                    <div>
                      <p className="font-medium text-green-900 text-sm">{l.navn}</p>
                      {l.str && <p className="text-xs text-gray-500">Størrelse: {l.str}</p>}
                      <p className="text-xs text-gray-500">{l.pris} kr.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => aendrAntal(l, -1)} className="w-7 h-7 rounded-full border border-green-200 text-green-800">−</button>
                      <span className="w-5 text-center text-sm">{l.antal}</span>
                      <button onClick={() => aendrAntal(l, 1)} className="w-7 h-7 rounded-full border border-green-200 text-green-800">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-green-100 p-5">
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">I alt</span>
                <span className="font-bold text-green-900">{prisIalt} kr.</span>
              </div>
              <Link
                href="/shop/kurv"
                className={
                  "block text-center rounded-full px-4 py-2.5 text-sm font-medium transition-colors " +
                  (kurv.length === 0
                    ? "bg-gray-200 text-gray-400 pointer-events-none"
                    : "bg-green-800 hover:bg-green-700 text-white")
                }
              >
                Gå til bestilling
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
