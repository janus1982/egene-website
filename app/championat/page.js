import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHero from "../components/PageHero";
import FadeIn from "../components/FadeIn";
import { getChampionat } from "../../sanity/lib/queries";
import { beregnRangliste, kvalificererTilPraemie } from "../../lib/championat/pointmodel";

export const metadata = {
  title: "Championat",
  description: "Egene Rideklubs championat - uofficiel rangliste baseret på Equipe-resultater.",
};

function RanglisteTabel({ titel, rangliste, kvalificering }) {
  return (
    <FadeIn>
      <h2 className="text-2xl font-bold text-green-900 mb-4">{titel}</h2>
      {rangliste.length === 0 ? (
        <p className="text-gray-600">Ingen resultater endnu i denne kategori.</p>
      ) : (
        <div className="overflow-x-auto border border-green-100 rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-green-900 bg-green-50/70">
                <th className="px-4 py-3 w-10">#</th>
                <th className="px-4 py-3">Rytter</th>
                <th className="px-4 py-3">Hest</th>
                <th className="px-4 py-3 text-right">Point</th>
                <th className="px-4 py-3 text-right">Starter</th>
              </tr>
            </thead>
            <tbody>
              {rangliste.map((r) => (
                <tr key={`${r.rytter}-${r.hest}`} className="border-t border-green-100">
                  <td className="px-4 py-2.5 text-green-700 font-medium">{r.placering}</td>
                  <td className="px-4 py-2.5 text-gray-800">{r.rytter}</td>
                  <td className="px-4 py-2.5 text-gray-600">{r.hest}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-green-900">{r.totalPoint}</td>
                  <td className="px-4 py-2.5 text-right text-gray-500">{r.antalResultater}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!kvalificering.praemieres && (
        <p className="text-sm text-gray-500 mt-3 italic">{kvalificering.aarsag}</p>
      )}
    </FadeIn>
  );
}

export default async function Championat() {
  const { saeson, resultater } = await getChampionat();
  const pony = beregnRangliste(resultater, "Pony spring");
  const hest = beregnRangliste(resultater, "Hest spring");

  return (
    <main className="text-[#1a1a1a]">
      <SiteNav />
      <PageHero
        image="/springbane.jpg"
        alt="Springbanen på Egene Rideklub i Holte"
        title="Championat"
        subtitle={saeson ? `Sæson ${saeson.aar}` : "Klubbens egen pointkonkurrence"}
      />

      <div className="max-w-3xl mx-auto px-6 py-20 space-y-14">
        <FadeIn>
          <p className="text-gray-600 leading-relaxed">
            Uofficiel rangliste baseret på Equipe-resultater. Pointene beregnes automatisk
            efter Egenes pointmodel og opdateres løbende gennem sæsonen.
          </p>
        </FadeIn>

        <RanglisteTabel titel="Pony spring" rangliste={pony} kvalificering={kvalificererTilPraemie(pony)} />
        <RanglisteTabel titel="Hest spring" rangliste={hest} kvalificering={kvalificererTilPraemie(hest)} />

        <FadeIn>
          <p className="text-gray-600 text-sm">
            Spørgsmål om championatet? Skriv til{" "}
            <a href="mailto:championat@egene.dk" className="text-green-700 underline">championat@egene.dk</a>.
          </p>
        </FadeIn>
      </div>

      <SiteFooter />
    </main>
  );
}
