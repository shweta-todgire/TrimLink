import { useState } from "react";

export default function UrlInput({ onShorten, loading }) {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [expiry, setExpiry] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState("");

  const validate = (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!url.trim()) return setError("Please enter a URL.");
    if (!validate(url.trim())) return setError("Please enter a valid URL including http:// or https://");
    onShorten(url.trim(), alias.trim(), expiry);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Main URL input */}
      <div style={{ position: "relative" }}>
        <div style={{
          position: "absolute",
          left: "18px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--text-muted)",
          fontSize: "1.1rem",
          pointerEvents: "none",
        }}>🔗</div>
        <input
          className="input-field"
          style={{
            paddingLeft: "48px",
            paddingRight: "160px",
            fontSize: "1rem",
            height: "60px",
            borderRadius: "14px",
          }}
          type="text"
          placeholder="Paste your long URL here..."
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError(""); }}
          autoFocus
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            padding: "10px 20px",
            borderRadius: "10px",
          }}
        >
          {loading ? (
            <>
              <span style={{ display: "inline-block", animation: "spin 0.8s linear infinite" }}>◌</span>
              Shortening...
            </>
          ) : (
            <>⚡ Shorten</>
          )}
        </button>
      </div>

      {error && (
        <p style={{ color: "var(--danger)", fontSize: "0.85rem", marginTop: "8px", paddingLeft: "4px" }}>
          ⚠ {error}
        </p>
      )}

      {/* Advanced options toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        style={{
          background: "none",
          border: "none",
          color: "var(--text-muted)",
          fontSize: "0.82rem",
          cursor: "pointer",
          marginTop: "12px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontFamily: "var(--font-body)",
          transition: "color 0.2s",
        }}
      >
        <span style={{
          display: "inline-block",
          transition: "transform 0.2s",
          transform: showAdvanced ? "rotate(90deg)" : "rotate(0deg)",
        }}>▶</span>
        Advanced options
      </button>

      {showAdvanced && (
        <div style={{
          marginTop: "16px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          animation: "fadeIn 0.2s ease",
        }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px", fontWeight: 500 }}>
              Custom alias (optional)
            </label>
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                pointerEvents: "none",
              }}>trimlink/</span>
              <input
                className="input-field"
                style={{ paddingLeft: "74px", height: "44px", fontSize: "0.9rem" }}
                type="text"
                placeholder="my-link"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                maxLength={20}
              />
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px", fontWeight: 500 }}>
              Expiry (optional)
            </label>
            <select
              className="input-field"
              style={{ height: "44px", fontSize: "0.9rem", cursor: "pointer" }}
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
            >
              <option value="">Never expires</option>
              <option value="24h">24 hours</option>
              <option value="7d">7 days</option>
              <option value="30d">30 days</option>
            </select>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </form>
  );
}
