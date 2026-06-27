import Panel from "../Panel.jsx";

function LearnDirectoryBruteforcing({ setActivePage }) {
  return (
    <div>
      <button onClick={() => setActivePage("learn")} style={backStyle}>
        ← Back
      </button>

      <h1 style={titleStyle}>Directory Brute‑Forcing</h1>

      <Panel>
        <h3>The Core Idea</h3>
        <p>
          A website's navigation only shows the pages its developers chose to
          link to. Directory brute-forcing finds everything else by
          systematically requesting thousands of candidate paths
          (<code>/admin</code>, <code>/backup.zip</code>,{" "}
          <code>/.git/</code>, <code>/api/v1/</code>...) from a wordlist and
          recording how the server responds to each one.
        </p>
      </Panel>

      <Panel>
        <h3>Reading Responses Correctly</h3>
        <p>
          A naive approach just checks for HTTP 200. Real servers are messier
          than that:
        </p>
        <ul>
          <li><strong>301/302:</strong> A redirect often means the path exists but requires authentication or a trailing slash.</li>
          <li><strong>403:</strong> Forbidden usually means the path exists but access is blocked — itself a useful signal.</li>
          <li><strong>Soft 404s:</strong> Some sites return a 200 status with a custom "page not found" page for every missing path, which silently breaks naive status-code filtering.</li>
        </ul>
        <p>
          Because of this, careful brute-forcing filters on response size and
          content in addition to status code, to separate genuine hits from
          a wall of identical false positives.
        </p>
      </Panel>

      <Panel>
        <h3>What Gets Found</h3>
        <ul>
          <li>Admin panels and login portals never linked from the public site.</li>
          <li>Backup files (.zip, .bak, .sql, .old) accidentally left behind.</li>
          <li>Exposed version control folders (<code>.git</code>) that can leak entire source trees.</li>
          <li>Configuration or environment files (<code>.env</code>) containing credentials or API keys.</li>
          <li>Undocumented API endpoints and staging/test directories.</li>
        </ul>
      </Panel>

      <Panel>
        <h3>Wordlist Strategy</h3>
        <p>
          Generic wordlists work, but tailoring them to the target's
          technology stack (detected during web recon) dramatically improves
          hit rate — a WordPress site has a predictable set of plugin and
          admin paths, while a custom API has its own naming conventions.
          Combining a generic list with technology-specific lists is far more
          effective than either alone.
        </p>
      </Panel>

      <Panel>
        <h3>Attacker Workflow</h3>
        <ol>
          <li>Identify the target's technology stack via web recon first.</li>
          <li>Choose or build a wordlist matched to that stack.</li>
          <li>Run the brute-force scan, logging status code, size, and redirects.</li>
          <li>Filter out repeated soft-404 noise.</li>
          <li>Manually investigate every genuinely interesting hit.</li>
          <li>Pivot discovered endpoints into vulnerability fingerprinting.</li>
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

export default LearnDirectoryBruteforcing;
