import Link from "next/link";

type SiteHeaderProps = {
  backHref?: string;
  backLabel?: string;
};

export default function SiteHeader({ backHref = "/", backLabel = "Back home" }: SiteHeaderProps) {
  return (
    <header className="page-header">
      <Link className="wordmark" href="/" aria-label="702Market home">
        702<span>Market</span>
      </Link>
      <nav className="compact-nav" aria-label="Site navigation">
        <Link href="/events">Events</Link>
        <Link href="/merch">Merch</Link>
        <Link href="/socials">Socials</Link>
        <Link href="/apply">Sell</Link>
        <Link className="text-link" href={backHref}>
          {backLabel} <span aria-hidden="true">↗</span>
        </Link>
      </nav>
    </header>
  );
}
