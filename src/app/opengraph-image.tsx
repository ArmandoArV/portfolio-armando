import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Armando Arredondo Valle — Software Engineer at Microsoft";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #020617, #0f172a, #020617)",
          padding: "60px 80px",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Mini solar system decoration */}
        <div
          style={{
            position: "absolute",
            right: 120,
            top: "50%",
            width: 200,
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "translateY(-50%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: "1px solid rgba(51,65,85,0.4)",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 140,
              height: 140,
              borderRadius: "50%",
              border: "1px solid rgba(51,65,85,0.3)",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 200,
              height: 200,
              borderRadius: "50%",
              border: "1px solid rgba(51,65,85,0.2)",
            }}
          />
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "#FDB813",
              opacity: 0.8,
            }}
          />
        </div>

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "white",
              lineHeight: 1.1,
            }}
          >
            Armando Arredondo Valle
          </div>

          <div
            style={{
              width: 120,
              height: 3,
              background: "#3b82f6",
              borderRadius: 2,
              marginTop: 8,
              marginBottom: 8,
            }}
          />

          <div style={{ display: "flex", fontSize: 28, lineHeight: 1.3 }}>
            <span style={{ color: "#94a3b8" }}>Software Engineer at</span>
            <span
              style={{ color: "#60a5fa", fontWeight: 700, marginLeft: 8 }}
            >
              Microsoft
            </span>
          </div>

          <div
            style={{
              fontSize: 18,
              color: "#64748b",
              fontFamily: "monospace",
              marginTop: 12,
            }}
          >
            React · Azure · .NET · Go · TypeScript · AI/ML
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: 80,
            fontSize: 16,
            color: "#3b82f6",
            fontFamily: "monospace",
          }}
        >
          armandoav.com
        </div>
      </div>
    ),
    { ...size }
  );
}
