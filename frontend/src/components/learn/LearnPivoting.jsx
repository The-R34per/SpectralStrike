import Panel from "../Panel.jsx";

function LearnPivoting({ setActivePage }) {
  return (
    <div>
      <button onClick={() => setActivePage("learn")} style={backStyle}>
        ← Back
      </button>

      <h1 style={titleStyle}>Pivoting & Lateral Movement</h1>

      <Panel>
        <h3>Turning One Foothold Into Many</h3>
        <p>
          Most valuable targets aren't directly exposed to the internet —
          they sit behind firewalls, on internal-only network segments. A
          single compromised host that happens to have a foot in both
          worlds (internet-facing AND internal) becomes a bridge: traffic
          can be routed through it to reach systems that were never directly
          reachable before.
        </p>
      </Panel>

      <Panel>
        <h3>How Pivoting Mechanically Works</h3>
        <ul>
          <li><strong>SOCKS proxies (often over SSH):</strong> The compromised host runs a proxy that forwards traffic into the internal network, letting tools on the attacker's machine reach internal IPs as if directly connected.</li>
          <li><strong>Port forwarding:</strong> Mapping a specific internal service's port to a port reachable by the attacker, useful when only one or two specific services need to be reached.</li>
          <li><strong>VPN tunnels:</strong> Establishing a full network tunnel from the compromised host outward, giving broader and more flexible internal access than single-port forwarding.</li>
        </ul>
      </Panel>

      <Panel>
        <h3>Lateral Movement Once Inside</h3>
        <p>
          Pivoting gets you into the segment; lateral movement is what
          happens next — using credentials, trust relationships, or
          additional vulnerabilities found on internal hosts to compromise
          more machines. Internal networks are often far more permissive
          than the perimeter, since the assumption (often wrong) is that
          anything already inside is trusted.
        </p>
      </Panel>

      <Panel>
        <h3>High-Value Internal Targets</h3>
        <ul>
          <li><strong>Domain controllers:</strong> Compromise here can mean control over authentication for an entire organization.</li>
          <li><strong>Database servers:</strong> Direct access to sensitive stored data.</li>
          <li><strong>Backup servers:</strong> Often hold copies of everything, sometimes with weaker security than the primary systems they back up.</li>
          <li><strong>Privileged admin workstations:</strong> Frequently have cached credentials or active sessions to other critical systems.</li>
        </ul>
      </Panel>

      <Panel>
        <h3>Why Internal Recon Repeats Itself</h3>
        <p>
          Once pivoted, the same recon techniques used externally apply
          again, just from a new vantage point: ARP scanning to find live
          internal hosts, DNS enumeration against internal nameservers, port
          scanning internal services that were never exposed to the
          internet. Each pivot is effectively a fresh recon cycle on a newly
          reachable network.
        </p>
      </Panel>

      <Panel>
        <h3>Attacker Workflow</h3>
        <ol>
          <li>Compromise an initial host via phishing, an exposed service, or a misconfiguration.</li>
          <li>Establish a pivot channel (SOCKS proxy, port forward, or VPN tunnel).</li>
          <li>Run internal recon (ARP, DNS, port scanning) from the pivot point.</li>
          <li>Identify and target critical internal systems.</li>
          <li>Repeat the process from any newly compromised host to go deeper.</li>
        </ol>
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
  color: "#38bdf8",
  marginBottom: 20,
  fontSize: 28,
  fontWeight: 700,
};

export default LearnPivoting;
