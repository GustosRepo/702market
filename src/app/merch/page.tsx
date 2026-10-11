import ContactFormSection from "@/components/contact-form-section";
import MarqueeBand from "@/components/marquee-band";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { getMerchProducts } from "@/lib/merch";
import { merchAsset } from "@/lib/site-assets";

export const metadata = {
  title: "Online Store | MarketElla",
  description: "Wear a little piece of MarketElla.",
};

export default async function MerchPage() {
  const merchProducts = await getMerchProducts();

  return (
    <main className="shop-page">
      <section className="shop-hero">
        <SiteHeader ariaLabel="Shop navigation" className="shop-hero-nav" variant="hero" />
        <MarqueeBand
          className="shop-hero-marquee"
          label="take a little marketella home"
          phrases={["marketella shop", "take a little marketella home", "made for market days"]}
        />
        <div className="shop-hero-content">
          <p className="eyebrow">online store</p>
          <h1>the marketella shop</h1>
          <p>Good things are on the way. Check back for the first drop.</p>
        </div>
      </section>

      <section className="shop-catalog" aria-labelledby="shop-catalog-heading">
        <div className="shop-catalog-heading">
          <p className="eyebrow">the first drop</p>
          <h2 id="shop-catalog-heading">stuff worth taking home.</h2>
        </div>
        {merchProducts.length > 0 ? (
          <div className="product-grid" aria-label="MarketElla products">
            {merchProducts.map((product) => (
              <article className="product-card" key={product.slug}>
                <div className="product-art" style={{ "--asset-image": `url(${product.imagePath || merchAsset(product.slug)})` } as React.CSSProperties} aria-hidden="true"><span>M</span></div>
                <div className="product-card-copy">
                  <div><h3>{product.name}</h3><p>{product.description}</p></div>
                  <strong>{product.price}</strong>
                </div>
                <a className="button button-dark" href={product.externalUrl} target={product.externalUrl.startsWith("http") ? "_blank" : undefined} rel={product.externalUrl.startsWith("http") ? "noreferrer" : undefined}>Shop now <span aria-hidden="true">↗</span></a>
              </article>
            ))}
          </div>
        ) : (
          <div className="shop-empty-state">
            <span aria-hidden="true">✦</span>
            <h3>the shelves are getting cute.</h3>
            <p>Our first MarketElla drop is coming soon.</p>
          </div>
        )}
      </section>

      <ContactFormSection id="shop-contact" />
      <SiteFooter actionHref="/contact" actionLabel="Questions?" />
    </main>
  );
}
