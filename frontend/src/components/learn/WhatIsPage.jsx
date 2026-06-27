import Panel from "../Panel.jsx";

const PILLARS = [
  {
    icon: "📖",
    title: "Learn the concept",
    desc: "Understand what a tool does and why it exists before you ever touch it.",
  },
  {
    icon: "🎯",
    title: "See it in action",
    desc: "Watch real-world mechanics play out in context — not just dry theory.",
  },
  {
    icon: "💻",
    title: "Do it yourself",
    desc: "Practice in guided hands-on labs. Safe, contained, and genuinely real.",
  },
  {
    icon: "🔀",
    title: "Your pace, your path",
    desc: "SpectralStrike adapts to what you're curious about and where you want to go.",
  },
];

function WhatIsPage({ setActivePage }) {
  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <button onClick={() => setActivePage("learn")} style={backStyle}>
        ← Back
      </button>

      <h1 style={titleStyle}>What is SpectralStrike?</h1>
      <p style={subtitleStyle}>Hands-on red team training, without the mess.</p>

      <Panel>
        <h3 style={headingStyle}>The Short Version</h3>
        <p style={bodyStyle}>
          SpectralStrike is a learning platform built for cybersecurity and red team
          beginners. Instead of throwing you into overcomplicated tooling from day one,
          it walks you through what security tools do, how they think — and then lets
          you actually use them, in a structured, guided environment.
        </p>
        <p style={{ ...bodyStyle, marginBottom: 0 }}>
          No prerequisites. No overwhelming setup. Just pick a topic and start.
        </p>
      </Panel>

      <Panel>
        <h3 style={headingStyle}>What You Get</h3>
        <div style={pillarGrid}>
          {PILLARS.map((p) => (
            <div key={p.title} style={pillarCard}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{p.icon}</div>
              <div style={pillarTitle}>{p.title}</div>
              <div style={pillarDesc}>{p.desc}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <h3 style={headingStyle}>What It Feels Like</h3>
        <div style={terminalStyle}>
          <div><span style={commentStyle}># no prerequisites. no overwhelming setup. just start.</span></div>
          <div><span style={promptStyle}>spectralstrike@learn:~$ </span><span style={{ color: "#e2e8f0" }}>begin recon module</span></div>
          <div><span style={outputStyle}>→ Loading: What is network scanning?</span></div>
          <div><span style={outputStyle}>→ Loading: How nmap discovers hosts...</span></div>
          <div><span style={successStyle}>→ Ready:   Your first scan target is waiting.</span></div>
          <div><span style={promptStyle}>spectralstrike@learn:~$ </span><span style={{ color: "#00ffc6" }}>█</span></div>
        </div>
      </Panel>

      <Panel>
        <h3 style={headingStyle}>Who It's For</h3>
        <p style={bodyStyle}>
          SpectralStrike is built for people who are new to offensive security and
          want a clean, approachable way in. You don't need a background in IT or
          networking. If you're curious about how attackers think and want to learn
          by doing — this is for you.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
          {["Complete beginners", "CTF starters", "Security students", "Curious minds"].map((tag) => (
            <span key={tag} style={tagStyle}>{tag}</span>
          ))}
        </div>
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
  marginBottom: 12,
};

const pillarGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 16,
};

const pillarCard = {
  background: "#0a0f1f",
  border: "1px solid rgba(0,255,198,0.15)",
  borderRadius: 8,
  padding: 16,
};

const pillarTitle = {
  fontSize: 14,
  fontWeight: 600,
  color: "#e2e8f0",
  marginBottom: 6,
};

const pillarDesc = {
  fontSize: 13,
  color: "#94a3b8",
  lineHeight: 1.55,
};

const terminalStyle = {
  background: "#060a14",
  border: "1px solid rgba(0,255,198,0.2)",
  borderRadius: 8,
  padding: "20px 24px",
  fontFamily: "'Courier New', monospace",
  fontSize: 13,
  lineHeight: 2,
  boxShadow: "inset 0 0 30px rgba(0,0,0,0.4), 0 0 12px rgba(0,255,198,0.15)",
};

const promptStyle  = { color: "#00ffc6" };
const commentStyle = { color: "#4a5568" };
const outputStyle  = { color: "#89b4fa" };
const successStyle = { color: "#10b981" };

const tagStyle = {
  fontFamily: "'Courier New', monospace",
  fontSize: 11,
  padding: "3px 10px",
  borderRadius: 4,
  background: "rgba(0,255,198,0.08)",
  color: "#00ffc6",
  border: "1px solid rgba(0,255,198,0.2)",
};

export default WhatIsPage;
