import Image from "next/image";
import Link from "next/link";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHero from "../components/PageHero";

export const metadata = { title: "Spring & stævner" };

export default function Spring() {
  return (
    <main className="text-[#1a1a1a]">
      <SiteNav />
      <PageHero
        image="/springbane.jpg"
        alt="Springbanen på Egene"
        title="Spring & stævner"
        subtitle="Vores hjerteblod — et stærkt springmiljø året rundt"
      />

      <div className="max-w-3xl mx-auto px-6 py-20 space-y-16">
        <section>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Springning gennemsyrer alt</h2>
          <p className="text-gray-600 leading-relaxed">
            Egene er en springstald, og det mærkes overalt. Fra de første cavaletti til
            stævnebanen dyrker vi præcision, mod og glæden ved at ride. Uanset om du
            drømmer om dit første gennemførte spring eller om at stille op til konkurrence,
            er der et stærkt miljø at vokse i.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Stævner</h2>
          <p className="text-gray-600 leading-relaxed">
            Vi afholder og deltager i stævner gennem hele året. Det er dage fyldt med
            spænding, fællesskab og gode præstationer — for både nye og rutinerede ryttere.
          </p>
          <p className="text-sm text-green-700 mt-3 italic">
            [Indsæt kommende stævnedatoer og resultater her]
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Træningscamp</h2>
          <p className="text-gray-600 leading-relaxed">
            Vores træningscamps giver ekstra fokus og fremgang i koncentrerede forløb —
            ofte med dygtige gæsteundervisere.
          </p>
          <p className="text-sm text-green-700 mt-3 italic">
            [Indsæt info om næste træningscamp]
          </p>
        </section>

        {/* Billede-indslag */}
        <section className="relative h-72 rounded-2xl overflow-hidden">
          <Image src="/ryttere.jpg" alt="Ryttere går banen før spring" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Året på Egene</h2>
          <p className="text-gray-600 leading-relaxed">
            Året byder på faste traditioner — fra kæphestestævner for de mindste til
            klubmesterskaber og hyggelige arrangementer. Der er altid noget at se frem til.
          </p>
          <p className="text-sm text-green-700 mt-3 italic">
            [Indsæt jeres årskalender med de faste begivenheder]
          </p>
        </section>

        <section className="bg-green-900 text-white rounded-2xl px-8 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Vil du være med?</h2>
          <p className="text-white/80 mb-6">Kom forbi og oplev springmiljøet på Egene.</p>
          <Link href="/kontakt" className="inline-block bg-white text-green-900 font-semibold px-8 py-3.5 rounded-full hover:bg-green-50 transition-colors">
            Kontakt os
          </Link>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
