import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHero from "../components/PageHero";
import FadeIn from "../components/FadeIn";

export const metadata = {
  title: "Championat",
  description: "Egene Rideklubs championat - point, stævner og kåringer for klubbens ryttere.",
};

export default function Championat() {
  return (
    <main className="text-[#1a1a1a]">
      <SiteNav />
      <PageHero
        image="/springbane.jpg"
        alt="Springbanen på Egene Rideklub i Holte"
        title="Championat"
        subtitle="Klubbens egen pointkonkurrence året rundt"
      />
      <div className="max-w-3xl mx-auto px-6 py-20 space-y-12">
        <FadeIn>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Egenes championat</h2>
          <p className="text-gray-600 leading-relaxed">
            Gennem året samler vores ryttere point ved stævner og arrangementer. Ved
            sæsonens afslutning kåres årets vindere. Championatet er med til at skabe
            sammenhold og motivation på tværs af holdene.
          </p>
          <p className="text-sm text-green-700 mt-3 italic">[Indsæt championatets regler og pointsystem]</p>
        </FadeIn>
        <FadeIn>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Stilling</h2>
          <p className="text-gray-600 leading-relaxed">Den aktuelle stilling opdateres løbende.</p>
          <p className="text-sm text-green-700 mt-3 italic">[Indsæt aktuel stilling eller link]</p>
        </FadeIn>
        <FadeIn>
          <p className="text-gray-600">
            Spørgsmål om championatet? Skriv til{" "}
            <a href="mailto:championat@egene.dk" className="text-green-700 underline">championat@egene.dk</a>.
          </p>
        </FadeIn>
      </div>
      <SiteFooter />
    </main>
  );
}
