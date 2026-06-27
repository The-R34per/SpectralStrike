import Panel from "../Panel.jsx";

function LearnWiFiRecon({ setActivePage }) {
  return (
    <div>
      <button onClick={() => setActivePage("learn")} style={backStyle}>
        ← Back
      </button>

      <h1 style={titleStyle}>Wi‑Fi Recon & Attacks</h1>

      <Panel>
        <h3>Wireless Extends the Network Past the Walls</h3>
        <p>
          A wired network is physically contained — you need a cable. Wi-Fi
          radiates beyond a building's walls, meaning anyone with a receiver
          in range can passively observe network traffic metadata without
          ever connecting to anything. This makes wireless a fundamentally
          different attack surface from anything on the wired side.
        </p>
      </Panel>

      <Panel>
        <h3>What a Passive Scan Reveals</h3>
        <ul>
          <li><strong>SSID:</strong> The network name, often revealing the organization, branch location, or even department.</li>
          <li><strong>BSSID:</strong> The access point's MAC address, useful for tracking a specific physical device.</li>
          <li><strong>Signal strength (RSSI):</strong> Helps estimate physical proximity and roughly locate the access point.</li>
          <li><strong>Channel and band:</strong> 2.4GHz vs 5GHz, and which channel — useful for targeted monitoring or interference.</li>
          <li><strong>Security type:</strong> Open, WEP, WPA, WPA2, WPA3 — each with very different real-world strength.</li>
        </ul>
      </Panel>

      <Panel>
        <h3>Why Encryption Type Matters So Much</h3>
        <p>
          Open networks transmit everything in plaintext — anyone nearby can
          read traffic directly. WEP is cryptographically broken and can be
          cracked in minutes with widely available tools. WPA2 is
          considered reasonably strong when using a long, random
          pre-shared key, but weak/common passwords can still be brute-forced
          offline once a handshake is captured. WPA3 closes most of WPA2's
          weaknesses by changing how the initial key exchange works,
          resisting offline dictionary attacks even against weaker
          passwords.
        </p>
      </Panel>

      <Panel>
        <h3>Common Attack Patterns</h3>
        <ul>
          <li><strong>Deauthentication attacks:</strong> Forging management frames that tell a client "disconnect now," forcing it to reconnect — often used to capture the handshake exchanged during reconnection.</li>
          <li><strong>Evil twin access points:</strong> Broadcasting a fake AP with the same SSID as a legitimate network, hoping devices or users connect to it instead.</li>
          <li><strong>Captive portal phishing:</strong> Presenting a fake login page after connecting to an evil twin, harvesting credentials directly.</li>
        </ul>
      </Panel>

      <Panel>
        <h3>Why This Matters Beyond Wi‑Fi Itself</h3>
        <p>
          Gaining access to a wireless network is frequently just the
          entry point — once associated, the attacker is now inside the
          local network segment and can pivot directly into ARP recon, port
          scanning, and lateral movement, the same as if they'd plugged into
          an open ethernet jack.
        </p>
      </Panel>

      <Panel>
        <h3>Attacker Workflow</h3>
        <ol>
          <li>Passively scan for nearby networks and catalog SSIDs, BSSIDs, and security types.</li>
          <li>Assess encryption strength and look for open or WEP networks first.</li>
          <li>Capture handshakes from WPA/WPA2 networks for offline analysis (where authorized).</li>
          <li>Consider evil twin / captive portal techniques for credential harvesting (lab only).</li>
          <li>Pivot from wireless access into ARP recon and internal network mapping.</li>
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

export default LearnWiFiRecon;
