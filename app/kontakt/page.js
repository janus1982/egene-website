import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHero from "../components/PageHero";
import FadeIn from "../components/FadeIn";

export const metadata = {
  title: "Kontakt",
  description: "Kontakt Egene Rideklub - Høje Sandbjergvej 4, 2840 Holte. Telefon +45 27 14 01 33, kontakt@egene.dk.",
};

const emails = [
  ["Generelt", "kontakt@egene.dk"],
  ["Rideskolen (Martine Sandberg · 2288 0707)", "rideskolen@egene.dk"],
  ["Bestyrelsen", "bestyrelsen@egene.dk"],
  ["Championat", "championat@egene.dk"],
  ["Stævne", "staevne@egene-ridecenter.dk"],
  ["Kasserer / udmelding", "kasserer@egene.dk"],
];

export default function Kontakt() {
  return (
    <main className="text-[#1a1a1a]">
      <SiteNav />
      <PageHero
        image="/forside.jpg"
        alt="Egene Rideklub"
        title="Kontakt os"
        subtitle="Vi sidder klar til at svare på dine spørgsmål"
      />

      <div className="max-w-3xl mx-auto px-6 py-20 space-y-12">
        <FadeIn className="grid sm:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-green-900 mb-2">Adresse</h2>
            <p className="text-gray-600 leading-relaxed">
              Egene Ridecenter v/Sigurd Nielsen<br />
              Høje Sandbjergvej 4<br />
              2840 Holte
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Indkørsel til ridehus og stald fra Gl. Holtevej mellem nr. 135 og 137.
            </p>
            <p className="text-gray-500 text-sm mt-2">CHR: 128903</p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-green-900 mb-2">Telefon & email</h2>
            <p className="text-gray-600">
              <a href="tel:+4527140133" className="text-green-700 underline">+45 27 14 01 33</a>
            </p>
            <p className="text-gray-600">
              <a href="mailto:kontakt@egene.dk" className="text-green-700 underline">kontakt@egene.dk</a>
            </p>
            <h2 className="text-xl font-bold text-green-900 mb-2 mt-6">Find os på</h2>
            <p className="flex gap-4">
              <a href="https://www.facebook.com/pages/Ridecentret-Egene/141125835941239" target="_blank" rel="noopener noreferrer" className="text-green-700 underline">Facebook</a>
              <a href="https://www.instagram.com/egeneridecenter_/" target="_blank" rel="noopener noreferrer" className="text-green-700 underline">Instagram</a>
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <h2 className="text-xl font-bold text-green-900 mb-4">Skriv til rette person</h2>
          <div className="divide-y divide-green-100 border border-green-100 rounded-2xl overflow-hidden">
            {emails.map(([navn, mail]) => (
              <div key={mail} className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 px-5 py-3">
                <span className="text-gray-700">{navn}</span>
                <a href={`mailto:${mail}`} className="text-green-700 underline sm:text-right">{mail}</a>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn>
          <h2 className="text-xl font-bold text-green-900 mb-4">Sådan finder du os</h2>
          <div className="rounded-2xl overflow-hidden border border-green-100">
            <iframe
              title="Kort over Egene Ridecenter"
              src="https://www.google.com/maps?q=H%C3%B8je%20Sandbjergvej%204%2C%202840%20Holte&output=embed"
              width="100%"
              height="380"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href="https://maps.app.goo.gl/WVLPJTXRoQchrJzi8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-green-700 underline"
          >
            Åbn i Google Maps →
          </a>
        </FadeIn>
      </div>

      <SiteFooter />
    </main>
  );
}
