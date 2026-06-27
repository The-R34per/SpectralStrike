import Panel from "../Panel.jsx";

const TRACKS = [
  {
    accent: "#89b4fa",
    icon: "📡",
    name: "Reconnaissance",
    detail: "Passive and active information gathering. Know your target before you touch it.",
    tools: ["nmap", "whois", "shodan", "theHarvester"],
  },
  {
    accent: "#f38ba8",
    icon: "⚡",
    name: "Exploitation",
    detail: "Understand vulnerabilities and how they're leveraged — ethically and hands-on.",
    tools: ["metasploit", "burp suite", "sqlmap"],
  },
  {
    accent: "#00ffc6",
    icon: "🔀",
    name: "Pivoting",
    detail: "Move laterally through networks once you have a foothold. Core red team fundamentals.",
    tools: ["proxychains", "ssh tunnels", "chisel"],
  },
  {
    accent: "#fab387",
    icon: "👁",
    name: "Stealth & Evasion",
    detail: "Operate without triggering defenses. Learn how defenders think so you can think ahead.",
    tools: ["obfuscation", "timing attacks", "AV bypass"],
  },
];

const FLOW = [
  { num: "01", label: "Concept" },
  { num: "02", label: "Demonstration" },
  { num: "03", label: "Hands-on lab" },
  { num: "04", label: "Next skill" },
];

function HowItWorksPage({ setActivePage }) {
  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <button onClick={() => setActivePage("learn")} style={backStyle}>
        ← Back
      </button>

      <h1 style={titleStyle}>How SpectralStrike Works</h1>
      <p style={subtitleStyle}>Learn it. See it. Then do it.</p>

      <Panel>
        <h3 style={headingStyle}>The Learning Loop</h3>
        <p style={bodyStyle}>
          Every topic in SpectralStrike follows the same loop — you understand
          the concept first, see it applied in a real context, then run through
          a guided lab where you actually do it. No skipping ahead to the terminal
          before you know what you're running.
        </p>
        <div style={flowRow}>
          {FLOW.map((step, i) => (
            <div key={step.num} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={flowStep}>
                <span style={flowNum}>{step.num}</span>
                <span style={{ color: "#e2e8f0", fontSize: 13 }}>{step.label}</span>
              </div>
              {i < FLOW.length - 1 && (
                <span style={flowArrow}>→</span>
              )}
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <h3 style={headingStyle}>Skill Tracks</h3>
        <p style={bodyStyle}>
          SpectralStrike covers a range of red team skills — organized into tracks
          you can explore in any order. The depth adapts to what you're curious about.
        </p>
        <div style={trackGrid}>
          {TRACKS.map((track) => (
            <div key={track.name} style={{ ...trackCard, borderTop: `2px solid ${track.accent}` }}>
              <div style={{ fontSize: 22, marginBottom: 10 }}>{track.icon}</div>
              <div style={trackName}>{track.name}</div>
              <p style={trackDetail}>{track.detail}</p>
              <div style={tagRow}>
                {track.tools.map((t) => (
                  <span key={t} style={{ ...tagStyle, color: track.accent, borderColor: `${track.accent}44`, background: `${track.accent}11` }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <h3 style={headingStyle}>Your Path, Your Pace</h3>
        <p style={{ ...bodyStyle, marginBottom: 0 }}>
          SpectralStrike doesn't force a linear path. Jump into whatever track interests
          you most, go deep on one skill, or follow the recommended order for a
          structured foundation. The platform adapts to how you learn, not the other
          way around.
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
  marginBottom: 20,
};

/* Flow */
const flowRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  alignItems: "center",
  marginTop: 4,
};

const flowStep = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "9px 14px",
  borderRadius: 6,
  background: "#0a0f1f",
  border: "1px solid rgba(0,255,198,0.15)",
};

const flowNum = {
  fontFamily: "'Courier New', monospace",
  fontSize: 11,
  color: "#00ffc6",
  fontWeight: 700,
};

const flowArrow = {
  color: "rgba(0,255,198,0.3)",
  fontSize: 14,
  flexShrink: 0,
};

const trackGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 14,
};

const trackCard = {
  background: "#0a0f1f",
  border: "1px solid rgba(0,255,198,0.12)",
  borderRadius: 8,
  padding: 16,
};

const trackName = {
  fontSize: 14,
  fontWeight: 600,
  color: "#e2e8f0",
  marginBottom: 6,
};

const trackDetail = {
  fontSize: 12,
  color: "#94a3b8",
  lineHeight: 1.55,
  marginBottom: 12,
};

const tagRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: 5,
};

const tagStyle = {
  fontFamily: "'Courier New', monospace",
  fontSize: 10,
  padding: "3px 8px",
  borderRadius: 4,
  border: "1px solid",
};

export default HowItWorksPage;
