import { ImageResponse } from "next/og";

export const alt = "MarketElla, not your average Las Vegas market";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ alignItems: "center", background: "linear-gradient(135deg,#ff7a2f,#ff514f 50%,#ff2f73)", color: "#050304", display: "flex", flexDirection: "column", fontFamily: "Arial Black, Arial, sans-serif", height: "100%", justifyContent: "center", padding: 70, textAlign: "center", width: "100%" }}>
      <div style={{ color: "#fffaf7", display: "flex", fontSize: 124, fontWeight: 900, lineHeight: 0.85, textTransform: "uppercase" }}>MarketElla</div>
      <div style={{ border: "5px solid #050304", borderRadius: 999, display: "flex", fontSize: 30, fontWeight: 800, marginTop: 52, padding: "18px 34px", textTransform: "uppercase" }}>Not your average Las Vegas market</div>
    </div>,
    size,
  );
}
