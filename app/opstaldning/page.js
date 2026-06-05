import Link from "next/link";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHero from "../components/PageHero";

export default function Opstaldning() {
  return (
    <main className="text-[#1a1a1a]">
      <SiteNav />
      <PageHero
        image="/faciliteter.jpg"
        alt="Faciliteterne på Egene"
        title="Opstaldning"
        subtitle="Moderne faciliteter og daglig pleje i naturskønne omgivelser"
      />

      <div className="max-w-3xl mx-auto px-6 py-20 space-y-16">
        <section>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Din hest i gode hænder</h2>
          <p className="text-gray-600 leading-relaxed">
            Hos Egene står din hest trygt og godt. Vi tilbyder opstaldning med daglig
            pleje, gode folde og faciliteter, der gør hverdagen nem — alt sammen i
            smukke rammer under de gamle egetræer.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Dagsrytme</h2>
          <p className="text-gray-600 leading-relaxed">
            Dagen følger en fast rytme med fodring, udlukning og pasning, så din hest
            altid er i trygge og forudsigelige rammer.
          </p>
          <p className="text-sm text-green-700 mt-3 italic">[Indsæt jeres dagsrytme]</p>
        </section>

        <section className="grid sm:grid-cols-2 gap-6">
          <div className="bg-green-50/70 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-green-900 mb-2">Åbningstider</h3>
            <p className="text-sm text-green-700 italic">[Indsæt åbningstider]</p>
          </div>
          <div className="bg-green-50/70 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-green-900 mb-2">Priser</h3>
            <p className="text-sm text-green-700 italic">[Indsæt priser for opstaldning]</p>
          </div>
          <div className="bg-green-50/70 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-green-900 mb-2">Kontingent</h3>
            <p className="text-sm text-green-700 italic">[Indsæt kontingent]</p>
          </div>
          <div className="bg-green-50/70 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-green-900 mb-2">Sikkerhed</h3>
            <p className="text-sm text-green-700 italic">[Indsæt sikkerhedsregler]</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Championat</h2>
          <p className="text-gray-600 leading-relaxed">
            Som opstalder kan du deltage i klubbens championat og være en del af det
            sociale liv på stedet.
          </p>
          <p className="text-sm text-green-700 mt-3 italic">[Indsæt info om championat]</p>
        </section>

        <section className="bg-green-900 text-white rounded-2xl px-8 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Interesseret i en plads?</h2>
          <p className="text-white/80 mb-6">Hør om ledige bokse og kom forbi til en rundvisning.</p>
          <Link href="/kontakt" className="inline-block bg-white text-green-900 font-semibold px-8 py-3.5 rounded-full hover:bg-green-50 transition-colors">
            Kontakt os
          </Link>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
