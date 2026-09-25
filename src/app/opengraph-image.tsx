import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.brand}: ${site.person}. ${site.displayLine}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const font = await readFile(join(process.cwd(), "src/fonts/Geist-SemiBold.ttf"));

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 84px",
        background: "#07090c",
        backgroundImage:
          "radial-gradient(circle at 82% 18%, rgba(125,183,255,0.16), rgba(7,9,12,0) 55%)",
        color: "#f2f4f7",
        fontFamily: "Geist",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ display: "flex", position: "relative", width: 40, height: 56 }}>
          <div
            style={{
              position: "absolute",
              left: 2,
              top: 0,
              width: 8,
              height: 56,
              borderRadius: 4,
              background: "rgba(242,244,247,0.34)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 2,
              top: 0,
              width: 8,
              height: 30,
              borderRadius: 4,
              background: "#f2f4f7",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 14,
              top: 4,
              width: 24,
              height: 24,
              borderRadius: 12,
              background: "#7db7ff",
            }}
          />
        </div>
        <div style={{ fontSize: 34, letterSpacing: "-0.03em", display: "flex" }}>
          <span>Prince</span>
          <span style={{ color: "#a9b1bc" }}>Sec</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 34, color: "#a9b1bc", marginBottom: 20 }}>{site.person}</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 132,
            lineHeight: 0.95,
            letterSpacing: "-0.05em",
          }}
        >
          <span>Engineering</span>
          <div style={{ display: "flex" }}>
            <span>Security</span>
            <span style={{ color: "#7db7ff" }}>.</span>
          </div>
        </div>
      </div>
    </div>,
    { ...size, fonts: [{ name: "Geist", data: font, weight: 600, style: "normal" }] },
  );
}
