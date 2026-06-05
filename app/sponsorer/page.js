import Link from "next/link";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHero from "../components/PageHero";

export default function Sponsorer() {
  return (
    <main className="text-[#1a1a1a]">
      <SiteNav />
      <PageHero
        image="/cafe.jpg"
        alt="Fællesskabet på Egene"
        title="Sponsorer"
        subtitle="Sammen gør vi Egene til et endnu bedre sted"
      />

      <div className="max-w-3xl mx-auto px-6 py-20 space-y-16">
        <section>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Tak til vores sponsorer</h2>
          <p className="text-gray-600 leading-relaxed">
            Egene Rideklub er drevet af frivillige kræfter og et stærkt fællesskab. Vores
            sponsorer spiller en uvurderlig rolle i at udvikle klubben, faciliteterne og
            mulighederne for vores ryttere. Tusind tak for jeres støtte.
          </p>
          <p className="text-sm text-green-700 mt-3 italic">
            [Her viser vi sponsorernes logoer]
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Bliv sponsor</h2>
          <p className="text-gray-600 leading-relaxed">
            Vil din virksomhed støtte en rideklub i særklasse? Som sponsor bliver I en
            synlig del af et stærkt lokalt fællesskab — og er med til at skabe gode
            oplevelser for børn og unge.
          </p>
        </section>

        <section className="grid sm:grid-cols-3 gap-6">
          {[
            { titel: "Synlighed", tekst: "Jeres logo på hjemmesiden, ved stævner og på sociale medier." },
            { titel: "Fællesskab", tekst: "I bliver en del af et stærkt og aktivt lokalt miljø." },
            { titel: "God sag", tekst: "I støtter børn og unges udvikling med heste og sport." },
          ].map((k) => (
            <div key={k.titel} className="bg-green-50/70 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-green-900 mb-2">{k.titel}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{k.tekst}</p>
            </div>
          ))}
        </section>

        <section className="bg-green-900 text-white rounded-2xl px-8 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Bliv sponsor for Egene</h2>
          <p className="text-white/80 mb-6">Skriv til os og hør om mulighederne.</p>
          <Link href="/kontakt" className="inline-block bg-white text-green-900 font-semibold px-8 py-3.5 rounded-full hover:bg-green-50 transition-colors">
            Kontakt os
          </Link>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
