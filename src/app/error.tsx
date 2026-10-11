"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <main className="fallback-page fallback-error">
      <section className="fallback-panel">
        <p className="eyebrow">something went sideways</p>
        <h1>give that<br /><em>one more try.</em></h1>
        <p>Your information has not been intentionally discarded. Retry the page, and contact us if it keeps happening.</p>
        <button className="button button-dark" onClick={retry} type="button">Try again</button>
      </section>
    </main>
  );
}
