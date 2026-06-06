import Image from "next/image";
import Link from "next/link";
import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";

export default function Home() {
  return (
    <main className="text-[#1a1a1a]">
      <SiteNav variant="transparent" />

      {/* ---------- Hero ---------- */}
      <section className="relative min-h-screen flex items-center justify-center text-center">
        <Image src="/forside.jpg" alt="Egene Rideklub på en sommerdag" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

        <div className="relative z-10 px-6 max-w-3xl fade-up">
          <p className="text-green-100 uppercase tracking-[0.3em] text-sm mb-4">Nordsjælland · Holte</p>
          <h1 className="text-white text-4xl sm:text-6xl font-bold leading-tight mb-6 drop-shadow-lg">
            En rideklub i særklasse
          </h1>
          <p className="text-white/90 text-lg sm:text-xl mb-10 drop-shadow">
            Et lille sted med en helt særlig beliggenhed — hjem for springning,
            fællesskab og heste i smukke rammer under de gamle ege.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#tilbud" className="bg-white text-green-900 font-semibold px-8 py-3.5 rounded-full hover:bg-green-50 transition-colors shadow-lg">
              Se hvad vi tilbyder
            </a>
            <Link href="/kontakt" className="border border-white/80 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors">
              Kontakt os
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Intro ---------- */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-green-900 mb-6">Velkommen til Egene</h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Egene er Nordsjællands smukkest beliggende ridecenter, omgivet af Rudeskov i
          Gl. Holte ved foden af Høje Sandbjerg. Vi har privat opstaldning af cirka 45
          heste og ponyer samt rideskole. Martine Sandberg og Sigurd Nielsen har siden
          oktober 2011 drevet Egene Ridecenter og rideskole, samt konkurrencestald med
          uddannelse af ryttere og heste på alle niveauer.
        </p>
      </section>

      {/* ---------- Tilbud (tre kort) ---------- */}
      <section id="tilbud" className="bg-green-50/60 py-24">
        <div className="max-w-6xl mx-auto px-6 grid gap-8 md:grid-cols-3">
          {[
            { titel: "Rideskole", tekst: "Undervisning for alle niveauer — fra de første skridt til konkurrencebanen.", href: "/rideskole" },
            { titel: "Opstaldning", tekst: "Moderne faciliteter og daglig pleje til din hest i naturskønne omgivelser.", href: "/opstaldning" },
            { titel: "Spring & stævner", tekst: "Vores hjerteblod. Træning, stævner og et stærkt springmiljø året rundt.", href: "/spring" },
          ].map((k) => (
            <Link
              key={k.titel}
              href={k.href}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block"
            >
              <h3 className="text-xl font-bold text-green-900 mb-3">{k.titel}</h3>
              <p className="text-gray-600 leading-relaxed mb-4">{k.tekst}</p>
              <span className="text-green-700 font-medium text-sm">Læs mere →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Spring-showcase ---------- */}
      <section className="grid md:grid-cols-2 items-stretch">
        <div className="relative min-h-[400px]">
          <Image src="/springbane.jpg" alt="Springbanen på Egene" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="bg-green-900 text-white flex items-center px-8 py-16 md:px-16">
          <div>
            <p className="text-green-300 uppercase tracking-[0.2em] text-sm mb-4">Springstald</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Hvor ambitioner får vinger</h2>
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              Springning gennemsyrer alt hos os. Fra de første cavaletti til
              stævnebanen dyrker vi præcision, mod og glæden ved at ride.
            </p>
            <Link href="/spring" className="inline-block bg-white text-green-900 font-semibold px-8 py-3.5 rounded-full hover:bg-green-50 transition-colors">
              Læs om vores springmiljø
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
