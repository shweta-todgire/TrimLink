import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllUrls, deleteUrl } from "../services/api";
import { useToast } from "../components/Toast";
import { getSessionId } from "../services/session";

function HistoryRow({ url, onDelete, onCopy }) {
  const shortUrl = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/${url.shortCode}`
    : `${window.location.origin.replace("5173", "5000")}/${url.shortCode}`;
  const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date();
  const [showQr, setShowQr] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this short link?")) return;
    setDeleting(true);
    await onDelete(url._id);
  };

  return (
    <div style={{
      background: "var(--bg-card)",
      border: `1px solid ${isExpired ? "rgba(244,63,94,0.2)" : "var(--border)"}`,
      borderRadius: "14px",
      padding: "20px 24px",
      transition: "border-color 0.2s, transform 0.15s",
      opacity: deleting ? 0.5 : 1,
      animation: "rowIn 0.3s ease",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = isExpired ? "rgba(244,63,94,0.4)" : "var(--border-hover)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = isExpired ? "rgba(244,63,94,0.2)" : "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
        {/* Left: URL info */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--accent-light)", textDecoration: "none", letterSpacing: "-0.01em" }}>
              /{url.shortCode}
            </a>
            {isExpired && <span className="badge badge-danger" style={{ fontSize: "0.68rem" }}>Expired</span>}
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "400px" }}>
            {url.originalUrl}
          </p>
          <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              🖱 <strong style={{ color: "var(--text-subtle)" }}>{url.clicks}</strong> clicks
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              📅 {new Date(url.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <button
            onClick={() => onCopy(shortUrl)}
            className="btn btn-ghost"
            style={{ fontSize: "0.78rem", padding: "8px 14px" }}
          >
            ⎘ Copy
          </button>

          <button
            onClick={() => setShowQr(!showQr)}
            className="btn btn-ghost"
            style={{ fontSize: "0.78rem", padding: "8px 14px" }}
          >
            📷 QR
          </button>

          <Link
            to={`/analytics/${url.shortCode}`}
            className="btn btn-ghost"
            style={{ fontSize: "0.78rem", padding: "8px 14px", textDecoration: "none" }}
          >
            📊
          </Link>

          <button
            onClick={handleDelete}
            className="btn btn-danger"
            disabled={deleting}
            style={{ fontSize: "0.78rem", padding: "8px 14px" }}
          >
            {deleting ? "…" : "✕"}
          </button>
        </div>
      </div>

      {/* QR Expand */}
      {showQr && url.qrCode && (
        <div style={{
          marginTop: "16px",
          paddingTop: "16px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          animation: "fadeIn 0.2s ease",
        }}>
          <div style={{ background: "#fff", borderRadius: "8px", padding: "8px", display: "inline-block" }}>
            <img src={url.qrCode} alt="QR" style={{ width: "80px", height: "80px", display: "block" }} />
          </div>
          <div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-subtle)", marginBottom: "10px" }}>QR Code for <strong>{shortUrl}</strong></p>
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = url.qrCode;
                link.download = `qr-${url.shortCode}.png`;
                link.click();
              }}
              className="btn btn-outline btn-sm"
            >
              ⬇ Download PNG
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function History() {
  const toast = useToast();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      const res = await getAllUrls();
      setUrls(res.data || []);
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    try {
      await deleteUrl(id);
      setUrls((prev) => prev.filter((u) => u._id !== id));
      toast("Link deleted.", "success");
    } catch (err) {
      toast(err.message, "error");
    }
  };

  const handleCopy = async (url) => {
    await navigator.clipboard.writeText(url);
    toast("Copied to clipboard!", "success");
  };

  const filtered = urls.filter(
    (u) =>
      u.shortCode.toLowerCase().includes(search.toLowerCase()) ||
      u.originalUrl.toLowerCase().includes(search.toLowerCase())
  );

  const totalClicks = urls.reduce((a, u) => a + u.clicks, 0);
  const sessionId = getSessionId();
  const sessionShort = sessionId.slice(0, 8).toUpperCase();

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px 80px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "6px" }}>
            Your Links
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            {urls.length} link{urls.length !== 1 ? "s" : ""} · {totalClicks} total clicks
          </p>
        </div>
        <Link to="/" className="btn btn-primary" style={{ borderRadius: "10px" }}>
          + New Link
        </Link>
      </div>

      {/* Session info banner */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 18px",
        background: "rgba(99,102,241,0.06)",
        border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: "10px",
        marginBottom: "24px",
        fontSize: "0.82rem",
        color: "var(--text-muted)",
      }}>
        <span style={{
          width: "8px", height: "8px", borderRadius: "50%",
          background: "var(--success)", flexShrink: 0,
          boxShadow: "0 0 6px var(--success)",
        }} />
        <span>
          Showing links for your browser session&nbsp;
          <code style={{
            fontFamily: "monospace",
            background: "var(--bg-elevated)",
            padding: "2px 8px",
            borderRadius: "4px",
            color: "var(--accent-light)",
            fontSize: "0.8rem",
            border: "1px solid var(--border)",
          }}>{sessionShort}…</code>
          &nbsp;— history is saved as long as your browser data isn't cleared.
        </span>
      </div>

      {/* Search */}
      {urls.length > 0 && (
        <div style={{ position: "relative", marginBottom: "24px" }}>
          <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>🔍</span>
          <input
            className="input-field"
            style={{ paddingLeft: "44px" }}
            type="text"
            placeholder="Search by URL or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* List */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[1, 2, 3].map((i) => <div key={i} className="shimmer" style={{ height: "90px" }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "80px 0",
          border: "1px dashed var(--border)",
          borderRadius: "var(--radius-lg)",
        }}>
          <p style={{ fontSize: "2.5rem", marginBottom: "16px" }}>{search ? "🔍" : "🔗"}</p>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: "8px" }}>
            {search ? "No results found" : "No links yet"}
          </h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "24px", fontSize: "0.9rem" }}>
            {search ? "Try a different search term" : "Shorten your first URL to see it here"}
          </p>
          {!search && <Link to="/" className="btn btn-primary">Create a link</Link>}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.map((url) => (
            <HistoryRow
              key={url._id}
              url={url}
              onDelete={handleDelete}
              onCopy={handleCopy}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes rowIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
