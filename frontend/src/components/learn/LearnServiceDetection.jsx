import Panel from "../Panel.jsx";

function LearnServiceDetection({ setActivePage }) {
  return (
    <div>
      <button onClick={() => setActivePage("learn")} style={backStyle}>
        ← Back
      </button>

      <h1 style={titleStyle}>Service Detection</h1>

      <Panel>
        <h3>From "Open Port" to "Known Software"</h3>
        <p>
          A port scan tells you a door exists. Service detection tells you
          what's behind it — the exact software, version, and sometimes the
          operating system. This is the difference between "port 22 is open"
          and "OpenSSH 7.2p2 on Ubuntu 16.04," which is something you can
          actually act on.
        </p>
      </Panel>

      <Panel>
        <h3>Banner Grabbing</h3>
        <p>
          Many protocols politely introduce themselves the moment you
          connect. Connecting to an SSH port often returns a line like
          <code> SSH-2.0-OpenSSH_7.2p2</code> before you've even
          authenticated. FTP and SMTP servers do the same with a welcome
          banner. This is the simplest form of service detection: just
          connect and read what's sent back. It's also the least reliable —
          banners can be edited, disabled, or faked by a defender who knows
          this trick is common.
        </p>
      </Panel>

      <Panel>
        <h3>Active Probing</h3>
        <p>
          When a service doesn't volunteer a banner, scanners send small,
          protocol-specific probes and compare the response against a
          database of known signatures. For example, sending an HTTP request
          to an unknown port and checking the <code>Server:</code> header, or
          sending a TLS ClientHello and inspecting which cipher suites and
          extensions the server supports — different software stacks respond
          in subtly different, fingerprintable ways even when they try to
          look generic.
        </p>
      </Panel>

      <Panel>
        <h3>OS Fingerprinting</h3>
        <p>
          Beyond individual services, the TCP/IP stack itself has quirks:
          initial TTL values, TCP window sizes, and how a host responds to
          malformed packets differ slightly between Windows, Linux, and BSD
          implementations. Combining several of these signals lets a scanner
          guess the underlying OS even without any service banners at all.
        </p>
      </Panel>

      <Panel>
        <h3>Why It Matters</h3>
        <p>
          A version string is the single most actionable piece of recon data
          you can collect. It lets you search public vulnerability databases
          for known issues, check changelogs for security fixes the target
          might be missing, and decide whether a host is worth deeper
          investigation at all. It is the bridge between "scanning" and
          "vulnerability fingerprinting."
        </p>
      </Panel>

      <Panel>
        <h3>Attacker Workflow</h3>
        <ol>
          <li>Take the list of open ports from a port scan.</li>
          <li>Attempt banner grabs first — cheapest and fastest signal.</li>
          <li>Send active probes for ports that didn't reveal a banner.</li>
          <li>Cross-reference response quirks for OS fingerprinting.</li>
          <li>Record exact service names and version strings for every host.</li>
          <li>Feed results into vulnerability fingerprinting.</li>
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

export default LearnServiceDetection;
