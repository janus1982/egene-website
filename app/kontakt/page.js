import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHero from "../components/PageHero";

export default function Kontakt() {
  return (
    <main className="text-[#1a1a1a]">
      <SiteNav />
      <PageHero
        image="/forside.png"
        alt="Egene Rideklub"
        title="Kontakt os"
        subtitle="Vi sidder klar til at svare på dine spørgsmål"
      />

      <div className="max-w-2xl mx-auto px-6 py-20 grid gap-8">
        <div>
          <h2 className="text-xl font-bold text-green-900 mb-2">Adresse</h2>
          <p className="text-gray-600">Egene Ridecenter<br />Nordsjælland</p>
          <p className="text-sm text-green-700 mt-1 italic">[Indsæt fuld adresse]</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-green-900 mb-2">Telefon</h2>
          <p className="text-sm text-green-700 italic">[Indsæt telefonnummer]</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-green-900 mb-2">Email</h2>
          <p className="text-gray-600">kontakt@egene.dk</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-green-900 mb-2">Find os på</h2>
          <p className="text-gray-600">Facebook · Instagram</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-green-900 mb-2">Sådan finder du os</h2>
          <p className="text-sm text-green-700 italic">[Her indsætter vi et kort over lokationen]</p>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
