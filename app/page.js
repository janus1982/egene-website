import Image from "next/image";
import Link from "next/link";
import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";
import Hero from "./components/Hero";
import FadeIn from "./components/FadeIn";
import { getNyheder } from "../sanity/lib/queries";
import { urlFor } from "../sanity/lib/image";

function datoDansk(dato) {
  if (!dato) return "";
  return new Date(dato).toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" });
}

const tilbud = [
  { titel: "Rideskole", tekst: "Undervisning for alle niveauer — fra de første skridt til konkurrencebanen.", href: "/rideskole" },
  { titel: "Opstaldning", tekst: "Moderne faciliteter og daglig pleje til din hest i naturskønne omgivelser.", href: "/opstaldning" },
  { titel: "Spring & stævner", tekst: "Vores hjerteblod. Træning, stævner og et stærkt springmiljø året rundt.", href: "/spring" },
];

export default async function Home() {
  const nyheder = await getNyheder(3);

  return (
    <main className="text-[#1a1a1a]">
      <SiteNav />
      <Hero />

      {/* ---------- Intro ---------- */}
      <FadeIn>
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
      </FadeIn>

      {/* ---------- Tilbud (tre kort) ---------- */}
      <section id="tilbud" className="bg-green-50/60 py-24">
        <div className="max-w-6xl mx-auto px-6 grid gap-8 md:grid-cols-3">
          {tilbud.map((k, i) => (
            <FadeIn key={k.titel} delay={i * 0.1}>
              <Link
                href={k.href}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block h-full"
              >
                <h3 className="text-xl font-bold text-green-900 mb-3">{k.titel}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{k.tekst}</p>
                <span className="text-green-700 font-medium text-sm">Læs mere →</span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ---------- Spring-showcase ---------- */}
      <FadeIn>
        <section className="grid md:grid-cols-2 items-stretch">
          <div className="relative min-h-[400px] overflow-hidden group">
            <Image
              src="/springbane.jpg"
              alt="Springbanen på Egene"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-105"
            />
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
      </FadeIn>

      {/* ---------- Seneste nyheder ---------- */}
      {nyheder && nyheder.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-24">
          <FadeIn>
            <div className="flex items-end justify-between mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-green-900">Seneste nyt</h2>
              <Link href="/nyheder" className="text-green-700 font-medium hover:text-green-900">Se alle →</Link>
            </div>
          </FadeIn>
          <div className="grid gap-8 md:grid-cols-3">
            {nyheder.map((n, i) => (
              <FadeIn key={n._id} delay={i * 0.1}>
                <Link href="/nyheder" className="block group">
                  {n.billede && (
                    <div className="relative h-52 rounded-2xl overflow-hidden mb-4">
                      <Image
                        src={urlFor(n.billede).width(600).height(400).fit("crop").url()}
                        alt={n.billede.alt || n.titel}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-105"
                      />
                    </div>
                  )}
                  <p className="text-sm text-green-700 mb-1">{datoDansk(n.dato)}</p>
                  <h3 className="text-lg font-bold text-green-900">{n.titel}</h3>
                </Link>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
