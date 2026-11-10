import Link from "next/link";
import AccessibilityControls from "@/components/accessibility-controls";
import { siteConfig } from "@/lib/site-config";

export default function SiteFooter({ actionHref, actionLabel }: { actionHref?: string; actionLabel?: string }) {
  return (
    <footer className="site-footer">
      <Link className="wordmark" href="/">Market<span>Ella</span></Link>
      <p>Las Vegas, NV</p>
      {actionHref && actionLabel ? <Link className="footer-action" href={actionHref}>{actionLabel} ↗</Link> : null}
      <div className="footer-meta">
        <div className="footer-meta-links">
          <span>© 2026 MarketElla LV LLC. All rights reserved.</span>
          <a href={siteConfig.socials.linktree}>Socials</a>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <a className="footer-credit" href="https://www.code-werx.com/" target="_blank" rel="noreferrer">
            made by code werx &lt;3
          </a>
        </div>
        <AccessibilityControls />
      </div>
    </footer>
  );
}
