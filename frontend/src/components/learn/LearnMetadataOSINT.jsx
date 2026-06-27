import Panel from "../Panel.jsx";

function LearnMetadataOSINT({ setActivePage }) {
  return (
    <div>
      <button onClick={() => setActivePage("learn")} style={backStyle}>
        ← Back
      </button>

      <h1 style={titleStyle}>Metadata Extraction</h1>

      <Panel>
        <h3>Hidden Data Inside Ordinary Files</h3>
        <p>
          Images, documents, and PDFs carry far more than what's visibly
          displayed. Embedded metadata — timestamps, GPS coordinates, device
          information, author names, software versions, revision history —
          rides along invisibly unless someone specifically goes looking
          for it.
        </p>
      </Panel>

      <Panel>
        <h3>EXIF Data in Images</h3>
        <ul>
          <li><strong>Camera/device model and sometimes serial number:</strong> Identifies the exact hardware used.</li>
          <li><strong>Precise timestamp:</strong> Down to the second, often including timezone.</li>
          <li><strong>GPS coordinates:</strong> Many phones embed exact latitude/longitude unless location tagging is disabled.</li>
        </ul>
        <p>
          A single photo posted publicly — by an employee, on a "company
          culture" social post, for example — can reveal a building's exact
          location, the device used, and the time it was taken, even if
          none of that was intended to be shared.
        </p>
      </Panel>

      <Panel>
        <h3>Document Metadata</h3>
        <ul>
          <li><strong>Author and organization fields:</strong> Often the real name of the employee who created the file.</li>
          <li><strong>Software used:</strong> Version of Office, Acrobat, or other creation tools, sometimes useful for further fingerprinting.</li>
          <li><strong>Internal file paths or server names:</strong> Sometimes embedded in "last saved" properties, revealing internal naming conventions or infrastructure.</li>
          <li><strong>Revision history:</strong> Some formats retain traces of previously deleted content.</li>
        </ul>
      </Panel>

      <Panel>
        <h3>Where to Find Source Files</h3>
        <p>
          Publicly posted PDFs (reports, brochures, job postings), images
          shared on social media, and downloadable documents linked from a
          company's own website are all fair game for this kind of analysis
          — none of it requires interacting with the target's
          infrastructure at all.
        </p>
      </Panel>

      <Panel>
        <h3>Attacker Workflow</h3>
        <ol>
          <li>Collect public files (images, PDFs, documents) from websites and social media.</li>
          <li>Extract metadata and check for GPS coordinates, author names, and internal paths.</li>
          <li>Correlate findings with people OSINT to confirm identities.</li>
          <li>Correlate infrastructure hints with DNS/subdomain enumeration.</li>
          <li>Use combined insights to refine physical, social, or technical attack planning.</li>
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

export default LearnMetadataOSINT;
