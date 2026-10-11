import Link from "next/link";
import { siteNavLinks } from "@/components/site-navigation";

type SiteHeaderProps = {
  ariaLabel?: string;
  backHref?: string;
  backLabel?: string;
  calendarHref?: string;
  className?: string;
  variant?: "page" | "hero";
};

export default function SiteHeader({
  ariaLabel = "Site navigation",
  backHref,
  backLabel = "Back",
  calendarHref = "/events",
  className,
  variant = "page",
}: SiteHeaderProps) {
  const headerClassName = [
    variant === "hero" ? "site-nav marketella-nav" : "page-header marketella-nav page-marketella-nav",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClassName}>
      <Link className="wordmark marketella-wordmark" href="/" aria-label="MarketElla home">
        MarketElla
        <small>est. 2023</small>
      </Link>
      <nav className="nav-links" aria-label={ariaLabel}>
        {siteNavLinks.map((link) => (
          <Link href={link.label === "Calendar" ? calendarHref : link.href} key={link.label}>
            {link.label}
          </Link>
        ))}
        {backHref ? (
          <Link className="text-link nav-context-link" href={backHref}>
            {backLabel} <span aria-hidden="true">↗</span>
          </Link>
        ) : null}
      </nav>
    </header>
  );
}
