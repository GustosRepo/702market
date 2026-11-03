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
  const cycle = [...phrases, label];
  const group = Array.from(
    { length: Math.max(1, Math.ceil(6 / cycle.length)) },
    () => cycle,
  ).flat();
  const repeated = [...group, ...group];

  return (
    <div className={`marquee-band ${className}`.trim()} aria-hidden="true">
      <div className="marquee-track">
        {repeated.map((phrase, index) => (
          <span key={`${phrase}-${index}`}>{phrase}</span>
        ))}
      </div>
    </div>
  );
}
