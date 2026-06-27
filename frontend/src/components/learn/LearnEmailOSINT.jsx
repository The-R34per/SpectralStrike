import Panel from "../Panel.jsx";

function LearnEmailOSINT({ setActivePage }) {
  return (
    <div>
      <button onClick={() => setActivePage("learn")} style={backStyle}>
        ← Back
      </button>

      <h1 style={titleStyle}>Email OSINT</h1>

      <Panel>
        <h3>Email as Both Identity and Attack Vector</h3>
        <p>
          An email address is simultaneously a unique identifier and a
          direct channel into someone's inbox. Email OSINT examines both
          sides: how exposed an address already is (breach history) and how
          easily it could be impersonated (domain authentication posture).
        </p>
      </Panel>

      <Panel>
        <h3>Breach Exposure</h3>
        <p>
          Massive numbers of email/password pairs have leaked from past
          data breaches and circulate publicly. Checking whether a target
          email appears in known breach datasets reveals whether that
          person is at elevated risk of password reuse attacks — if they
          used the same password on the breached site and a current
          system, that old leaked password might still work.
        </p>
      </Panel>

      <Panel>
        <h3>MX, SPF, and DMARC Analysis</h3>
        <ul>
          <li><strong>MX records:</strong> Reveal which mail provider handles a domain's email — often a major third party like Google Workspace or Microsoft 365.</li>
          <li><strong>SPF:</strong> A DNS TXT record listing which mail servers are authorized to send email "from" the domain.</li>
          <li><strong>DMARC:</strong> Tells receiving mail servers what to do when a message fails SPF/DKIM checks — none, quarantine, or reject.</li>
        </ul>
        <p>
          A domain with no DMARC policy (or one set to "none") makes it far
          easier to send convincing spoofed email that appears to come from
          that domain, since failing checks aren't being rejected.
        </p>
      </Panel>

      <Panel>
        <h3>Email Format Patterns</h3>
        <p>
          Many organizations use predictable address formats
          (firstname.lastname@, first initial + lastname@). Once this
          pattern is known from one or two confirmed addresses, it can be
          used to accurately guess the email address of anyone else at the
          organization just from their name — turning a single found
          address into an entire target list.
        </p>
      </Panel>

      <Panel>
        <h3>Attacker Workflow</h3>
        <ol>
          <li>Identify the target email and check breach databases for exposure.</li>
          <li>Analyze the domain's MX, SPF, and DMARC records.</li>
          <li>Assess how easily the address or domain could be spoofed.</li>
          <li>Identify the organization's email format pattern from known addresses.</li>
          <li>Use findings to design phishing, spoofing, or impersonation strategies.</li>
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

export default LearnEmailOSINT;
