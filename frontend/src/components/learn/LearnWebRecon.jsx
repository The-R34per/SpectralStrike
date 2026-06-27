import Panel from "../Panel.jsx";

function LearnWebRecon({ setActivePage }) {
  return (
    <div>
      <button onClick={() => setActivePage("learn")} style={backStyle}>
        ← Back
      </button>

      <h1 style={titleStyle}>Web Reconnaissance</h1>

      <Panel>
        <h3>The Core Idea</h3>
        <p>
          Web recon builds a profile of a web application before any active
          testing begins: what it's built with, how it's structured, and
          what it exposes — both intentionally and by accident. It turns "a
          website" into a detailed technical picture.
        </p>
      </Panel>

      <Panel>
        <h3>HTTP Headers Tell a Story</h3>
        <p>
          Response headers often reveal more than developers intend. A{" "}
          <code>Server:</code> header might name the exact web server and
          version. An <code>X-Powered-By</code> header might name the
          backend framework. The presence or absence of headers like{" "}
          <code>Content-Security-Policy</code>, <code>X-Frame-Options</code>,
          and <code>Strict-Transport-Security</code> reveals how seriously
          the site's security posture was designed, not just implemented.
        </p>
      </Panel>

      <Panel>
        <h3>Fingerprinting the Stack</h3>
        <p>
          Beyond headers, the page source itself leaks information: CMS
          systems like WordPress or Drupal leave telltale file paths and meta
          tags, JavaScript frameworks expose themselves through bundle names
          and global variables, and error pages sometimes reveal the exact
          language/framework version when something breaks unexpectedly.
        </p>
      </Panel>

      <Panel>
        <h3>Crawling and Structure Mapping</h3>
        <ul>
          <li><strong>robots.txt:</strong> Meant to tell search engines what not to index — which often unintentionally reveals paths the owner wanted hidden.</li>
          <li><strong>sitemap.xml:</strong> A structured list of pages, sometimes including ones not linked anywhere in the visible navigation.</li>
          <li><strong>Crawling:</strong> Following every link found on every page to build a full map of reachable content.</li>
        </ul>
      </Panel>

      <Panel>
        <h3>Hidden APIs in Client-Side Code</h3>
        <p>
          Modern web apps run a lot of logic in the browser. Reading the
          JavaScript bundles shipped to every visitor frequently reveals API
          endpoints, internal route names, and sometimes even feature flags
          or debug routes — all without sending a single request beyond
          loading the page.
        </p>
      </Panel>

      <Panel>
        <h3>Attacker Workflow</h3>
        <ol>
          <li>Fingerprint the technology stack from headers and page source.</li>
          <li>Pull robots.txt and sitemap.xml for path hints.</li>
          <li>Crawl the site to map every reachable page and link.</li>
          <li>Inspect JavaScript bundles for hidden API endpoints and routes.</li>
          <li>Cross-reference findings with directory brute-forcing and subdomain enumeration.</li>
          <li>Feed identified software/versions into vulnerability fingerprinting.</li>
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

export default LearnWebRecon;
