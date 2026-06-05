import Image from "next/image";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHero from "../components/PageHero";

const team = [
  "Sigurd Nielsen",
  "Martine Sandberg",
  "Pernille Hoff",
  "Leonora Sandberg Nielsen",
  "Carla Sandberg Nielsen",
  "Peter Moos",
  "Christina Nielsen",
  "Helle Sylvest",
  "Nete Sarsgaard-Jørgensen",
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
        <section>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Velkommen til Egene</h2>
          <p className="text-gray-600 leading-relaxed">
            Egene er et af Nordsjællands smukkest beliggende ridecentre — et lille sted
            med store ambitioner. Navnet kommer fra de gamle egetræer, der præger stedet
            og giver det sin helt egen karakter. Her samles springryttere, rideskolebørn
            og hesteglade mennesker i et stærkt fællesskab.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Vores vision</h2>
          <p className="text-gray-600 leading-relaxed">
            Vi vil være et sted i særklasse — hvor kvalitet, fællesskab og kærlighed til
            hestene går hånd i hånd.
          </p>
          <p className="text-sm text-green-700 mt-3 italic">[Indsæt jeres vision]</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-green-900 mb-6">Vores team</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {team.map((navn) => (
              <div key={navn} className="bg-green-50/70 rounded-2xl p-5 text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-200 flex items-center justify-center">
                  <Image src="/logo.jpg" alt="" width={40} height={40} className="object-contain rounded-full" />
                </div>
                <p className="font-medium text-green-900 text-sm">{navn}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-green-700 mt-4 italic">
            [Senere indsætter vi rigtige portrætbilleder og en kort tekst om hver person]
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Bestyrelsen</h2>
          <p className="text-gray-600 leading-relaxed">
            Klubben drives af en engageret bestyrelse, der arbejder for medlemmernes
            bedste.
          </p>
          <p className="text-sm text-green-700 mt-3 italic">[Indsæt bestyrelsens medlemmer]</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Samarbejdspartnere</h2>
          <p className="text-gray-600 leading-relaxed">
            Vi samarbejder med en række gode partnere, der støtter klubbens arbejde.
          </p>
          <p className="text-sm text-green-700 mt-3 italic">[Indsæt samarbejdspartnere]</p>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
