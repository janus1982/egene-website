import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHero from "../components/PageHero";
import FadeIn from "../components/FadeIn";

export const metadata = {
  title: "Beredskab",
  description: "Beredskabsplan for Egene Rideklub - hvad du gør ved ulykke, brand eller anden nødsituation.",
};

export default function Beredskab() {
  return (
    <main className="text-[#1a1a1a]">
      <SiteNav />
      <PageHero
        image="/faciliteter.jpg"
        alt="Faciliteterne på Egene Rideklub i Holte"
        title="Beredskab"
        subtitle="Hvad du gør i en nødsituation"
      />
      <div className="max-w-3xl mx-auto px-6 py-20 space-y-12">
        <FadeIn className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-red-800 mb-2">Ved akut fare: Ring 1-1-2</h2>
          <p className="text-gray-700 leading-relaxed">
            Ved alvorlig ulykke eller brand: ring straks 112. Oplys adressen:
            <strong> Høje Sandbjergvej 4, 2840 Holte</strong>. Indkørsel til ridehus og
            stald sker fra Gl. Holtevej mellem nr. 135 og 137.
          </p>
        </FadeIn>
        <FadeIn>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Sådan handler du</h2>
          <ul className="space-y-3 text-gray-600 leading-relaxed list-disc pl-5">
            <li>Skab ro og overblik - undgå at sætte dig selv i fare.</li>
            <li>Ring 112 ved personskade eller brand, og oplys adressen.</li>
            <li>Tilkald personale eller en voksen med det samme.</li>
            <li>Førstehjælpskasse og brandslukker findes i [placering].</li>
            <li>Saml heste og personer på et sikkert sted ved evakuering.</li>
          </ul>
          <p className="text-sm text-green-700 mt-4 italic">[Tilret med klubbens beredskabsplan og placeringer]</p>
        </FadeIn>
      </div>
      <SiteFooter />
    </main>
  );
}
