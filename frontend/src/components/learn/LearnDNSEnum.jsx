import Panel from "../Panel.jsx";

function LearnDNSEnum({ setActivePage }) {
  return (
    <div>
      <button onClick={() => setActivePage("learn")} style={backStyle}>
        ← Back
      </button>

      <h1 style={titleStyle}>DNS Enumeration</h1>

      <Panel>
        <h3>DNS Is the Internet's Phonebook</h3>
        <p>
          DNS translates human-readable names into the technical details
          needed to actually reach a service: IP addresses, mail servers,
          authentication policies. For an attacker, querying DNS is
          completely passive from the target's perspective in most cases —
          you're just asking a third-party nameserver questions, not
          touching the target's own servers.
        </p>
      </Panel>

      <Panel>
        <h3>How a DNS Lookup Actually Works</h3>
        <p>
          When you query a domain, a resolver walks the DNS hierarchy: root
          servers point to the top-level domain (.com, .org) servers, which
          point to the domain's authoritative nameservers, which finally
          return the actual record. Most tools talk to a recursive resolver
          that does this walking for you, but querying the authoritative
          nameserver directly gives the most accurate, uncached answer.
        </p>
      </Panel>

      <Panel>
        <h3>Key Record Types and Their Value</h3>
        <ul>
          <li><strong>A / AAAA:</strong> IPv4/IPv6 address of a host — AAAA records are often less monitored than A records.</li>
          <li><strong>MX:</strong> Mail servers — directly useful for phishing and spoofing targeting.</li>
          <li><strong>TXT:</strong> Free-form text, frequently used for SPF/DMARC policy, domain verification tokens, and sometimes accidentally leaked internal notes.</li>
          <li><strong>NS:</strong> Which nameservers are authoritative — useful for spotting misconfigured or third-party-managed DNS.</li>
          <li><strong>CNAME:</strong> An alias pointing to another hostname — often reveals third-party services in use (CDNs, SaaS platforms).</li>
          <li><strong>SOA:</strong> Zone metadata including the primary nameserver and refresh timers.</li>
        </ul>
      </Panel>

      <Panel>
        <h3>Zone Transfers (AXFR) and Misconfigurations</h3>
        <p>
          A zone transfer is a bulk export of every record in a DNS zone —
          intended only for syncing between an organization's own trusted
          nameservers. When a nameserver is misconfigured to allow AXFR
          requests from anyone, a single query instantly returns the entire
          DNS map of the domain: every subdomain, every internal hostname
          someone forgot was publicly resolvable. It remains one of the
          highest-value misconfigurations in all of recon, precisely because
          it collapses enumeration from "guess and check" to "just ask."
        </p>
      </Panel>

      <Panel>
        <h3>SPF, DKIM, and DMARC at the DNS Level</h3>
        <p>
          Email authentication policy lives in DNS TXT records. SPF lists
          which servers are allowed to send mail for a domain; DKIM
          publishes a public key used to verify message signatures; DMARC
          tells receiving servers what to do when SPF/DKIM checks fail
          (ignore, quarantine, or reject). Weak or missing policies make a
          domain significantly easier to spoof convincingly.
        </p>
      </Panel>

      <Panel>
        <h3>Attacker Workflow</h3>
        <ol>
          <li>Identify target domain(s).</li>
          <li>Query standard records (A, AAAA, MX, TXT, NS, SOA).</li>
          <li>Attempt a zone transfer from each authoritative nameserver.</li>
          <li>Inspect TXT records for SPF/DMARC weaknesses and verification tokens.</li>
          <li>Pivot discovered hosts into port scanning and service detection.</li>
          <li>Correlate findings with subdomain enumeration and OSINT modules.</li>
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

export default LearnDNSEnum;
