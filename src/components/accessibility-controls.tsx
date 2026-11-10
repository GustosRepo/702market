"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion-paused"] });
  return () => observer.disconnect();
}

function getPaused() {
  return document.documentElement.dataset.motionPaused === "true";
}

function getServerPaused() { return false; }

export default function AccessibilityControls() {
  const paused = useSyncExternalStore(subscribe, getPaused, getServerPaused);

  return (
    <button className="motion-toggle" type="button" aria-pressed={paused} onClick={() => {
      document.documentElement.dataset.motionPaused = String(!paused);
    }}>{paused ? "Resume animations" : "Pause animations"}</button>
  );
}
