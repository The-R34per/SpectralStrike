import Panel from "../Panel.jsx";

function LearnPortScanning({ setActivePage }) {
  return (
    <div>
      <button onClick={() => setActivePage("learn")} style={backStyle}>
        ← Back
      </button>

      <h1 style={titleStyle}>Port Scanning</h1>

      <Panel>
        <h3>The Core Idea</h3>
        <p>
          Every networked service listens on a numbered "port" — a logical
          address on top of an IP address. A web server typically listens on
          80/443, SSH on 22, a database on 3306 or 5432. Port scanning is the
          act of systematically asking a host "is anything listening on port
          X?" across a range of ports, building a map of what's actually
          reachable before anyone tries to interact with it directly.
        </p>
      </Panel>

      <Panel>
        <h3>How a TCP Connect Scan Works</h3>
        <p>
          TCP uses a three-step handshake: SYN → SYN/ACK → ACK. A connect
          scan completes this handshake fully, just like a normal
          application would. If the handshake completes, the port is open.
          If the host replies with a RST (reset), the port is closed. If
          nothing comes back at all, a firewall is likely silently dropping
          the probe — filtered.
        </p>
        <p>
          This is reliable because it uses normal OS networking calls, but
          it's also the loudest option: a completed connection shows up in
          server logs.
        </p>
      </Panel>

      <Panel>
        <h3>The SYN ("Half-Open") Scan</h3>
        <p>
          Instead of completing the handshake, a SYN scan sends only the
          initial SYN packet. If a SYN/ACK comes back, the port is open —
          and the scanner then sends a RST instead of an ACK, tearing the
          connection down before it's ever fully established. Because the
          connection never completes, it often doesn't get logged by the
          application itself (though firewalls and IDS can still see it).
          This is faster and stealthier, which is why it's the default mode
          in most scanning tools — but it typically requires raw socket
          access (admin/root privileges).
        </p>
      </Panel>

      <Panel>
        <h3>UDP Scanning — and Why It's Harder</h3>
        <p>
          UDP has no handshake, so there's no clean open/closed signal. A
          scanner sends a UDP packet and waits: if it gets an ICMP "port
          unreachable" message back, the port is closed. If it gets a UDP
          response, the port is open. If it gets nothing, the port is either
          open and silently ignoring the probe, or filtered — and you often
          can't tell which without service-specific payloads. This is why
          UDP scans are slower and less certain than TCP scans, even though
          critical services (DNS, SNMP, NTP, DHCP) all run on UDP.
        </p>
      </Panel>

      <Panel>
        <h3>Other Probe Types (Firewall Mapping)</h3>
        <ul>
          <li><strong>ACK scan:</strong> Sends a bare ACK with no prior SYN. A stateless firewall (one that doesn't track connections) might let it through and respond with RST regardless of real port state — revealing where filtering does or doesn't happen, rather than revealing open ports directly.</li>
          <li><strong>FIN / Xmas scans:</strong> Send packets with unusual flag combinations that a correctly-implemented stack should silently drop on open ports but RST on closed ones. Useful against simple stateless filters, less useful against modern stateful firewalls.</li>
        </ul>
      </Panel>

      <Panel>
        <h3>Timing and Stealth</h3>
        <p>
          Scanning every port on every host as fast as possible is detectable
          almost instantly — a burst of connections to thousands of ports in
          seconds is a textbook IDS signature. Real-world recon often spreads
          probes out over time, randomizes the order ports are scanned in,
          and limits how many hosts are touched per minute, trading speed for
          a lower chance of triggering an alert.
        </p>
      </Panel>

      <Panel>
        <h3>Attacker Workflow</h3>
        <ol>
          <li>Select a target range (single host, subnet, or domain‑resolved IPs).</li>
          <li>Run a fast scan across the most common ports to get a quick footprint.</li>
          <li>Run a deeper scan (full 1–65535 range, plus UDP) on hosts that look interesting.</li>
          <li>Classify each result as open, closed, or filtered.</li>
          <li>Hand open ports to service detection to identify exactly what's running.</li>
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

export default LearnPortScanning;
