"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

const defaultPhrases = [
  "not your average market",
  "market talk",
  "real stories",
  "behind the scenes",
  "shop small",
  "vegas outside",
];

type MarqueeBandProps = {
  label?: string;
  phrases?: string[];
  className?: string;
};

export default function MarqueeBand({
  label = "not your average market",
  phrases = defaultPhrases,
  className = "",
}: MarqueeBandProps) {
  const bandRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const cycle = useMemo(() => {
    const content = (phrases.includes(label) ? phrases : [...phrases, label]).filter((phrase) => phrase.trim());
    return content.length ? content : defaultPhrases;
  }, [phrases, label]);
  const minimumRepeats = Math.max(1, Math.ceil(24 / cycle.length));
  const [repeats, setRepeats] = useState(minimumRepeats);

  useEffect(() => {
    const band = bandRef.current;
    const group = groupRef.current;
    if (!band || !group) return;

    const observer = new ResizeObserver(() => {
      const renderedRepeats = group.children.length / cycle.length;
      const cycleWidth = group.getBoundingClientRect().width / renderedRepeats;
      if (!Number.isFinite(cycleWidth) || cycleWidth <= 0) return;
      const needed = Math.max(minimumRepeats, Math.ceil((band.getBoundingClientRect().width + 1) / cycleWidth));
      setRepeats((current) => current === needed ? current : needed);
    });
    observer.observe(band);
    observer.observe(group);
    return () => observer.disconnect();
  }, [cycle.length, minimumRepeats]);

  const group = Array.from(
    { length: repeats },
    () => cycle,
  ).flat();
  return (
    <div className={`marquee-band ${className}`.trim()} aria-hidden="true" ref={bandRef}>
      <div className="marquee-track" style={{ "--marquee-duration": `${56 * repeats * cycle.length / 12}s` } as CSSProperties}>
        {[0, 1].map((copy) => (
          <div className="marquee-group" key={copy} ref={copy === 0 ? groupRef : undefined}>
            {group.map((phrase, index) => (
              <span key={`${phrase}-${index}`}>{phrase}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
