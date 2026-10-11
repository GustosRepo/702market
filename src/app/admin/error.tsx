"use client";

import { useEffect } from "react";

export default function AdminError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <main className="admin-error-page">
      <section className="admin-empty-panel">
        <p className="eyebrow">Could not save that</p>
        <h2>Something<br /><em>went wrong.</em></h2>
        <p>Check the fields and connection, then retry. Existing records have not been intentionally removed.</p>
        <button className="button button-accent" onClick={retry} type="button">Try again</button>
      </section>
    </main>
  );
}
