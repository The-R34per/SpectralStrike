import Panel from "../Panel.jsx";

function LearnARPRecon({ setActivePage }) {
  return (
    <div>
      <button onClick={() => setActivePage("learn")} style={backStyle}>
        ← Back
      </button>

      <h1 style={titleStyle}>ARP & Local Network Recon</h1>

      <Panel>
        <h3>What ARP Actually Does</h3>
        <p>
          IP addresses are logical; on an actual local network, traffic moves
          between MAC (hardware) addresses. The Address Resolution Protocol
          (ARP) is the mechanism that answers "what MAC address corresponds
          to this IP?" When a device wants to talk to 192.168.1.5, it
          broadcasts an ARP request to everyone on the local segment; the
          owner of that IP replies with its MAC address.
        </p>
      </Panel>

      <Panel>
        <h3>Why ARP Is a Recon Goldmine</h3>
        <p>
          Because ARP requests are broadcast to the entire local segment and
          almost never filtered (filtering them would break the network),
          an attacker who is already on the same subnet — via VPN, Wi-Fi, or
          a physical connection — can send ARP requests for every address in
          the range and quickly build a complete list of live hosts and
          their MAC addresses, without ever touching a router or leaving the
          local segment.
        </p>
      </Panel>

      <Panel>
        <h3>What an ARP Sweep Reveals</h3>
        <ul>
          <li><strong>Live hosts:</strong> Any IP that responds is definitely active right now.</li>
          <li><strong>MAC address vendor prefixes (OUI):</strong> The first half of a MAC address identifies the manufacturer, hinting at device type — a known Cisco prefix suggests a router/switch, a known Apple prefix suggests a workstation, and so on.</li>
          <li><strong>Network topology hints:</strong> Gateways typically respond fastest and sit at predictable addresses (like .1).</li>
        </ul>
      </Panel>

      <Panel>
        <h3>ARP Spoofing and the Foundation for MITM</h3>
        <p>
          ARP has no built-in authentication — any device can claim to own
          any IP address. ARP spoofing exploits this by sending forged ARP
          replies that tell a victim "I am the gateway," redirecting their
          traffic through the attacker's machine first. This is the
          technical foundation behind man-in-the-middle attacks, allowing
          traffic inspection or modification before it reaches its real
          destination. It's also one of the easiest local-network attacks to
          detect with proper monitoring, since legitimate gateway MAC
          addresses don't normally change.
        </p>
      </Panel>

      <Panel>
        <h3>Attacker Workflow</h3>
        <ol>
          <li>Gain access to a local network segment (VPN, Wi‑Fi, or physical).</li>
          <li>Run an ARP sweep to enumerate all active hosts and their MACs.</li>
          <li>Use OUI prefixes to guess device roles (server, router, IoT, workstation).</li>
          <li>Identify high-value targets (admin workstations, servers, gateways).</li>
          <li>Pivot into port scanning and service detection on discovered hosts.</li>
          <li>Optionally perform ARP spoofing to enable MITM, where authorized.</li>
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

export default LearnARPRecon;
