import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{ alignItems: "center", background: "linear-gradient(135deg,#ff7a2f,#ff2f73)", color: "#fffaf7", display: "flex", fontFamily: "Arial Black, Arial, sans-serif", fontSize: 44, fontWeight: 900, height: "100%", justifyContent: "center", width: "100%" }}>M</div>,
    size,
  );
}
