import Panel from "../Panel.jsx";

function LearnSubdomainEnumeration({ setActivePage }) {
  return (
    <div>
      <button onClick={() => setActivePage("learn")} style={backStyle}>
        ← Back
      </button>

      <h1 style={titleStyle}>Subdomain Enumeration</h1>

      <Panel>
        <h3>The Core Idea</h3>
        <p>
          A single domain like <code>example.com</code> usually hides dozens
          of additional hostnames: <code>mail.example.com</code>,{" "}
          <code>dev.example.com</code>, <code>vpn.example.com</code>,{" "}
          <code>staging-api.example.com</code>. Subdomain enumeration is the
          process of discovering all of these, since each one is effectively
          a separate target with its own attack surface.
        </p>
      </Panel>

      <Panel>
        <h3>Active Methods</h3>
        <ul>
          <li><strong>Brute-force:</strong> Trying common subdomain names (www, mail, dev, api, vpn, staging...) and checking which ones resolve via DNS.</li>
          <li><strong>Permutation/mutation:</strong> Combining known subdomains with common prefixes/suffixes (e.g. if <code>api.example.com</code> exists, also try <code>api-dev</code>, <code>api2</code>, <code>old-api</code>).</li>
          <li><strong>Zone walking/transfer attempts:</strong> Where a DNS server is misconfigured, directly requesting the full record list (see DNS Enumeration).</li>
        </ul>
      </Panel>

      <Panel>
        <h3>Passive Methods</h3>
        <ul>
          <li><strong>Certificate Transparency (CT) logs:</strong> Every publicly trusted SSL/TLS certificate is logged publicly, and certificates often list every subdomain they cover — including hostnames never linked anywhere on the web.</li>
          <li><strong>Search engine and archive data:</strong> Cached pages and historical crawls sometimes reference subdomains long after they stopped being linked from the live site.</li>
          <li><strong>Third-party aggregators:</strong> Services that continuously crawl and index DNS data across the internet.</li>
        </ul>
        <p>
          Passive methods are valuable because they generate zero traffic
          to the target — nothing is sent to their servers at all.
        </p>
      </Panel>

      <Panel>
        <h3>Why Subdomains Are High-Value Targets</h3>
        <p>
          Forgotten infrastructure is the recurring theme: a staging server
          spun up for a single test and never decommissioned, an internal
          tool accidentally exposed to the public internet, or a legacy
          system kept alive "just in case." These hosts are statistically far
          less likely to be patched, monitored, or hardened than the main
          production site.
        </p>
      </Panel>

      <Panel>
        <h3>Attacker Workflow</h3>
        <ol>
          <li>Gather subdomains passively first (CT logs, aggregators, search data).</li>
          <li>Run active brute-force and permutation scans to fill in gaps.</li>
          <li>Resolve every candidate to confirm which ones are actually live.</li>
          <li>Pivot each live host into port scanning and service detection.</li>
          <li>Prioritize anything that looks like staging, dev, admin, or internal tooling.</li>
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

export default LearnSubdomainEnumeration;
