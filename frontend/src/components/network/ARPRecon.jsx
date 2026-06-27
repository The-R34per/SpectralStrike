import { useState } from "react";

function ARPRecon({ startScan, updateScan, finishScan }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const backend = "http://127.0.0.1:8000";

  const runARP = async () => {
    setResults(null);
    setLoading(true);
    startScan("Running ARP Recon...");
    updateScan(20);

    try {
      updateScan(50);
      const res = await fetch(`${backend}/network/arp`, { method: "POST" });
      updateScan(85);
      const data = await res.json();
      setResults(data);
      finishScan("ARP Recon Complete");
    } catch (err) {
      console.error(err);
      finishScan("ARP Recon Failed");
    } finally {
      setLoading(false);
    }
  };

  const typeColor = (type) => {
    if (!type) return "#64748b";
    if (type.toLowerCase().includes("dynamic")) return "#22c55e";
    if (type.toLowerCase().includes("static")) return "#38bdf8";
    return "#94a3b8";
  };

  return (
    <div>
      <h2 style={{ marginBottom: 10 }}>ARP Recon</h2>
      <p style={{ color: "#94a3b8", marginBottom: 16 }}>
        Read the system ARP cache to discover hosts on the local network.
      </p>

      <button onClick={runARP} disabled={loading} style={btnStyle(loading)}>
        {loading ? "Scanning..." : "Scan Local Network"}
      </button>

      {results?.error && (
        <p style={{ color: "#f97316", marginTop: 12 }}>⚠ {results.error}</p>
      )}

      {results?.hosts && (
        <div style={{ marginTop: 20 }}>
          <h3 style={{ color: "#38bdf8", marginBottom: 10 }}>
            Hosts Found ({results.hosts.length})
          </h3>
          {results.hosts.length === 0 ? (
            <p style={{ color: "#f97316" }}>No ARP entries found.</p>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr>
                  {["IP Address", "MAC Address", "Type", "Interface"].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.hosts.map((h, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#0a0f1a" : "#0f172a" }}>
                    <td style={tdStyle}>{h.ip}</td>
                    <td style={{ ...tdStyle, fontFamily: "monospace", color: "#38bdf8" }}>{h.mac}</td>
                    <td style={{ ...tdStyle, color: typeColor(h.type) }}>{h.type || "—"}</td>
                    <td style={{ ...tdStyle, color: "#64748b" }}>{h.interface || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {results.raw && (
            <details style={{ marginTop: 16 }}>
              <summary style={{ color: "#64748b", cursor: "pointer", fontSize: 13 }}>Raw Output</summary>
              <pre style={{
                marginTop: 8, padding: 12, background: "#0a0f1a",
                border: "1px solid #1e293b", borderRadius: 6,
                color: "#94a3b8", fontSize: 12, overflowX: "auto",
              }}>{results.raw}</pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

const btnStyle = (loading) => ({
  padding: "8px 14px", background: loading ? "#1e293b" : "#38bdf8",
  color: loading ? "#64748b" : "#0f172a", borderRadius: 6,
  border: "none", cursor: loading ? "not-allowed" : "pointer", fontWeight: 600,
});
const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: 13 };
const thStyle = {
  textAlign: "left", padding: "8px 12px", color: "#64748b",
  borderBottom: "1px solid #1e293b", fontWeight: 600, fontSize: 12,
};
const tdStyle = { padding: "7px 12px", color: "#e2e8f0", borderBottom: "1px solid #0f172a" };

export default ARPRecon;
