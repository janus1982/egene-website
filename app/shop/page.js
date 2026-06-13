import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHero from "../components/PageHero";
import { getProdukter } from "../../sanity/lib/queries";
import { urlFor } from "../../sanity/lib/image";
import ShopKlient from "./ShopKlient";

export const metadata = {
  title: "Webshop",
  description: "Egene Rideklubs webshop - t-shirts, kasketter og muleposer med klubbens logo.",
};

export default async function Shop() {
  const produkter = await getProdukter();

  // Forbered billede-URL'er server-side (urlFor kan ikke køre i klientkomponent)
  const klar = (produkter || []).map((p) => ({
    ...p,
    billedeUrl: p.billede ? urlFor(p.billede).width(600).height(600).fit("crop").url() : null,
  }));

  return (
    <main className="text-[#1a1a1a]">
      <SiteNav />
      <PageHero
        image="/cafe.jpg"
        alt="Egene merchandise"
        title="Webshop"
        subtitle="Vis dit Egene med stolthed"
      />
      <ShopKlient produkter={klar} />
      <SiteFooter />
    </main>
  );
}
