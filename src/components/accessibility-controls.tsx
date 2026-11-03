"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

export default function AccessibilityControls() {
  const [paused, setPaused] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {!pathname.startsWith("/admin") ? (
        <button className="motion-toggle" type="button" aria-pressed={paused} onClick={() => {
          const next = !paused;
          setPaused(next);
          document.documentElement.dataset.motionPaused = String(next);
        }}>{paused ? "Resume animations" : "Pause animations"}</button>
      ) : null}
    </>
  );
}
