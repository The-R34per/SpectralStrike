import Panel from "../Panel.jsx";

function LearnPeopleOSINT({ setActivePage }) {
  return (
    <div>
      <button onClick={() => setActivePage("learn")} style={backStyle}>
        ← Back
      </button>

      <h1 style={titleStyle}>People OSINT</h1>

      <Panel>
        <h3>Why People Are the Weakest Link</h3>
        <p>
          Firewalls and patches protect systems; they do nothing to stop a
          convincing phone call or a well-timed email. People OSINT is the
          practice of gathering publicly available information about
          individuals — usernames, roles, routines, relationships — to
          inform social engineering and targeted attacks with a level of
          believable detail that generic attacks lack.
        </p>
      </Panel>

      <Panel>
        <h3>Username Correlation</h3>
        <p>
          People frequently reuse the same handle across many platforms out
          of habit. Starting from a single known username, correlation
          techniques search dozens of platforms at once to surface:
        </p>
        <ul>
          <li>Developer profiles (GitHub, GitLab) — often revealing employer, tech stack, and even commit history with personal email addresses.</li>
          <li>Social media accounts (Twitter/X, Instagram, LinkedIn) — revealing relationships, routines, and opinions.</li>
          <li>Forum posts and Q&A sites (Stack Overflow, Reddit) — revealing technical struggles that hint at internal tools and systems.</li>
        </ul>
      </Panel>

      <Panel>
        <h3>Behavioral Profiling</h3>
        <p>
          Beyond just finding accounts, the content of public posts builds a
          behavioral picture: working hours (from post timestamps), specific
          technologies used (from complaints or questions), even internal
          tool or project names mentioned in passing. This kind of detail is
          exactly what makes a phishing pretext feel real instead of
          generic.
        </p>
      </Panel>

      <Panel>
        <h3>Organizational Mapping</h3>
        <p>
          LinkedIn and company "About" or "Team" pages reveal organizational
          structure — who reports to whom, who handles finance, who has
          admin access. Combined with individual profiling, this lets an
          attacker identify exactly who to target for a given goal (e.g.
          targeting finance staff for a wire-transfer pretext, or IT staff
          for credential harvesting).
        </p>
      </Panel>

      <Panel>
        <h3>Attacker Workflow</h3>
        <ol>
          <li>Start from a username, email, or full name.</li>
          <li>Correlate accounts across platforms using shared handles or photos.</li>
          <li>Extract role, employer, and technical context from public posts.</li>
          <li>Map organizational relationships to identify high-value targets.</li>
          <li>Use findings to design targeted, believable social engineering campaigns.</li>
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

export default LearnPeopleOSINT;
