import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHero from "../components/PageHero";
import FadeIn from "../components/FadeIn";

export const metadata = {
  title: "Sikkerhed",
  description: "Sikkerhedsregler på Egene Rideklub i Holte — ridehjelm, færdsel i stald og på banen.",
};

export default function Sikkerhed() {
  return (
    <main className="text-[#1a1a1a]">
      <SiteNav />
      <PageHero
        image="/faciliteter.jpg"
        alt="Faciliteterne på Egene Rideklub i Holte"
        title="Sikkerhed"
        subtitle="Tryghed for ryttere, heste og gæster"
      />
      <div className="max-w-3xl mx-auto px-6 py-20 space-y-12">
        <FadeIn>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Sikkerhed på Egene</h2>
          <p className="text-gray-600 leading-relaxed">
            Sikkerhed er en grundpille hos os. Alle der færdes på Egene, følger nedenstående
            retningslinjer, så både ryttere, heste og gæster er trygge.
          </p>
        </FadeIn>
        <FadeIn>
          <ul className="space-y-3 text-gray-600 leading-relaxed list-disc pl-5">
            <li>Godkendt ridehjelm er påbudt under al ridning.</li>
            <li>Sikkerhedsvest anbefales — og er påbudt ved springning for børn.</li>
            <li>Korrekt fodtøj med hæl ved ridning og håndtering af heste.</li>
            <li>Vis hensyn og giv besked, når du færdes bag heste.</li>
            <li>Følg altid anvisninger fra undervisere og personale.</li>
          </ul>
          <p className="text-sm text-green-700 mt-4 italic">[Tilret listen med klubbens præcise sikkerhedsregler]</p>
        </FadeIn>
      </div>
      <SiteFooter />
    </main>
  );
}
