import Panel from "../Panel.jsx";

function LearnSocialEngineeringOSINT({ setActivePage }) {
  return (
    <div>
      <button onClick={() => setActivePage("learn")} style={backStyle}>
        ← Back
      </button>

      <h1 style={titleStyle}>Social Engineering Recon</h1>

      <Panel>
        <h3>The Human Layer</h3>
        <p>
          Every technical control eventually relies on a human being trusting
          something — a caller, an email, a request from "IT." Social
          engineering recon studies people, processes, and trust
          relationships specifically to design pretexts believable enough
          to bypass those technical controls entirely, by going around them
          rather than through them.
        </p>
      </Panel>

      <Panel>
        <h3>Building Target Profiles</h3>
        <ul>
          <li><strong>Role and responsibilities:</strong> What systems and decisions this person actually has authority over.</li>
          <li><strong>Access level:</strong> What they can approve, reset, or unlock — admin rights, financial approval, building access.</li>
          <li><strong>Communication channels and habits:</strong> Email, Slack, phone — and how formally or informally they typically communicate.</li>
        </ul>
        <p>
          High-value targets typically include IT/helpdesk staff (password
          reset authority), finance staff (payment authority), HR (access to
          personal records), and executives (authority that intimidates
          others into compliance).
        </p>
      </Panel>

      <Panel>
        <h3>Mapping the Attack Surface of Trust</h3>
        <p>
          Combining people OSINT, email OSINT, and metadata extraction
          builds a picture of exactly where trust can be exploited: a
          helpdesk that resets passwords over the phone with minimal
          verification, an internal email culture that's informal and easy
          to mimic, a vendor relationship that gets unusual requests waved
          through without question.
        </p>
      </Panel>

      <Panel>
        <h3>Common Pretext Categories</h3>
        <ul>
          <li><strong>Authority pretexts:</strong> Impersonating an executive or IT admin to create urgency and discourage questioning.</li>
          <li><strong>Familiarity pretexts:</strong> Referencing real internal details (project names, coworkers, recent events) to seem legitimate.</li>
          <li><strong>Urgency/fear pretexts:</strong> Framing a request as time-critical to short-circuit normal verification steps.</li>
        </ul>
      </Panel>

      <Panel>
        <h3>Attacker Workflow</h3>
        <ol>
          <li>Identify key individuals and their organizational roles.</li>
          <li>Gather OSINT on their habits, tools, and communication style.</li>
          <li>Identify weak points in verification processes (helpdesk, vendor handling).</li>
          <li>Design a pretext that aligns with the target's expectations and routine.</li>
          <li>Execute social engineering attempts only within authorized, legal lab boundaries.</li>
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

export default LearnSocialEngineeringOSINT;
