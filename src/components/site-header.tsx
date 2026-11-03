"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { siteNavLinks } from "@/components/site-navigation";
import styles from "./site-header.module.css";

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
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const links = [...siteNavLinks.filter((link) => link.href !== "/apply"), ...siteNavLinks.filter((link) => link.href === "/apply")];

  useEffect(() => {
    if (!menuOpen) return;
    function closeOutside(event: PointerEvent) {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    const desktop = window.matchMedia("(min-width: 1101px)");
    function closeOnDesktop(event: MediaQueryListEvent) {
      if (event.matches) setMenuOpen(false);
    }
    document.addEventListener("pointerdown", closeOutside);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [menuOpen]);

  const headerClassName = [
    styles.header,
    variant === "hero" ? styles.hero : styles.page,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header
      className={headerClassName}
      ref={headerRef}
      onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) {
          setMenuOpen(false);
          toggleRef.current?.focus();
        }
      }}
    >
      <div className={styles.bar}>
        <Link className={styles.brand} href="/" aria-label="MarketElla home" onClick={() => setMenuOpen(false)}>
          MarketElla
          <small>est. 2023</small>
        </Link>
        <button
          className={styles.toggle}
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen(!menuOpen)}
          ref={toggleRef}
        >
          {menuOpen ? "Close" : "Menu"}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d={menuOpen ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"} />
          </svg>
        </button>
      </div>
      <nav className={`${styles.navigation} ${menuOpen ? styles.open : ""}`} aria-label={ariaLabel} id={menuId}>
        {links.map((link) => (
          <Link
            className={`${styles.link} ${link.href === "/apply" ? styles.apply : ""}`}
            href={link.label === "Calendar" ? calendarHref : link.href}
            key={link.label}
            aria-current={pathname === link.href || pathname.startsWith(`${link.href}/`) ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
            {link.href === "/apply" ? <span aria-hidden="true">↗</span> : null}
          </Link>
        ))}
        {backHref ? (
          <Link className={`${styles.link} ${styles.context}`} href={backHref} onClick={() => setMenuOpen(false)}>
            {backLabel} <span aria-hidden="true">↗</span>
          </Link>
        ) : null}
      </nav>
    </header>
  );
}
