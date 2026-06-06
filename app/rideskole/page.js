import Image from "next/image";
import Link from "next/link";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHero from "../components/PageHero";
import FadeIn from "../components/FadeIn";
import { getUndervisere, getPonyer, getHold } from "../../sanity/lib/queries";
import { urlFor } from "../../sanity/lib/image";

export const metadata = { title: "Rideskole" };

const UGEDAGE = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

const priser = [
  ["Prøvetime", "200 kr. (MobilePay)"],
  ["Trækhold 30 min.", "675 kr./md."],
  ["Mor og barn", "750 kr. indmeldelse + 750 kr./md."],
  ["Begynder, let-øvede og øvede", "750 kr./md."],
  ["Bom og cavaletti", "750 kr./md."],
  ["Springhold", "800 kr./md."],
  ["Parthold søndag", "850 kr./md."],
  ["Medlemskontingent", "600 kr./år (300 kr. efter sommerferien)"],
];

// Statisk holdoversigt (bruges indtil hold oprettes i CMS)
const holdoversigtStatisk = {
  Mandag: [["15:00", "Cavalettis og bom"], ["15:45", "Let øvede"], ["16:30", "Øvede"], ["17:15", "Begynder/let øvede"]],
  Tirsdag: [["15:15", "Spring begynder"], ["16:00", "Spring øvede"]],
  Onsdag: [["15:00", "Begynder"], ["15:45", "Let øvede"], ["16:30", "Øvede"], ["17:15", "Let øvede"]],
  Torsdag: [["15:00", "Begynder"], ["15:45", "Cavalettis og bom"], ["16:30", "Øvede"], ["17:15", "Dressur"]],
  Fredag: [["15:00", "Begynder/let øvede"], ["15:45", "Let øvede"], ["16:30", "Øvede"], ["17:15", "Let øvede"]],
  Lørdag: [["10:00", "Let øvede"], ["10:45", "Trækhold/begynder"], ["11:30", "Trækhold/begynder"], ["12:15", "Trækhold/begynder"], ["12:45", "Let øvede"]],
  Søndag: [["10:00", "Parthold"], ["11:00", "Trækhold/begynder"], ["11:45", "Trækhold/begynder"]],
};

const undervisereStatisk = [
  { navn: "Martine Sandberg", beskrivelse: "Tidligere international springrytter, bachelor i hestens anatomi. Underviser tirsdag og torsdag.", email: "rideskolen@egene.dk", telefon: "2288 0707" },
  { navn: "Fiona Rosholm", beskrivelse: "Har redet på Egene siden hun var lille. Underviser søndag." },
  { navn: "Katrine Bornholdt Lange", beskrivelse: "19 år, har selv lært at ride på Egene. Underviser mandage." },
  { navn: "Karina Binau Larsen", beskrivelse: "Mange års undervisningserfaring, uddannet pædagog. Underviser onsdag.", email: "karina@egene.dk" },
  { navn: "Louise Refsgaard", beskrivelse: "Underviser lørdag." },
  { navn: "Laura Langaard Lauridsen", beskrivelse: "Aktiv springrytter. Underviser mandage og tirsdag på Birkerød Rideskole." },
];

const ponyerStatisk = ["Merlin", "La Rosette", "Dixie", "Malthe", "Frederik", "Kenaghe", "Aisha", "Sunny", "Gigger", "Filur", "Gaston", "Cha-Cha", "Barones", "Shaggy"];

const ferieplan = [
  ["Påskeferie", "30. marts – 6. april"],
  ["Kr. Himmelfart", "14.–15. maj"],
  ["Pinse", "24.–25. maj"],
  ["Grundlovsdag", "5. juni"],
  ["Sidste ridedag før sommer", "28. juni"],
  ["Første ridedag efter sommer", "10. august"],
  ["Efterårsferie", "12.–18. oktober"],
  ["Juleferie", "21. december – 3. januar 2027"],
  ["Vinterferie", "Uge 7, 2027"],
];

export default async function Rideskole() {
  // Hent data fra CMS (tomme arrays hvis intet er oprettet endnu)
  const [undervisereCMS, ponyerCMS, holdCMS] = await Promise.all([
    getUndervisere(),
    getPonyer(),
    getHold(),
  ]);

  // Byg holdoversigt grupperet efter ugedag, hvis der er hold i CMS
  let holdoversigt = holdoversigtStatisk;
  if (holdCMS && holdCMS.length > 0) {
    holdoversigt = {};
    for (const dag of UGEDAGE) {
      const dagensHold = holdCMS
        .filter((h) => h.ugedag === dag)
        .map((h) => [h.tidspunkt, h.varighed ? `${h.holdtype} (${h.varighed})` : h.holdtype]);
      if (dagensHold.length > 0) holdoversigt[dag] = dagensHold;
    }
  }

  const undervisere = undervisereCMS && undervisereCMS.length > 0 ? undervisereCMS : undervisereStatisk;

  return (
    <main className="text-[#1a1a1a]">
      <SiteNav />
      <PageHero
        image="/ridebanen.jpg"
        alt="Ridebanen på Egene"
        title="Rideskole"
        subtitle="Undervisning for alle niveauer — i dressur og springning"
      />

      <div className="max-w-3xl mx-auto px-6 py-20 space-y-16">
        <FadeIn>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Velkommen i rideskolen</h2>
          <p className="text-gray-600 leading-relaxed">
            Rideskolen tilbyder undervisning til nybegyndere, let-øvede og rutinerede
            ryttere i både dressur og springning. Vi tilbyder endvidere strigle- og
            opsadlingskurser samt ryttermærker. Egene Rideskole er certificeret af Dansk
            Rideforbund.
          </p>
        </FadeIn>

        <FadeIn className="bg-green-50/70 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-green-900 mb-3">Prøvetime</h2>
          <p className="text-gray-600 leading-relaxed">
            Overvejer du at starte til ridning på Egene? Vi tilbyder en prøvetime til
            200 kr. betalt via MobilePay. Skriv til{" "}
            <a href="mailto:rideskolen@egene.dk" className="text-green-700 underline">rideskolen@egene.dk</a>{" "}
            for at aftale tid. Mødetid er mindst 20 minutter før ridetimen, da alle
            ryttere selv sadler op.
          </p>
        </FadeIn>

        <FadeIn>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Priser</h2>
          <p className="text-sm text-gray-500 mb-4">Gældende fra 1. august 2025</p>
          <div className="divide-y divide-green-100 border border-green-100 rounded-2xl overflow-hidden">
            {priser.map(([navn, pris]) => (
              <div key={navn} className="flex justify-between gap-4 px-5 py-3">
                <span className="text-gray-700">{navn}</span>
                <span className="text-green-900 font-medium text-right">{pris}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-sm mt-4 leading-relaxed">
            Betaling trækkes automatisk via Dankort den 3.–4. i måneden. Juli er lukket og
            uden betaling.
          </p>
        </FadeIn>

        <FadeIn>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Holdoversigt</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {Object.entries(holdoversigt).map(([dag, hold]) => (
              <div key={dag} className="border border-green-100 rounded-2xl p-5">
                <h3 className="font-bold text-green-900 mb-3">{dag}</h3>
                <ul className="space-y-1.5">
                  {hold.map(([tid, navn], i) => (
                    <li key={tid + navn + i} className="flex justify-between text-sm">
                      <span className="text-green-700 font-medium">{tid}</span>
                      <span className="text-gray-600 text-right">{navn}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Ind- og udmelding</h2>
          <p className="text-gray-600 leading-relaxed">
            Indmelding sker online via{" "}
            <a href="https://foreninglet.dk" target="_blank" rel="noopener noreferrer" className="text-green-700 underline">foreninglet.dk</a>.
            Udmelding er skriftlig til{" "}
            <a href="mailto:kasserer@egene.dk" className="text-green-700 underline">kasserer@egene.dk</a>{" "}
            med 30 dages varsel fra den 1. i måneden.
          </p>
        </FadeIn>

        <FadeIn>
          <h2 className="text-2xl font-bold text-green-900 mb-6">Underviserne</h2>
          <div className="space-y-4">
            {undervisere.map((u) => (
              <div key={u._id || u.navn} className="border border-green-100 rounded-2xl p-5 flex gap-4 items-start">
                {u.billede && (
                  <Image
                    src={urlFor(u.billede).width(160).height(160).fit("crop").url()}
                    alt={u.billede.alt || u.navn}
                    width={80}
                    height={80}
                    className="rounded-full object-cover shrink-0"
                  />
                )}
                <div>
                  <p className="text-green-900 font-semibold">{u.navn}</p>
                  {u.titel && <p className="text-green-700 text-sm">{u.titel}</p>}
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">{u.beskrivelse}</p>
                  {u.undervisningsdage && <p className="text-gray-500 text-sm mt-1">Underviser: {u.undervisningsdage}</p>}
                  {(u.email || u.telefon) && (
                    <p className="text-green-700 text-sm mt-1">
                      {[u.email, u.telefon].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Ponyer og heste</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Rideskolens ponyer og heste er klubbens hjerte. De er udvalgt med omhu og
            passet kærligt hver dag.
          </p>

          {ponyerCMS && ponyerCMS.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {ponyerCMS.map((p) => (
                <div key={p._id} className="rounded-2xl overflow-hidden border border-green-100 group">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={urlFor(p.billede).width(500).height(500).fit("crop").url()}
                      alt={p.billede?.alt || p.navn}
                      fill
                      sizes="(min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-green-900">{p.navn}</p>
                    {p.beskrivelse && <p className="text-gray-600 text-sm mt-1">{p.beskrivelse}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {ponyerStatisk.map((p) => (
                <span key={p} className="bg-green-50 text-green-900 text-sm rounded-full px-4 py-1.5">{p}</span>
              ))}
            </div>
          )}
        </FadeIn>

        <FadeIn>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Hjælper & part</h2>
          <p className="text-gray-600 leading-relaxed">
            Krav: mindst 12 år og bestået Ryttermærke 1 og 2. Mødetid kl. 9:00 lørdag.
            Som belønning får man 1 times ridning på de heste, der går mindst. Kontakt
            Martine for hjælperlisten.
          </p>
        </FadeIn>

        <FadeIn>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Ferieplan 2026</h2>
          <div className="divide-y divide-green-100 border border-green-100 rounded-2xl overflow-hidden">
            {ferieplan.map(([navn, dato]) => (
              <div key={navn} className="flex justify-between gap-4 px-5 py-3">
                <span className="text-gray-700">{navn}</span>
                <span className="text-green-900 font-medium text-right">{dato}</span>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn className="bg-green-900 text-white rounded-2xl px-8 py-10">
          <h2 className="text-2xl font-bold mb-4">Sommerridelejr 2026</h2>
          <p className="text-white/80 mb-4">Uge 27, 28 og 29</p>
          <div className="space-y-4 text-white/90">
            <div>
              <p className="font-semibold">Uge 27 & 28 — med overnatning</p>
              <p className="text-white/80 text-sm">Mandag–fredag. Afslutningsshow fredag kl. 14:30. Pris 4.900 kr. (depositum 2.450 kr.)</p>
            </div>
            <div>
              <p className="font-semibold">Uge 29 — dagridelejr</p>
              <p className="text-white/80 text-sm">Mandag–torsdag kl. 9–16. Pris 3.900 kr. (depositum 1.950 kr.)</p>
            </div>
          </div>
          <Link href="/kontakt" className="inline-block mt-6 bg-white text-green-900 font-semibold px-6 py-3 rounded-full hover:bg-green-50 transition-colors">
            Tilmeld eller hør mere
          </Link>
        </FadeIn>
      </div>

      <SiteFooter />
    </main>
  );
}
