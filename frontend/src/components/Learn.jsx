import { useState } from "react";
import Panel from "./Panel.jsx";

function LearnButton({ label, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      style={{
        background: hovered ? "#38bdf8" : "#1e293b",
        color: hovered ? "#0f172a" : "#38bdf8",
        border: "1px solid #38bdf8",
        padding: "14px 20px",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 16,
        fontWeight: 600,
        transition: "background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.15s",
        textAlign: "center",
        boxShadow: hovered ? "0 0 16px rgba(56, 189, 248, 0.5)" : "none",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </button>
  );
}

function Learn({ setActivePage }) {
  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <h1
        style={{
          fontSize: 36,
          marginBottom: 10,
          fontWeight: 700,
          color: "#38bdf8",
          textShadow: "0 0 12px rgba(56, 189, 248, 0.6)",
        }}
      >
        SpectralStrike Academy
      </h1>

      <p style={{ marginBottom: 30, color: "#94a3b8", fontSize: 16 }}>
        Master the fundamentals of offensive security. Choose a topic to begin.
      </p>

      {/* OFFENSIVE SECURITY */}
      <Panel>
        <h3 style={{ marginBottom: 20, color: "#e2e8f0" }}>Offensive Security Concepts</h3>
        <div style={gridStyle}>
          <LearnButton label="Port Scanning"                onClick={() => setActivePage("learn_ports")} />
          <LearnButton label="Service Detection"           onClick={() => setActivePage("learn_services")} />
          <LearnButton label="Vulnerability Fingerprinting" onClick={() => setActivePage("learn_vulns")} />
          <LearnButton label="Directory Brute-Forcing"     onClick={() => setActivePage("learn_dirbust")} />
          <LearnButton label="Subdomain Enumeration"       onClick={() => setActivePage("learn_subdomains")} />
          <LearnButton label="Web Recon"                   onClick={() => setActivePage("learn_webrecon")} />
        </div>
      </Panel>

      {/* NETWORK & INFRASTRUCTURE */}
      <Panel>
        <h3 style={{ marginBottom: 20, color: "#e2e8f0" }}>Network & Infrastructure</h3>
        <div style={gridStyle}>
          <LearnButton label="DNS Enumeration"            onClick={() => setActivePage("learn_dnsenum")} />
          <LearnButton label="ARP Recon"                  onClick={() => setActivePage("learn_arp")} />
          <LearnButton label="Wi-Fi Recon"                onClick={() => setActivePage("learn_wifi")} />
          <LearnButton label="IDS Evasion"                onClick={() => setActivePage("learn_ids")} />
          <LearnButton label="Pivoting & Lateral Movement" onClick={() => setActivePage("learn_pivoting")} />
        </div>
      </Panel>

      {/* OSINT & INTELLIGENCE */}
      <Panel>
        <h3 style={{ marginBottom: 20, color: "#e2e8f0" }}>OSINT & Intelligence</h3>
        <div style={gridStyle}>
          <LearnButton label="People OSINT"            onClick={() => setActivePage("learn_people_osint")} />
          <LearnButton label="Email OSINT"             onClick={() => setActivePage("learn_email_osint")} />
          <LearnButton label="Metadata Extraction"     onClick={() => setActivePage("learn_metadata_osint")} />
          <LearnButton label="Social Engineering Recon" onClick={() => setActivePage("learn_social_osint")} />
        </div>
      </Panel>

      {/* SPECTRALSTRIKE */}
      <Panel>
        <h3 style={{ marginBottom: 20, color: "#e2e8f0" }}>SpectralStrike</h3>
        <div style={gridStyle}>
          <LearnButton label="What is SpectralStrike?" onClick={() => setActivePage("learn_what")} />
          <LearnButton label="Why It Was Built"        onClick={() => setActivePage("learn_why")} />
          <LearnButton label="How It Works"            onClick={() => setActivePage("learn_how")} />
          <LearnButton label="About the Creator"       onClick={() => setActivePage("learn_about")} />
        </div>
      </Panel>
    </div>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
};

export default Learn;
