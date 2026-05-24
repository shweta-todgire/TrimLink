import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAnalytics } from "../services/api";
import { useToast } from "../components/Toast";

function BarChart({ data }) {
  const entries = Object.entries(data);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div style={{ marginTop: "8px" }}>
      <div style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "6px",
        height: "120px",
      }}>
        {entries.map(([date, count]) => {
          const pct = (count / max) * 100;
          const label = new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" });
          return (
            <div key={date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%" }}>
              <div style={{
                fontSize: "0.72rem",
                color: count > 0 ? "var(--accent-light)" : "var(--text-muted)",
                fontWeight: 700,
                fontFamily: "var(--font-display)",
              }}>{count || ""}</div>
              <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                <div style={{
                  width: "100%",
                  height: pct > 0 ? `${Math.max(pct, 8)}%` : "4px",
                  background: count > 0
                    ? "linear-gradient(180deg, var(--accent-light), var(--accent))"
                    : "var(--bg-elevated)",
                  borderRadius: "4px 4px 0 0",
                  transition: "height 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: count > 0 ? "0 -4px 12px var(--accent-glow)" : "none",
                  border: "1px solid",
                  borderColor: count > 0 ? "rgba(99,102,241,0.4)" : "var(--border)",
                  borderBottom: "none",
                }} />
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 500 }}>{label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Analytics() {
  const { code } = useParams();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAnalytics(code);
        setData(res.data);
      } catch (err) {
        toast(err.message, "error");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [code]);

  const copy = async () => {
    if (!data) return;
    const shortUrl = import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/${data.shortCode}`
      : `${window.location.origin.replace("5173", "5000")}/${data.shortCode}`;
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    toast("Copied!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ maxWidth: "800px", margin: "60px auto", padding: "0 24px" }}>
        <div className="shimmer" style={{ height: "200px", marginBottom: "20px" }} />
        <div className="shimmer" style={{ height: "160px" }} />
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ maxWidth: "800px", margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
        <p style={{ fontSize: "3rem", marginBottom: "16px" }}>🔍</p>
        <h2 style={{ fontFamily: "var(--font-display)", marginBottom: "8px" }}>URL not found</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>This short link doesn't exist or was deleted.</p>
        <Link to="/" className="btn btn-primary">← Back to Home</Link>
      </div>
    );
  }

  const shortUrl = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/${data.shortCode}`
    : `${window.location.origin.replace("5173", "5000")}/${data.shortCode}`;
  const isExpired = data.expiresAt && new Date(data.expiresAt) < new Date();
  const totalWeekClicks = data.clicksByDay
    ? Object.values(data.clicksByDay).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px 80px" }}>
      {/* Back */}
      <Link to="/" style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        color: "var(--text-muted)",
        textDecoration: "none",
        fontSize: "0.875rem",
        marginBottom: "32px",
        fontWeight: 500,
        transition: "color 0.2s",
      }}>
        ← Back to Shortener
      </Link>

      <h1 style={{
        fontFamily: "var(--font-display)",
        fontSize: "1.8rem",
        fontWeight: 800,
        letterSpacing: "-0.03em",
        marginBottom: "28px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}>
        📊 Analytics
        {isExpired && <span className="badge badge-danger">Expired</span>}
        {!isExpired && <span className="badge badge-success">Active</span>}
      </h1>

      {/* Main card */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "24px", alignItems: "start" }}>
          <div>
            {/* Short URL */}
            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: "6px" }}>Short URL</p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <a href={shortUrl} target="_blank" rel="noopener noreferrer"
                  style={{ color: "var(--accent-light)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", textDecoration: "none", letterSpacing: "-0.02em" }}>
                  {shortUrl}
                </a>
                <button onClick={copy} className="btn btn-sm"
                  style={{
                    background: copied ? "rgba(16,185,129,0.15)" : "var(--accent-glow)",
                    border: `1px solid ${copied ? "rgba(16,185,129,0.4)" : "rgba(99,102,241,0.4)"}`,
                    color: copied ? "var(--success)" : "var(--accent-light)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                  }}>
                  {copied ? "✓" : "⎘ Copy"}
                </button>
              </div>
            </div>

            {/* Original */}
            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: "6px" }}>Original URL</p>
              <a href={data.originalUrl} target="_blank" rel="noopener noreferrer"
                style={{ color: "var(--text-subtle)", fontSize: "0.9rem", textDecoration: "none", wordBreak: "break-all" }}>
                {data.originalUrl}
              </a>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {[
                { label: "Total Clicks", value: data.clicks, color: "var(--accent-light)" },
                { label: "This Week", value: totalWeekClicks, color: "var(--accent-2)" },
                { label: "Created", value: new Date(data.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), color: "var(--text)" },
                ...(data.expiresAt ? [{ label: "Expires", value: new Date(data.expiresAt).toLocaleDateString(), color: isExpired ? "var(--danger)" : "var(--warning)" }] : []),
              ].map((stat) => (
                <div key={stat.label} style={{
                  padding: "12px 18px",
                  background: "var(--bg-elevated)",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                }}>
                  <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{stat.label}</p>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* QR */}
          {data.qrCode && (
            <div style={{ textAlign: "center" }}>
              <div style={{ background: "#fff", borderRadius: "10px", padding: "10px", display: "inline-block", marginBottom: "10px" }}>
                <img src={data.qrCode} alt="QR" style={{ width: "110px", height: "110px", display: "block" }} />
              </div>
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = data.qrCode;
                  link.download = `qr-${data.shortCode}.png`;
                  link.click();
                  toast("QR downloaded!", "success");
                }}
                className="btn btn-outline btn-sm"
                style={{ width: "100%", justifyContent: "center" }}
              >
                ⬇ QR
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      {data.clicksByDay && (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem" }}>
              Clicks — Last 7 Days
            </h3>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{totalWeekClicks} total</span>
          </div>
          {totalWeekClicks === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
              No clicks in the last 7 days yet.
            </div>
          ) : (
            <BarChart data={data.clicksByDay} />
          )}
        </div>
      )}
    </div>
  );
}
