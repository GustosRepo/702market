"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DetailedButterfly from "@/components/detailed-butterfly";
import { countdownUnits, type CountdownEvent } from "@/lib/event-countdown";
import type { CountdownContent } from "@/lib/homepage-content";

type EventCountdownProps = {
  content: CountdownContent;
  events: CountdownEvent[];
  initialNow: number;
};

export default function EventCountdown({ content, events, initialNow }: EventCountdownProps) {
  const [now, setNow] = useState(initialNow);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const event = events.find((candidate) => candidate.endsAt > now);
  const started = event && event.startsAt <= now;

  return (
    <section className="countdown-section" aria-labelledby="countdown-heading">
      <div className="countdown-butterfly countdown-butterfly-left" aria-hidden="true">
        <DetailedButterfly />
      </div>
      <div className="countdown-butterfly countdown-butterfly-right" aria-hidden="true">
        <DetailedButterfly />
      </div>
      <h2 className="countdown-heading" id="countdown-heading">{content.heading}</h2>
      <div className="countdown-box">
        <h3 className="countdown-box-title">NEXT MARKET</h3>
        {event ? (
          <>
            <p className="countdown-event-details">
              <Link href={`/events/${event.slug}`}>{event.title}</Link>
              {" - "}{event.location}{", "}{event.dateLabel}
            </p>
            <div className="countdown-timer" role="timer" aria-label={`Time until ${event.title}`}>
              {countdownUnits(event.startsAt, now).map(({ label, value }) => (
                <div className="countdown-unit" key={label}>
                  <span className="countdown-number">{String(value).padStart(2, "0")}</span>
                  <span className="countdown-label">{label}</span>
                </div>
              ))}
            </div>
            {started ? <p className="countdown-status" role="status">It&apos;s market time!</p> : null}
          </>
        ) : <p className="countdown-empty" role="status">{content.emptyMessage}</p>}
      </div>
      {event ? (
        <Link className="button countdown-cta" href={`/events/${event.slug}`}>
          Tell me more <span aria-hidden="true">→</span>
        </Link>
      ) : null}
    </section>
  );
}
