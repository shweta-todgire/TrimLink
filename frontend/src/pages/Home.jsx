import { useState } from "react";
import UrlInput from "../components/UrlInput";
import ResultCard from "../components/ResultCard";
import { shortenUrl } from "../services/api";
import { useToast } from "../components/Toast";

const features = [
  { icon: "⚡", label: "Instant shortening" },
  { icon: "📷", label: "Auto QR code" },
  { icon: "📊", label: "Click analytics" },
  { icon: "🔒", label: "Secured with Helmet" },
];

export default function Home() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleShorten = async (url, alias, expiry) => {
    setLoading(true);
    setResult(null);
    try {
      const data = await shortenUrl(url, alias, expiry);
      setResult(data.data);
      toast("Short URL created successfully!", "success");
    } catch (err) {
      toast(err.message || "Failed to shorten URL.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 24px 80px" }}>
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: "52px" }}>
        {/* Glow blob */}
        <div style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "300px",
          background: "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.25)",
            borderRadius: "99px",
            padding: "6px 16px",
            marginBottom: "24px",
            fontSize: "0.8rem",
            color: "var(--accent-light)",
            fontWeight: 600,
            fontFamily: "var(--font-display)",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--success)", display: "inline-block", boxShadow: "0 0 6px var(--success)" }} />
            No login required
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            marginBottom: "16px",
            background: "linear-gradient(135deg, #f1f5f9 0%, var(--accent-light) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Shorten. Share.<br />Track.
          </h1>

          <p style={{
            color: "var(--text-muted)",
            fontSize: "1.05rem",
            maxWidth: "440px",
            margin: "0 auto 32px",
            lineHeight: 1.7,
          }}>
            Transform long URLs into clean, shareable links with instant QR codes and click analytics.
          </p>

          {/* Feature pills */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            {features.map((f) => (
              <div key={f.label} style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: "99px",
                fontSize: "0.8rem",
                color: "var(--text-subtle)",
                fontWeight: 500,
              }}>
                {f.icon} {f.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Input card */}
      <div className="card" style={{
        background: "linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg-card) 100%)",
        boxShadow: "0 0 60px rgba(99,102,241,0.08), var(--shadow)",
      }}>
        <UrlInput onShorten={handleShorten} loading={loading} />
      </div>

      {/* Result */}
      {result && <ResultCard result={result} />}
    </div>
  );
}
