import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHero from "../components/PageHero";
import FadeIn from "../components/FadeIn";

export const metadata = {
  title: "Regler",
  description: "Ordensregler på Egene Rideklub - så alle har en god og tryg oplevelse i stald og på baner.",
};

export default function Regler() {
  return (
    <main className="text-[#1a1a1a]">
      <SiteNav />
      <PageHero
        image="/ridebanen.jpg"
        alt="Ridebanen på Egene Rideklub i Holte"
        title="Regler"
        subtitle="Sådan passer vi på hinanden og stedet"
      />
      <div className="max-w-3xl mx-auto px-6 py-20 space-y-12">
        <FadeIn>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Ordensregler</h2>
          <p className="text-gray-600 leading-relaxed">
            For at alle kan have en god og tryg hverdag på Egene, beder vi alle om at følge
            klubbens ordensregler.
          </p>
        </FadeIn>
        <FadeIn>
          <ul className="space-y-3 text-gray-600 leading-relaxed list-disc pl-5">
            <li>Ryd op efter dig selv og din hest - i stald, sadelrum og på baner.</li>
            <li>Fej fold- og staldgange, og fjern gødning fra ridebanerne.</li>
            <li>Vis hensyn til andre ryttere og til naboerne omkring centeret.</li>
            <li>Hunde holdes i snor.</li>
            <li>Respektér ridetider og holdundervisning på banerne.</li>
          </ul>
          <p className="text-sm text-green-700 mt-4 italic">[Tilret med klubbens fuldstændige ordensregler]</p>
        </FadeIn>
      </div>
      <SiteFooter />
    </main>
  );
}
