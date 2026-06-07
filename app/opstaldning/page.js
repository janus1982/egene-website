import Link from "next/link";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHero from "../components/PageHero";
import FadeIn from "../components/FadeIn";

export const metadata = {
  title: "Opstaldning",
  description: "Opstaldning på Egene Ridecenter i Holte — fuldpas alle ugens dage, moderne faciliteter og naturskønne omgivelser.",
};

const tillaeg = [
  ["Alenefold", "750 kr./md."],
  ["Skridtmaskine dagligt", "600 kr./md."],
  ["Gamacher af og på ved fold", "500 kr./md."],
  ["Hjælp til medicin", "300 kr./dag"],
  ["Sygefold (min. 7 dage)", "250 kr./uge"],
];

const dagsrytme = [
  ["07:00", "Ridecenteret åbner"],
  ["08:00", "Hestene lukkes på fold"],
  ["14:00", "Hestene lukkes ind"],
  ["15:00", "Rideskolen starter"],
  ["18:00", "Rideskolen slutter (tirsdag 17:00)"],
  ["22:00", "Ridecenteret lukker (weekend og helligdage 20:00)"],
];

export default function Opstaldning() {
  return (
    <main className="text-[#1a1a1a]">
      <SiteNav />
      <PageHero
        image="/faciliteter.jpg"
        alt="Faciliteterne på Egene"
        title="Opstaldning"
        subtitle="Fuldpas alle ugens dage i naturskønne omgivelser"
      />

      <div className="max-w-3xl mx-auto px-6 py-20 space-y-16">
        <FadeIn>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Din hest i gode hænder</h2>
          <p className="text-gray-600 leading-relaxed">
            Der er plads til cirka 45 heste på Egene Ridecenter. Vi tilbyder fuldpas alle
            ugens 7 dage inkl. helligdage — alt sammen i smukke rammer under de gamle
            egetræer.
          </p>
        </FadeIn>

        <FadeIn>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Priser</h2>
          <p className="text-sm text-gray-500 mb-4">Gældende fra 1. juni 2026</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-green-50/70 rounded-2xl p-6">
              <p className="text-green-700 font-medium">Boks til pony</p>
              <p className="text-2xl font-bold text-green-900 mt-1">6.750 kr.<span className="text-base font-normal text-gray-500">/md.</span></p>
            </div>
            <div className="bg-green-50/70 rounded-2xl p-6">
              <p className="text-green-700 font-medium">Boks til hest</p>
              <p className="text-2xl font-bold text-green-900 mt-1">7.600 kr.<span className="text-base font-normal text-gray-500">/md.</span></p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-4 leading-relaxed">
            Inkluderer basis-foder, wrap, træpiller, udmugning 7 dage, foldordning, ud- og
            indlukning samt adgang til alle faciliteter.
          </p>
        </FadeIn>

        <FadeIn>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Tillægsydelser</h2>
          <div className="divide-y divide-green-100 border border-green-100 rounded-2xl overflow-hidden">
            {tillaeg.map(([navn, pris]) => (
              <div key={navn} className="flex justify-between gap-4 px-5 py-3">
                <span className="text-gray-700">{navn}</span>
                <span className="text-green-900 font-medium text-right">{pris}</span>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Dagsrytme</h2>
          <div className="divide-y divide-green-100 border border-green-100 rounded-2xl overflow-hidden">
            {dagsrytme.map(([tid, tekst]) => (
              <div key={tid + tekst} className="flex gap-5 px-5 py-3">
                <span className="text-green-700 font-medium w-16 shrink-0">{tid}</span>
                <span className="text-gray-700">{tekst}</span>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Åbningstider</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-green-50/70 rounded-2xl p-6">
              <p className="text-green-700 font-medium">Hverdage</p>
              <p className="text-green-900 font-semibold mt-1">07:00 – 22:00</p>
            </div>
            <div className="bg-green-50/70 rounded-2xl p-6">
              <p className="text-green-700 font-medium">Weekend & helligdage</p>
              <p className="text-green-900 font-semibold mt-1">07:00 – 20:00</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Praktisk information</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { href: "/sikkerhed", label: "Sikkerhed" },
              { href: "/regler", label: "Regler" },
              { href: "/beredskab", label: "Beredskab" },
              { href: "/championat", label: "Championat" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="border border-green-100 rounded-2xl px-5 py-4 font-medium text-green-900 hover:bg-green-50 transition-colors">
                {l.label} →
              </Link>
            ))}
          </div>
        </FadeIn>

        <FadeIn className="bg-green-900 text-white rounded-2xl px-8 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Interesseret i en plads?</h2>
          <p className="text-white/80 mb-6">Hør om ledige bokse og kom forbi til en rundvisning.</p>
          <Link href="/kontakt" className="inline-block bg-white text-green-900 font-semibold px-8 py-3.5 rounded-full hover:bg-green-50 transition-colors">
            Kontakt os
          </Link>
        </FadeIn>
      </div>

      <SiteFooter />
    </main>
  );
}
