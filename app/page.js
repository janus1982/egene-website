"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "#tilbud", label: "Tilbud" },
    { href: "#spring", label: "Spring" },
    { href: "#omos", label: "Om os" },
    { href: "/kontakt", label: "Kontakt" },
  ];

  return (
    <main className="text-[#1a1a1a]">
      {/* ---------- Navigation ---------- */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="flex items-center">
          <span className="bg-white/95 rounded-xl p-2 shadow-sm">
            <Image src="/logo.jpg" alt="Egene Rideklub" width={64} height={64} className="object-contain" />
          </span>
        </Link>

        {/* Menu — computer */}
        <ul className="hidden md:flex gap-8 text-sm font-medium text-white">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-green-200 transition-colors drop-shadow">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger — mobil */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-3xl leading-none drop-shadow"
          aria-label="Menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobil-menu der folder ud */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-green-900/95 flex flex-col items-center justify-center gap-8 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-white text-2xl font-medium"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}

      {/* ---------- Hero ---------- */}
      <section className="relative min-h-screen flex items-center justify-center text-center">
        <Image
          src="/forside.png"
          alt="Egene Rideklub på en sommerdag"
          fill
          priority
          className="object-cover"
        />
        {/* Mørk tonet overlay så teksten kan læses */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

        <div className="relative z-10 px-6 max-w-3xl fade-up">
          <p className="text-green-100 uppercase tracking-[0.3em] text-sm mb-4">Nordsjælland</p>
          <h1 className="text-white text-4xl sm:text-6xl font-bold leading-tight mb-6 drop-shadow-lg">
            En rideklub i særklasse
          </h1>
          <p className="text-white/90 text-lg sm:text-xl mb-10 drop-shadow">
            Et lille sted med en helt særlig beliggenhed — hjem for springning,
            fællesskab og heste i smukke rammer under de gamle ege.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#tilbud"
              className="bg-white text-green-900 font-semibold px-8 py-3.5 rounded-full hover:bg-green-50 transition-colors shadow-lg"
            >
              Se hvad vi tilbyder
            </a>
            <Link
              href="/kontakt"
              className="border border-white/80 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors"
            >
              Kontakt os
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Intro ---------- */}
      <section id="omos" className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-green-900 mb-6">
          Velkommen til Egene
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Vi er en mindre klub med store ambitioner. Hos os er der plads til både
          den seriøse springrytter og den der bare elsker heste og naturen.
          Beliggenheden under de gamle egetræer gør Egene til noget helt for sig selv.
        </p>
      </section>

      {/* ---------- Tilbud (tre kort) ---------- */}
      <section id="tilbud" className="bg-green-50/60 py-24">
        <div className="max-w-6xl mx-auto px-6 grid gap-8 md:grid-cols-3">
          {[
            { titel: "Rideskole", tekst: "Undervisning for alle niveauer — fra de første skridt til konkurrencebanen." },
            { titel: "Opstaldning", tekst: "Moderne faciliteter og daglig pleje til din hest i naturskønne omgivelser." },
            { titel: "Spring & stævner", tekst: "Vores hjerteblod. Træning, stævner og et stærkt springmiljø året rundt." },
          ].map((k) => (
            <div
              key={k.titel}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-green-900 mb-3">{k.titel}</h3>
              <p className="text-gray-600 leading-relaxed">{k.tekst}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Spring-showcase ---------- */}
      <section id="spring" className="grid md:grid-cols-2 items-stretch">
        <div className="relative min-h-[400px]">
          <Image src="/springbane.jpg" alt="Springbanen på Egene" fill className="object-cover" />
        </div>
        <div className="bg-green-900 text-white flex items-center px-8 py-16 md:px-16">
          <div>
            <p className="text-green-300 uppercase tracking-[0.2em] text-sm mb-4">Springstald</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Hvor ambitioner får vinger</h2>
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              Springning gennemsyrer alt hos os. Fra de første cavaletti til
              stævnebanen dyrker vi præcision, mod og glæden ved at ride.
            </p>
            <Link
              href="/kontakt"
              className="inline-block bg-white text-green-900 font-semibold px-8 py-3.5 rounded-full hover:bg-green-50 transition-colors"
            >
              Bliv en del af klubben
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="bg-green-950 text-green-100 px-6 py-12 text-center">
        <div className="flex justify-center mb-4">
          <span className="bg-white rounded-xl p-3">
            <Image src="/logo.jpg" alt="Egene Rideklub" width={90} height={90} className="object-contain" />
          </span>
        </div>
        <p className="text-green-300/70 text-sm">Nordsjælland · kontakt@egene.dk</p>
        <p className="text-green-300/40 text-xs mt-6">© {new Date().getFullYear()} Egene Rideklub</p>
      </footer>
    </main>
  );
}
