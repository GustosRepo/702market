"use client";

import { useState } from "react";
import { findMarketLocation, marketLocations } from "@/lib/market-locations";

export default function AdminLocationField({ initialLocation = "" }: { initialLocation?: string }) {
  const knownLocation = findMarketLocation(initialLocation);
  const [selection, setSelection] = useState<string>(knownLocation?.id || (initialLocation ? "other" : ""));

  return (
    <div>
      <label htmlFor="event-location">Location</label>
      <select id="event-location" name="locationSelection" value={selection} onChange={(event) => setSelection(event.target.value)} required>
        <option value="" disabled>Choose a location</option>
        {marketLocations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
        <option value="other">Other location</option>
      </select>
      {selection === "other" ? (
        <label>Other location name<input name="locationName" defaultValue={knownLocation ? "" : initialLocation} required /></label>
      ) : null}
    </div>
  );
}
