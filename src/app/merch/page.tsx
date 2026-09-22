import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { getMerchProducts } from "@/lib/merch";
import { merchAsset } from "@/lib/site-assets";

export const metadata = {
  title: "Merch | 702Market",
  description: "Wear a little piece of the 702Market.",
};

export default async function MerchPage() {
  const merchProducts = await getMerchProducts();

  return (
    <main className="page-shell merch-page">
      <SiteHeader />
      <section className="content-intro merch-intro">
        <p className="eyebrow">Wear the neighborhood</p>
        <h1>Market<br /><em>merch.</em></h1>
        <p>Little souvenirs for people who know where the good stuff is.</p>
      </section>
      <section className="product-grid" aria-label="702Market products">
        {merchProducts.map((product) => (
          <article className="product-card" key={product.slug}>
            <div className="product-art" style={{ "--asset-image": `url(${merchAsset(product.slug)})` } as React.CSSProperties} aria-hidden="true"><span>702</span></div>
            <div className="product-card-copy">
              <div><h2>{product.name}</h2><p>{product.description}</p></div>
              <strong>{product.price}</strong>
            </div>
            <a className="button button-dark" href={product.externalUrl} target={product.externalUrl.startsWith("http") ? "_blank" : undefined} rel={product.externalUrl.startsWith("http") ? "noreferrer" : undefined}>Shop now <span aria-hidden="true">↗</span></a>
          </article>
        ))}
      </section>
      <SiteFooter actionHref="/contact" actionLabel="Questions?" />
    </main>
  );
}
