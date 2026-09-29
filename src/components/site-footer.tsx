import Link from "next/link";

export default function SiteFooter({ actionHref = "/apply", actionLabel = "Apply to sell" }: { actionHref?: string; actionLabel?: string }) {
  return (
    <footer className="site-footer">
      <Link className="wordmark" href="/">Market<span>ella</span></Link>
      <p>Las Vegas, NV · Come find us.</p>
      <Link href={actionHref}>{actionLabel} ↗</Link>
      <div className="footer-meta">
        <span>© 2026 Marketella</span>
        <Link href="/socials">Socials</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <a href="https://www.code-werx.com/" target="_blank" rel="noreferrer">Built by CODEWERX ↗</a>
      </div>
    </footer>
  );
}
