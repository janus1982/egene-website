import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHero from "../components/PageHero";
import FadeIn from "../components/FadeIn";

export const metadata = {
  title: "Om os",
  description: "Om Egene Rideklub i Holte - historien, visionen, bestyrelsen og menneskene bag et ridecenter i særklasse.",
};

const bestyrelse = [
  { rolle: "Formand", navn: "Janus Fabricius Kierkegaard" },
  { rolle: "Næstformand", navn: "Peter Schmidt" },
  { rolle: "Kasserer", navn: "Pernille Breum-Harild" },
  { rolle: "Medlem", navn: "Heike Schauerte" },
  { rolle: "Medlem", navn: "Sine Frandsen" },
];

const partnere = [
  { navn: "Hillerød Sporthorses ApS v. Ulrich Gaarslev", tekst: "Køb/salg og stævner" },
  { navn: "ProAlign", tekst: "Fysioterapi - Egenes medlemmer får rabat" },
  { navn: "IKeyVet", tekst: "Dyrlæge · 5084 9849" },
  { navn: "Hørsholm Hestepraksis", tekst: "Dyrlæge · 4828 0094" },
  { navn: "Linus Camitz", tekst: "Dyrlæge · 2042 9033" },
  { navn: "Peter Moos", tekst: "Beslagsmed · 2083 6581" },
  { navn: "Tattersall Rideudstyr ApS", tekst: "Udstyr · 4550 5454 - Egeneryttere får 10% rabat" },
  { navn: "Hestetandklinikken v. Jesper Rosenmeier", tekst: "Hestetandlæge · 5383 4378" },
  { navn: "Hestenes Sadelmager v. Maria Maj Mogensen", tekst: "Sadelmager · 2343 3022" },
];

export default function OmOs() {
  return (
    <main className="text-[#1a1a1a]">
      <SiteNav />
      <PageHero
        image="/ridebanen.jpg"
        alt="Egene Rideklub"
        title="Om os"
        subtitle="Historien, stedet og menneskene bag Egene"
      />

      <div className="max-w-3xl mx-auto px-6 py-20 space-y-16">
        <FadeIn>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Velkommen til Egene</h2>
          <p className="text-gray-600 leading-relaxed">
            Egene er Nordsjællands smukkest beliggende ridecenter, omgivet af Rudeskov i
            Gl. Holte ved foden af Høje Sandbjerg. Vi har privat opstaldning af cirka 45
            heste og ponyer samt rideskole. Martine Sandberg og Sigurd Nielsen har siden
            oktober 2011 drevet Egene Ridecenter og rideskole, samt konkurrencestald med
            uddannelse af ryttere og heste på alle niveauer.
          </p>
        </FadeIn>

        <FadeIn>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Vores vision</h2>
          <p className="text-gray-600 leading-relaxed">
            Egene er et ridecenter præget af høj etik og moral, med fokus på hestevelfærd
            og fællesskab, hvor alle passer på hinanden og tager et fælles ansvar. Vi
            ønsker at skabe et højt fagligt niveau, hvor langsigtet læring prioriteres frem
            for hurtige resultater. Der skal være en rød tråd mellem undervisningen i
            rideskolen og undervisningen i konkurrencestalden - et miljø, hvor vi vægter
            både børns og hestes trivsel, samt de gode resultater.
          </p>
          <blockquote className="border-l-4 border-green-700 bg-green-50/70 rounded-r-2xl px-6 py-5 mt-6 italic text-green-900">
            «På Egene prioriterer vi faglighed frem for hurtige resultater, da vi tror på
            at korrekt uddannelse af hest og rytter skaber resultaterne på sigt.»
            <footer className="mt-2 text-sm not-italic text-green-700">
              - Martine og Sigurd, april 2015
            </footer>
          </blockquote>
        </FadeIn>

        <FadeIn>
          <h2 className="text-2xl font-bold text-green-900 mb-6">Bestyrelsen</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {bestyrelse.map((b) => (
              <div key={b.navn} className="bg-green-50/70 rounded-2xl p-5">
                <p className="text-sm text-green-700 font-medium">{b.rolle}</p>
                <p className="text-green-900 font-semibold">{b.navn}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-600 mt-4">
            Kontakt bestyrelsen:{" "}
            <a href="mailto:bestyrelsen@egene.dk" className="text-green-700 underline">bestyrelsen@egene.dk</a>
          </p>
        </FadeIn>

        <FadeIn>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Stævneudvalg</h2>
          <p className="text-gray-600 leading-relaxed">
            Helle Sylvest, Louise Kirkegaard, Pernille Breum-Harild, Heike Schauerte,
            Sine Frandsen og Sigurd Nielsen.
          </p>
          <p className="text-gray-600 mt-2">
            Kontakt:{" "}
            <a href="mailto:staevne@egene-ridecenter.dk" className="text-green-700 underline">staevne@egene-ridecenter.dk</a>
          </p>
        </FadeIn>

        <FadeIn>
          <h2 className="text-2xl font-bold text-green-900 mb-6">Samarbejdspartnere</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {partnere.map((p) => (
              <div key={p.navn} className="border border-green-100 rounded-2xl p-5">
                <p className="text-green-900 font-semibold">{p.navn}</p>
                <p className="text-gray-600 text-sm mt-1">{p.tekst}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      <SiteFooter />
    </main>
  );
}
