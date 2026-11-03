import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "Link Tree | MarketElla",
  description: "Find all official MarketElla links on Linktree.",
};

export default function SocialsPage() {
  return (
    <main className="page-shell socials-page">
      <SiteHeader ariaLabel="Link Tree navigation" />
      <section className="content-intro socials-intro linktree-content">
        <h1>MarketElla Linktree</h1>
        <a className="button linktree-cta" href={siteConfig.socials.linktree}>
          Visit our Linktree <span aria-hidden="true">→</span>
        </a>
      </section>
      <SiteFooter actionHref="/apply" actionLabel="Apply 2 sell" />
    </main>
  );
}
