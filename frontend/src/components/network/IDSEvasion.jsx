import { useState } from "react";

const TECHNIQUES = {
  fragment: {
    label: "Packet Fragmentation",
    description: "Splits packets into tiny fragments to bypass signature-based IDS inspection.",
    commands: (target) => [
      { label: "Basic fragmentation", cmd: `nmap -f ${target}` },
      { label: "Double fragmentation (16-byte fragments)", cmd: `nmap -ff ${target}` },
      { label: "Custom MTU (8 bytes)", cmd: `nmap --mtu 8 ${target}` },
      { label: "Fragmented SYN scan with version detection", cmd: `nmap -f -sV -sS ${target}` },
    ],
  },
  decoy: {
    label: "Decoy Scan",
    description: "Floods IDS logs with spoofed source IPs so your real IP is hidden among decoys.",
    commands: (target) => [
      { label: "Decoy with random IPs", cmd: `nmap -D RND:10 ${target}` },
      { label: "Decoy with specific IPs", cmd: `nmap -D 192.168.1.50,192.168.1.51,ME ${target}` },
      { label: "Decoy + SYN scan", cmd: `nmap -D RND:5 -sS ${target}` },
      { label: "Decoy with spoofed source port", cmd: `nmap -D RND:8 --source-port 53 ${target}` },
    ],
  },
  slow: {
    label: "Slow / Low-and-Slow Scan",
    description: "Spreads scan traffic over time to stay below IDS rate-detection thresholds.",
    commands: (target) => [
      { label: "Paranoid timing (1 packet per 5 min)", cmd: `nmap -T0 ${target}` },
      { label: "Sneaky timing (1 packet per 15 sec)", cmd: `nmap -T1 ${target}` },
      { label: "Polite timing (low bandwidth)", cmd: `nmap -T2 ${target}` },
      { label: "Slow scan with randomized ports", cmd: `nmap -T1 --randomize-hosts -r ${target}` },
    ],
  },
  spoof: {
    label: "Source IP Spoofing",
    description: "Sends packets with a forged source IP to mislead IDS attribution.",
    commands: (target) => [
      { label: "Spoof source IP", cmd: `nmap -S 10.0.0.1 -e eth0 ${target}` },
      { label: "Spoof source port (DNS port bypass)", cmd: `nmap --source-port 53 ${target}` },
      { label: "Spoof source port (HTTP bypass)", cmd: `nmap --source-port 80 ${target}` },
      { label: "Spoof MAC address", cmd: `nmap --spoof-mac 0 ${target}` },
    ],
  },
  idle: {
    label: "Idle / Zombie Scan",
    description: "Uses a third-party zombie host so your IP never appears in IDS logs.",
    commands: (target) => [
      { label: "Basic idle scan", cmd: `nmap -sI <zombie_host> ${target}` },
      { label: "Idle scan with port probe", cmd: `nmap -sI <zombie_host>:80 ${target}` },
      { label: "Idle scan specific ports", cmd: `nmap -sI <zombie_host> -p 22,80,443 ${target}` },
    ],
  },
  timing: {
    label: "Timing & Append Manipulation",
    description: "Randomizes scan order and appends junk data to confuse stateful IDS engines.",
    commands: (target) => [
      { label: "Randomize host order", cmd: `nmap --randomize-hosts ${target}` },
      { label: "Append random data to packets", cmd: `nmap --data-length 25 ${target}` },
      { label: "Bad checksum probe", cmd: `nmap --badsum ${target}` },
      { label: "Combined evasion", cmd: `nmap -f -T1 --data-length 16 --randomize-hosts -D RND:5 ${target}` },
    ],
  },
};

function IDSEvasion() {
  const [technique, setTechnique] = useState("fragment");
  const [target, setTarget] = useState("");
  const [copied, setCopied] = useState(null);

  const tech = TECHNIQUES[technique];
  const commands = tech.commands(target || "<target>");

  const copyCmd = (cmd, i) => {
    navigator.clipboard.writeText(cmd);
    setCopied(i);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div>
      <h2 style={{ marginBottom: 10 }}>IDS Evasion</h2>
      <p style={{ color: "#94a3b8", marginBottom: 16 }}>
        Generate nmap evasion commands for bypassing intrusion detection systems.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 13 }}>Target IP / Host</label>
          <input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="192.168.1.1"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 13 }}>Evasion Technique</label>
          <select value={technique} onChange={(e) => setTechnique(e.target.value)} style={inputStyle}>
            {Object.entries(TECHNIQUES).map(([key, t]) => (
              <option key={key} value={key}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={descCard}>
        <span style={{ color: "#38bdf8", fontWeight: 600, fontSize: 13 }}>{tech.label} — </span>
        <span style={{ color: "#94a3b8", fontSize: 13 }}>{tech.description}</span>
      </div>

      <h3 style={{ color: "#38bdf8", marginBottom: 10 }}>Generated Commands</h3>
      {commands.map((c, i) => (
        <div key={i} style={cmdCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ color: "#64748b", fontSize: 12 }}>{c.label}</span>
            <button onClick={() => copyCmd(c.cmd, i)} style={{
              background: copied === i ? "#22c55e" : "#1e293b",
              color: copied === i ? "#0f172a" : "#94a3b8",
              border: "none", borderRadius: 4, padding: "3px 10px",
              fontSize: 11, cursor: "pointer", transition: "0.2s",
            }}>
              {copied === i ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre style={{ margin: 0, fontFamily: "monospace", fontSize: 13, color: "#e2e8f0", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            {c.cmd}
          </pre>
        </div>
      ))}
      <p style={{ color: "#475569", fontSize: 12, marginTop: 16 }}>
        ⚠ For authorized penetration testing only. Requires nmap installed on your system.
      </p>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "8px 10px", borderRadius: 6,
  background: "#020617", border: "1px solid #1e293b",
  color: "#e2e8f0", boxSizing: "border-box",
};
const descCard = {
  background: "#0f172a", border: "1px solid #1e293b",
  borderRadius: 8, padding: "10px 14px", marginBottom: 20,
};
const cmdCard = {
  background: "#0a0f1a", border: "1px solid #1e293b",
  borderRadius: 8, padding: "12px 14px", marginBottom: 10,
};

export default IDSEvasion;
