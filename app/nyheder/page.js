import Image from "next/image";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHero from "../components/PageHero";
import FadeIn from "../components/FadeIn";
import { getNyheder } from "../../sanity/lib/queries";
import { urlFor } from "../../sanity/lib/image";

export const metadata = {
  title: "Nyheder",
  description: "Nyheder fra Egene Rideklub i Holte — det sker i rideskolen, springmiljøet og klubben.",
};

// Simpel oversættelse af rich text-blokke til afsnit
function tilAfsnit(blokke) {
  if (!blokke) return [];
  return blokke
    .filter((b) => b._type === "block")
    .map((b) => (b.children || []).map((c) => c.text).join(""))
    .filter(Boolean);
}

function datoDansk(dato) {
  if (!dato) return "";
  return new Date(dato).toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" });
}

export default async function Nyheder() {
  const nyheder = await getNyheder(50);

  return (
    <main className="text-[#1a1a1a]">
      <SiteNav />
      <PageHero
        image="/cafe.jpg"
        alt="Livet på Egene"
        title="Nyheder"
        subtitle="Det sker på Egene Rideklub"
      />

      <div className="max-w-3xl mx-auto px-6 py-20">
        {(!nyheder || nyheder.length === 0) ? (
          <p className="text-center text-gray-500">
            Der er ingen nyheder endnu. De dukker op her, så snart de oprettes.
          </p>
        ) : (
          <div className="space-y-16">
            {nyheder.map((n) => (
              <FadeIn key={n._id}>
                <article>
                  {n.billede && (
                    <div className="relative w-full h-72 rounded-2xl overflow-hidden mb-6">
                      <Image
                        src={urlFor(n.billede).width(1000).height(560).fit("crop").url()}
                        alt={n.billede.alt || n.titel}
                        fill
                        sizes="(min-width: 768px) 768px, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <p className="text-sm text-green-700 mb-2">{datoDansk(n.dato)}</p>
                  <h2 className="text-2xl font-bold text-green-900 mb-3">{n.titel}</h2>
                  <div className="space-y-3 text-gray-600 leading-relaxed">
                    {tilAfsnit(n.tekst).map((afsnit, i) => (
                      <p key={i}>{afsnit}</p>
                    ))}
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}
