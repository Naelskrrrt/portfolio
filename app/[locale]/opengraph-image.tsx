import { ImageResponse } from "next/og";

export const alt = "LALASON Annaël — Architecte Systèmes & IA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const photoArrayBuffer = await fetch(
    new URL("../../public/photo-profile.png", import.meta.url),
  ).then((res) => res.arrayBuffer());
  const photoBase64 = `data:image/png;base64,${Buffer.from(photoArrayBuffer).toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#0a0a0a",
        fontFamily: "sans-serif",
      }}
    >
      {/* Profile photo */}
      <img
        src={photoBase64}
        width={160}
        height={160}
        style={{
          borderRadius: "50%",
          border: "3px solid #333",
          objectFit: "cover",
        }}
      />

      {/* Name */}
      <div
        style={{
          marginTop: 24,
          fontSize: 48,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: "-0.02em",
        }}
      >
        LALASON Annaël
      </div>

      {/* Role */}
      <div
        style={{
          marginTop: 8,
          fontSize: 24,
          color: "#a1a1aa",
        }}
      >
        Architecte Systèmes & IA
      </div>

      {/* Available badge */}
      <div
        style={{
          marginTop: 16,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#22c55e",
          }}
        />
        <span style={{ fontSize: 18, color: "#22c55e" }}>
          Disponible pour collaborations stratégiques
        </span>
      </div>
    </div>,
    { ...size },
  );
}
