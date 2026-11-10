"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { SitePhoto } from "@/lib/site-media";
import styles from "./photo-carousel.module.css";

export default function PhotoCarousel({ photos }: { photos: SitePhoto[] }) {
  const galleryRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<number | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [edges, setEdges] = useState({ start: true, end: photos.length <= 1 });
  const selected = active === null ? null : photos[active];

  useEffect(() => {
    const gallery = galleryRef.current;
    const track = trackRef.current;
    if (!gallery || !track || photos.length < 2 || active !== null) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let hovered = window.matchMedia("(hover: hover)").matches && gallery.matches(":hover");
    let touching = false;
    let disposed = false;
    let timer: number | undefined;

    function canPlay() {
      if (disposed || !gallery || !track) return false;
      const bounds = gallery.getBoundingClientRect();
      return !(
        hovered || touching || document.hidden || reducedMotion.matches ||
        document.documentElement.dataset.motionPaused === "true" ||
        gallery.contains(document.activeElement) ||
        bounds.bottom <= 0 || bounds.top >= window.innerHeight
      );
    }

    function schedule() {
      window.clearTimeout(timer);
      if (!canPlay() || !track) return;

      timer = window.setTimeout(() => {
        if (!canPlay()) { schedule(); return; }
        const first = track.children[0] as HTMLElement | undefined;
        const second = track.children[1] as HTMLElement | undefined;
        const step = first && second
          ? second.getBoundingClientRect().left - first.getBoundingClientRect().left
          : track.clientWidth;
        const end = track.scrollWidth - track.clientWidth;
        track.scrollTo({ left: track.scrollLeft >= end - 2 ? 0 : Math.min(end, track.scrollLeft + step), behavior: "smooth" });
        schedule();
      }, 5000);
    }

    function enter(event: PointerEvent) {
      if (event.pointerType !== "touch") { hovered = true; schedule(); }
    }
    function leave() { hovered = false; schedule(); }
    function touch(event: PointerEvent) {
      if (event.pointerType === "touch") { touching = true; schedule(); }
    }
    function release() {
      if (touching) { touching = false; schedule(); }
    }
    function focusChanged() { queueMicrotask(schedule); }

    const visibility = new IntersectionObserver(schedule);
    visibility.observe(gallery);
    const motion = new MutationObserver(schedule);
    motion.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion-paused"] });
    gallery.addEventListener("pointerenter", enter);
    gallery.addEventListener("pointerleave", leave);
    gallery.addEventListener("pointerdown", touch);
    gallery.addEventListener("focusin", focusChanged);
    gallery.addEventListener("focusout", focusChanged);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("scroll", schedule, { passive: true });
    document.addEventListener("visibilitychange", schedule);
    reducedMotion.addEventListener("change", schedule);
    schedule();

    return () => {
      disposed = true;
      window.clearTimeout(timer);
      visibility.disconnect();
      motion.disconnect();
      gallery.removeEventListener("pointerenter", enter);
      gallery.removeEventListener("pointerleave", leave);
      gallery.removeEventListener("pointerdown", touch);
      gallery.removeEventListener("focusin", focusChanged);
      gallery.removeEventListener("focusout", focusChanged);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("scroll", schedule);
      document.removeEventListener("visibilitychange", schedule);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, [active, photos.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => setEdges({
      start: track.scrollLeft <= 2,
      end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 2,
    });
    const observer = new ResizeObserver(update);
    observer.observe(track);
    track.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", update);
    };
  }, [photos.length]);

  useEffect(() => {
    if (active === null) return;
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [active]);

  if (photos.length === 0) return null;

  function scroll(direction: number) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * track.clientWidth * 0.8,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  function advance(direction: number) {
    setActive((index) => index === null ? null : (index + direction + photos.length) % photos.length);
  }

  return (
    <section className={styles.gallery} ref={galleryRef} aria-label="MarketElla photo gallery">
      <div className={styles.track} ref={trackRef} role="group" aria-roledescription="carousel" aria-label="Gallery photos" tabIndex={0}>
        {photos.map((photo, index) => (
          <button
            className={styles.photo}
            key={`${photo.src}-${index}`}
            type="button"
            aria-label={`Open photo ${index + 1}: ${photo.alt}`}
            onClick={() => {
              setActive(index);
            }}
          >
            <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 680px) 78vw, (max-width: 1300px) 34vw, 440px" />
            {photo.caption ? <span className={styles.caption}>{photo.caption}</span> : null}
            <span className={styles.expand} aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      {photos.length > 1 ? (
        <div className={styles.controls}>
          <button type="button" aria-label="Previous gallery photos" disabled={edges.start} onClick={() => scroll(-1)}>←</button>
          <span>{photos.length} photos</span>
          <button type="button" aria-label="Next gallery photos" disabled={edges.end} onClick={() => scroll(1)}>→</button>
        </div>
      ) : null}
      <dialog
        className={styles.viewer}
        ref={dialogRef}
        aria-label="MarketElla photo viewer"
        onClose={() => setActive(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            advance(event.key === "ArrowLeft" ? -1 : 1);
          } else if (event.key === "Tab") {
            const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not([disabled])");
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
          }
        }}
      >
        {selected ? (
          <>
            <span className="visually-hidden" aria-live="polite">Photo {active! + 1} of {photos.length}</span>
            <button
              className={styles.viewerPhoto}
              type="button"
              aria-label="Close enlarged photo"
              onClick={() => dialogRef.current?.close()}
              onTouchStart={(event) => { touchStart.current = event.touches.length === 1 ? event.touches[0].clientX : null; }}
              onTouchEnd={(event) => {
                const end = event.changedTouches[0]?.clientX;
                if (touchStart.current !== null && end !== undefined && Math.abs(end - touchStart.current) > 50) {
                  event.preventDefault();
                  advance(end < touchStart.current ? 1 : -1);
                }
                touchStart.current = null;
              }}
            >
              <Image
                className={styles.enlargedPhoto}
                src={selected.src}
                alt={selected.alt}
                width={1600}
                height={1200}
                sizes="95vw"
              />
            </button>
          </>
        ) : null}
      </dialog>
    </section>
  );
}
