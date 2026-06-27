import Panel from "../Panel.jsx";

const CREATOR = {
  initials: "TR",
  name:     "The-R34per",   
  handle:   "@The-R34per", 
  bio:      "Builder, breaker, and OwlSec community member. SpectralStrike started as a competition project and grew into something I genuinely believe in — a real on-ramp for people who want to get into offensive security without getting lost.",
  github:   "https://github.com/The-R34per",
  discord:  "https://discord.gg/GfVbm376XN",
};

const STATS = [
  { number: "1",   label: "Competition" },
  { number: "∞",   label: "Scope creep" },
  { number: "0",   label: "Prerequisites needed" },
];

function AboutPage({ setActivePage }) {
  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <button onClick={() => setActivePage("learn")} style={backStyle}>
        ← Back
      </button>

      <h1 style={titleStyle}>About the Creator</h1>
      <p style={subtitleStyle}>The person behind SpectralStrike.</p>

      {/* Creator card */}
      <Panel>
        <div style={creatorHeader}>
          <div style={avatar}>{CREATOR.initials}</div>
          <div>
            <div style={creatorName}>{CREATOR.name}</div>
            <div style={creatorHandle}>{CREATOR.handle}</div>
          </div>
        </div>
        <p style={bodyStyle}>{CREATOR.bio}</p>

        {/* Links */}
        {(CREATOR.github || CREATOR.discord) && (
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            {CREATOR.github && (
              <a href={CREATOR.github} target="_blank" rel="noopener noreferrer" style={linkBtn}>
                GitHub ↗
              </a>
            )}
            {CREATOR.discord && (
              <a href={CREATOR.discord} target="_blank" rel="noopener noreferrer" style={{ ...linkBtn, color: "#a78bfa", borderColor: "#a78bfa", background: "rgba(124,58,237,0.08)" }}>
                Discord ↗
              </a>
            )}
          </div>
        )}
      </Panel>

      {/* Stats */}
      <Panel>
        <h3 style={headingStyle}>By the Numbers</h3>
        <div style={statRow}>
          {STATS.map((s) => (
            <div key={s.label} style={statItem}>
              <div style={statNumber}>{s.number}</div>
              <div style={statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Sections */}
      <Panel>
        <h3 style={headingStyle}>The Philosophy</h3>
        <p style={bodyStyle}>
          The goal has always been simple: make the entry point to red teaming less
          brutal. Too many talented people get discouraged before they ever run their
          first scan — not because they can't do it, but because the tools, docs, and
          resources assume you already know everything. SpectralStrike starts from
          zero, on purpose.
        </p>
      </Panel>

      <Panel>
        <h3 style={headingStyle}>The Community</h3>
        <p style={bodyStyle}>
          OwlSec is where this started. It's a community of people who take
          cybersecurity seriously — learning together, competing together, building
          together. SpectralStrike grew out of that culture, and carries that
          spirit forward.
        </p>
        <p style={{ ...bodyStyle, marginBottom: 0 }}>
          If you're part of OwlSec, you already know what this is about. If you're
          not — consider this your introduction to a community worth being part of.
        </p>
      </Panel>
    </div>
  );
}

const backStyle = {
  background: "#1e293b",
  color: "#38bdf8",
  border: "1px solid #38bdf8",
  padding: "8px 16px",
  borderRadius: 6,
  cursor: "pointer",
  marginBottom: 20,
  fontSize: 14,
  fontWeight: 500,
};

const titleStyle = {
  fontSize: 36,
  fontWeight: 700,
  color: "#00ffc6",
  textShadow: "0 0 12px rgba(0,255,198,0.6)",
  marginBottom: 8,
};

const subtitleStyle = {
  color: "#94a3b8",
  fontSize: 16,
  marginBottom: 28,
};

const headingStyle = {
  color: "#e2e8f0",
  marginBottom: 16,
};

const bodyStyle = {
  color: "#94a3b8",
  fontSize: 15,
  lineHeight: 1.75,
  marginBottom: 0,
};

const creatorHeader = {
  display: "flex",
  alignItems: "center",
  gap: 18,
  marginBottom: 18,
};

const avatar = {
  width: 64,
  height: 64,
  borderRadius: "50%",
  background: "#111827",
  border: "2px solid #00ffc6",
  boxShadow: "0 0 16px rgba(0,255,198,0.4), 0 0 32px rgba(124,58,237,0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "'Courier New', monospace",
  fontSize: 20,
  fontWeight: 700,
  color: "#00ffc6",
  flexShrink: 0,
};

const creatorName = {
  fontSize: 20,
  fontWeight: 700,
  color: "#e2e8f0",
};

const creatorHandle = {
  fontFamily: "'Courier New', monospace",
  fontSize: 13,
  color: "#94a3b8",
  marginTop: 3,
};

const linkBtn = {
  fontFamily: "'Courier New', monospace",
  fontSize: 12,
  padding: "7px 14px",
  borderRadius: 6,
  border: "1px solid #00ffc6",
  color: "#00ffc6",
  background: "rgba(0,255,198,0.08)",
  textDecoration: "none",
  cursor: "pointer",
};

const statRow = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
};

const statItem = {
  flex: 1,
  minWidth: 90,
  background: "#0a0f1f",
  border: "1px solid rgba(0,255,198,0.15)",
  borderRadius: 8,
  padding: 16,
  textAlign: "center",
};

const statNumber = {
  fontFamily: "'Courier New', monospace",
  fontSize: 28,
  fontWeight: 700,
  color: "#00ffc6",
  textShadow: "0 0 12px rgba(0,255,198,0.5)",
};

const statLabel = {
  fontSize: 11,
  color: "#94a3b8",
  marginTop: 4,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
};

export default AboutPage;
