import Link from "next/link";

export default function SiteFooter({ actionHref = "/apply", actionLabel = "Apply to sell" }: { actionHref?: string; actionLabel?: string }) {
  return (
    <footer className="site-footer">
      <Link className="wordmark" href="/">Market<span>Ella</span></Link>
      <p>Las Vegas, NV · Come find us.</p>
      <Link className="footer-action" href={actionHref}>{actionLabel} ↗</Link>
      <div className="footer-meta">
        <span>© 2026 MarketElla LV LLC</span>
        <Link href="/socials">Socials</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <a className="footer-credit" href="https://www.code-werx.com/" target="_blank" rel="noreferrer">
          made by code werx &lt;3
        </a>
      </div>
    </footer>
  );
}
