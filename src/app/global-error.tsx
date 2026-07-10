"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          background: "#09090b",
          color: "#f4f4f5",
          fontFamily: "system-ui, sans-serif",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          margin: 0,
        }}
      >
        <div style={{ maxWidth: 520, fontFamily: "ui-monospace, monospace" }}>
          <div style={{ color: "#71717a", fontSize: 14, marginBottom: 12 }}>
            {"// fatal error"}
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 800, margin: "0 0 16px", letterSpacing: -1 }}>
            Something broke.
          </h1>
          <p style={{ color: "#a1a1aa", fontSize: 16, lineHeight: 1.5, marginBottom: 24 }}>
            An unexpected error escaped to the root. Try reloading, and if it
            keeps happening, email contact@anmolmalhan.com.
            {error.digest ? ` Reference: ${error.digest}` : ""}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "12px 24px",
              borderRadius: 999,
              background: "#60a5fa",
              color: "#09090b",
              border: 0,
              fontWeight: 700,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            reset()
          </button>
        </div>
      </body>
    </html>
  );
}
