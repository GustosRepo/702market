export const marketLocations = [
  { id: "fergusons-downtown", name: "Fergusons Downtown", aliases: ["Ferguson's Downtown"] },
  { id: "cowabunga-canyon", name: "Cowabunga Canyon", aliases: [] },
  { id: "container-park", name: "Container Park", aliases: ["Downtown Container Park"] },
] as const;

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function findMarketLocation(value: string) {
  const normalized = normalize(value);
  return marketLocations.find((location) =>
    [location.id, location.name, ...location.aliases].some((name) => normalize(name) === normalized),
  );
}

export function readMarketLocation(formData: FormData) {
  const selection = formData.get("locationSelection");
  const location = marketLocations.find((item) => item.id === selection);
  if (location) return location.name;
  const customName = formData.get("locationName");
  if (selection !== "other" || typeof customName !== "string" || !customName.trim()) {
    throw new Error("Choose a location or enter another location name.");
  }
  return findMarketLocation(customName)?.name || customName.trim();
}
