import Panel from "../Panel.jsx";

function LearnIDSEvasion({ setActivePage }) {
  return (
    <div>
      <button onClick={() => setActivePage("learn")} style={backStyle}>
        ← Back
      </button>

      <h1 style={titleStyle}>Firewall & IDS Evasion</h1>

      <Panel>
        <h3>What Defenses Are Actually Watching For</h3>
        <p>
          Intrusion Detection Systems generally use two complementary
          approaches: signature-based detection, which flags traffic
          matching known attack patterns, and anomaly-based detection, which
          flags traffic that deviates from a learned baseline of "normal" —
          like an unusual volume of connections in a short time, or
          connections to ports that are never normally touched. Evasion
          techniques are shaped directly around defeating one or both of
          these mechanisms.
        </p>
      </Panel>

      <Panel>
        <h3>Common Evasion Techniques</h3>
        <ul>
          <li><strong>Packet fragmentation:</strong> Splitting a payload across multiple smaller packets so a signature looking for the whole pattern in one packet never matches; the destination's TCP/IP stack reassembles it normally.</li>
          <li><strong>Decoy scans:</strong> Mixing real scan traffic with spoofed-source decoy packets, making it harder for a defender to tell which source IP is the real attacker.</li>
          <li><strong>Slow scans:</strong> Spreading probes out over hours or days instead of minutes, staying under the volume thresholds that trigger anomaly-based alerts.</li>
          <li><strong>Randomized timing and ordering:</strong> Avoiding predictable, sequential port-by-port patterns that are trivially easy to flag.</li>
          <li><strong>Protocol-level ambiguity:</strong> Crafting packets that different systems along the path (firewall vs. end host) interpret differently, causing the IDS to "see" something different from what's actually delivered.</li>
        </ul>
      </Panel>

      <Panel>
        <h3>Why Naive Evasion Often Fails</h3>
        <p>
          Modern security stacks correlate signals across multiple layers —
          network IDS, host-based logging, and behavioral analytics. A scan
          that successfully avoids one detection layer can still get caught
          by another that's watching from a different angle (e.g. unusual
          login attempts even if the scan traffic itself went unnoticed).
          Evasion reduces the chance of detection; it rarely eliminates it
          entirely against a well-instrumented target.
        </p>
      </Panel>

      <Panel>
        <h3>Risks and Ethics</h3>
        <p>
          These techniques are powerful but carry real consequences outside
          a lab. Triggering alerts in a production environment without
          authorization can violate rules of engagement, computer-misuse
          laws, or simply waste a security team's time chasing a false
          alarm. In an authorized lab setting, the value is in understanding
          detection thresholds well enough to help defenders close the gaps.
        </p>
      </Panel>

      <Panel>
        <h3>Attacker Workflow</h3>
        <ol>
          <li>Perform a baseline scan and observe what gets logged or blocked.</li>
          <li>Identify which technique (signature vs. anomaly-based) is catching the traffic.</li>
          <li>Switch to fragmentation, slow timing, or randomization as appropriate.</li>
          <li>Re-test to confirm reduced detection, without assuming total invisibility.</li>
          <li>Use the resulting access to map protected segments more safely.</li>
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

export default LearnIDSEvasion;
