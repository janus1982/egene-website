import Link from "next/link";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHero from "../components/PageHero";

export default function Rideskole() {
  return (
    <main className="text-[#1a1a1a]">
      <SiteNav />
      <PageHero
        image="/ridebanen.jpg"
        alt="Ridebanen på Egene"
        title="Rideskole"
        subtitle="Undervisning for alle niveauer — fra de første skridt til konkurrencebanen"
      />

      <div className="max-w-3xl mx-auto px-6 py-20 space-y-16">
        <section>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Velkommen i rideskolen</h2>
          <p className="text-gray-600 leading-relaxed">
            På Egene Rideskole møder du dygtige undervisere, velgørende ponyer og heste
            og et stærkt fællesskab. Vi tager imod både helt nye ryttere og dem, der vil
            videre mod stævner og spring. Her er der plads til at lære i sit eget tempo —
            i nogle af Nordsjællands smukkeste rammer.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Undervisningen</h2>
          <p className="text-gray-600 leading-relaxed">
            Vi underviser på hold, der er sammensat efter niveau og alder, så alle bliver
            udfordret passende. Fokus er på god ridning, sikkerhed og glæden ved at være
            sammen med hestene.
          </p>
          <p className="text-sm text-green-700 mt-3 italic">
            [Her indsætter vi jeres beskrivelse af undervisningsformen]
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Holdoversigt</h2>
          <div className="bg-green-50/70 rounded-2xl p-6">
            <p className="text-gray-600 leading-relaxed">
              Vores hold fordeler sig over ugen efter niveau.
            </p>
            <p className="text-sm text-green-700 mt-3 italic">
              [Indsæt jeres holdplan her — f.eks. ugedag, tidspunkt, niveau]
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Priser</h2>
          <div className="bg-green-50/70 rounded-2xl p-6">
            <p className="text-gray-600 leading-relaxed">
              Et hold koster [pris] pr. sæson. Hertil kommer medlemskab af klubben.
            </p>
            <p className="text-sm text-green-700 mt-3 italic">
              [Indsæt jeres aktuelle priser her]
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Ind- og udmelding</h2>
          <p className="text-gray-600 leading-relaxed">
            Vil du starte til ridning, eller har du brug for at melde dig ud, kan du
            kontakte os direkte. Vi hjælper dig godt i gang.
          </p>
          <Link href="/kontakt" className="inline-block mt-4 bg-green-800 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-700 transition-colors">
            Kontakt rideskolen
          </Link>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Underviserne</h2>
          <p className="text-gray-600 leading-relaxed">
            Vores undervisere er erfarne og engagerede og brænder for at give hver enkelt
            rytter en god oplevelse.
          </p>
          <p className="text-sm text-green-700 mt-3 italic">
            [Præsentation af underviserne — kan også samles på "Om os"]
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Ponyerne og hestene</h2>
          <p className="text-gray-600 leading-relaxed">
            Rideskolens ponyer og heste er klubbens hjerte. De er udvalgt med omhu og
            passet kærligt hver dag.
          </p>
          <p className="text-sm text-green-700 mt-3 italic">
            [Senere kan vi lave en flot galleri-præsentation af de enkelte ponyer]
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Hjælper & part</h2>
          <p className="text-gray-600 leading-relaxed">
            Vil du være endnu tættere på hestene, kan du blive hjælper eller få en part.
            Det giver ekstra tid i stalden og et stærkt fællesskab.
          </p>
          <p className="text-sm text-green-700 mt-3 italic">
            [Indsæt jeres regler for hjælper- og partordning]
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Ferie & sommerridelejr</h2>
          <p className="text-gray-600 leading-relaxed">
            I skoleferierne holder vi ridelejre, hvor børnene er sammen med hestene fra
            morgen til eftermiddag. Det er højdepunkter, mange husker resten af livet.
          </p>
          <p className="text-sm text-green-700 mt-3 italic">
            [Indsæt datoer og tilmelding til årets ridelejr]
          </p>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
