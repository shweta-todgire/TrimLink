import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "./Toast";

export default function ResultCard({ result }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const [qrDownloading, setQrDownloading] = useState(false);

  const shortUrl = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/${result.shortCode}`
    : `${window.location.origin.replace("5173", "5000")}/${result.shortCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast("Copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast("Failed to copy.", "error");
    }
  };

  const downloadQr = () => {
    setQrDownloading(true);
    const link = document.createElement("a");
    link.href = result.qrCode;
    link.download = `qr-${result.shortCode}.png`;
    link.click();
    setTimeout(() => setQrDownloading(false), 1000);
    toast("QR Code downloaded!", "success");
  };

  const cardStyle = {
    background: "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, var(--bg-card) 60%)",
    border: "1px solid var(--border-hover)",
    borderRadius: "var(--radius-lg)",
    padding: "28px",
    animation: "resultAppear 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    marginTop: "24px",
  };

  return (
    <>
      <div style={cardStyle}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "var(--accent-glow)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(99,102,241,0.3)",
            }}>✓</div>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem" }}>Link Created!</p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                Created {new Date(result.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                {result.expiresAt && ` · Expires ${new Date(result.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
              </p>
            </div>
          </div>
          <Link
            to={`/analytics/${result.shortCode}`}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--accent-light)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "8px",
              border: "1px solid rgba(99,102,241,0.3)",
              background: "rgba(99,102,241,0.08)",
              transition: "all 0.2s",
            }}
          >
            📊 Analytics
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "28px", alignItems: "start" }}>
          {/* Left: URL info */}
          <div>
            {/* Short URL row */}
            <div style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "16px 20px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Short URL</p>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--accent-light)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    textDecoration: "none",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {shortUrl}
                </a>
              </div>
              <button
                onClick={copyToClipboard}
                className="btn"
                style={{
                  padding: "10px 18px",
                  borderRadius: "8px",
                  background: copied ? "rgba(16,185,129,0.15)" : "var(--accent-glow)",
                  border: `1px solid ${copied ? "rgba(16,185,129,0.4)" : "rgba(99,102,241,0.4)"}`,
                  color: copied ? "var(--success)" : "var(--accent-light)",
                  flexShrink: 0,
                  fontSize: "0.82rem",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {copied ? "✓ Copied" : "⎘ Copy"}
              </button>
            </div>

            {/* Original URL */}
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Original URL</p>
              <p style={{ color: "var(--text-subtle)", fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {result.originalUrl}
              </p>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{
                padding: "10px 16px",
                background: "var(--bg-elevated)",
                borderRadius: "10px",
                border: "1px solid var(--border)",
              }}>
                <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "2px" }}>CLICKS</p>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem" }}>{result.clicks}</p>
              </div>
              <div style={{
                padding: "10px 16px",
                background: "var(--bg-elevated)",
                borderRadius: "10px",
                border: "1px solid var(--border)",
              }}>
                <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "2px" }}>CODE</p>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "var(--accent-light)" }}>/{result.shortCode}</p>
              </div>
              {result.expiresAt && (
                <div style={{
                  padding: "10px 16px",
                  background: "rgba(245,158,11,0.05)",
                  borderRadius: "10px",
                  border: "1px solid rgba(245,158,11,0.2)",
                }}>
                  <p style={{ fontSize: "0.7rem", color: "var(--warning)", marginBottom: "2px" }}>EXPIRES</p>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem", color: "var(--warning)" }}>
                    {new Date(result.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: QR Code */}
          {result.qrCode && (
            <div style={{ textAlign: "center" }}>
              <div style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "12px",
                marginBottom: "10px",
                display: "inline-block",
              }}>
                <img
                  src={result.qrCode}
                  alt="QR Code"
                  style={{ width: "130px", height: "130px", display: "block" }}
                />
              </div>
              <button
                onClick={downloadQr}
                className="btn btn-outline btn-sm"
                style={{ width: "100%", justifyContent: "center" }}
              >
                {qrDownloading ? "⬇ Saving..." : "⬇ Download QR"}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes resultAppear {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
