import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  const navStyle = {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "rgba(6, 8, 16, 0.85)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid var(--border)",
    padding: "0 32px",
  };

  const innerStyle = {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "64px",
  };

  const logoStyle = {
    fontFamily: "var(--font-display)",
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "var(--text)",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    letterSpacing: "-0.04em",
  };

  const dotStyle = {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "var(--accent)",
    boxShadow: "0 0 8px var(--accent)",
  };

  const navLinks = [
    { to: "/", label: "Shorten" },
    { to: "/history", label: "History" },
  ];

  const linkStyle = (path) => ({
    fontFamily: "var(--font-display)",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: pathname === path ? "var(--accent-light)" : "var(--text-muted)",
    textDecoration: "none",
    padding: "6px 16px",
    borderRadius: "8px",
    background:
      pathname === path ? "rgba(99,102,241,0.1)" : "transparent",
    border:
      pathname === path ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
    transition: "all 0.2s",
  });

  return (
    <nav style={navStyle}>
      <div style={innerStyle}>
        <Link to="/" style={logoStyle}>
          <div style={dotStyle} />
          TrimLink
        </Link>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} style={linkStyle(l.to)}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
