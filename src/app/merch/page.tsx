import { merchProducts } from "@/data/merch";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata = {
  title: "Merch | 702Market",
  description: "Wear a little piece of the 702Market.",
};

export default function MerchPage() {
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
            <div className="product-art" aria-hidden="true"><span>702</span></div>
            <div className="product-card-copy">
              <div><h2>{product.name}</h2><p>{product.description}</p></div>
              <strong>{product.price}</strong>
            </div>
            <a className="button button-dark" href="#contact">Shop now <span aria-hidden="true">↗</span></a>
          </article>
        ))}
      </section>
      <SiteFooter actionHref="/contact" actionLabel="Questions?" />
    </main>
  );
}
