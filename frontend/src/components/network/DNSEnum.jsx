import { useState } from "react";

function DNSEnum({ startScan, updateScan, finishScan }) {
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const backend = "http://127.0.0.1:8000";

  const runDNS = async () => {
    if (!domain.trim()) return;
    setResults(null);
    setLoading(true);
    startScan("Running DNS Enumeration...");
    updateScan(10);

    try {
      updateScan(30);
      const res = await fetch(`${backend}/network/dns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domain.trim() }),
      });
      updateScan(75);
      const data = await res.json();
      setResults(data);
      updateScan(100);
      finishScan("DNS Enumeration Complete");
    } catch (err) {
      console.error(err);
      finishScan("DNS Enumeration Failed");
    } finally {
      setLoading(false);
    }
  };

  const recordTypeColor = (type) => {
    const map = {
      A: "#38bdf8", AAAA: "#818cf8", MX: "#facc15",
      TXT: "#a3e635", CNAME: "#f97316", NS: "#e879f9",
    };
    return map[type] || "#e2e8f0";
  };

  return (
    <div>
      <h2 style={{ marginBottom: 10 }}>DNS Enumeration</h2>
      <p style={{ color: "#94a3b8", marginBottom: 16 }}>
        Query A, AAAA, MX, TXT, CNAME, NS records and attempt zone transfers.
      </p>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 6 }}>Domain</label>
        <input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runDNS()}
          placeholder="example.com"
          style={inputStyle}
        />
      </div>

      <button onClick={runDNS} disabled={loading} style={btnStyle(loading)}>
        {loading ? "Enumerating..." : "Run DNS Enumeration"}
      </button>

      {results && (
        <div style={{ marginTop: 20 }}>
          <h3 style={{ color: "#38bdf8", marginBottom: 10 }}>DNS Records</h3>
          {Object.entries(results.records).map(([type, values]) =>
            values.length > 0 && (
              <div key={type} style={{ marginBottom: 12 }}>
                <span style={{
                  background: "#0f172a",
                  border: `1px solid ${recordTypeColor(type)}`,
                  color: recordTypeColor(type),
                  borderRadius: 4, padding: "2px 8px",
                  fontSize: 12, fontWeight: 700, fontFamily: "monospace",
                }}>{type}</span>
                {values.map((v, i) => (
                  <div key={i} style={recordRow}>{v}</div>
                ))}
              </div>
            )
          )}
          {Object.values(results.records).every(v => v.length === 0) && (
            <p style={{ color: "#f97316" }}>No records found.</p>
          )}

          <h3 style={{ color: "#38bdf8", marginTop: 20, marginBottom: 8 }}>Zone Transfer</h3>
          <div style={cardStyle}>
            {results.zone_transfer.success ? (
              <>
                <p style={{ color: "#22c55e", marginBottom: 8 }}>✓ Zone transfer succeeded — domain is misconfigured!</p>
                {results.zone_transfer.records.map((r, i) => (
                  <div key={i} style={recordRow}>{r}</div>
                ))}
              </>
            ) : (
              <p style={{ color: "#64748b" }}>Zone transfer refused (expected for secure domains).</p>
            )}
          </div>

          {results.subdomains?.length > 0 && (
            <>
              <h3 style={{ color: "#38bdf8", marginTop: 20, marginBottom: 8 }}>
                Subdomains via crt.sh ({results.subdomains.length})
              </h3>
              <div style={cardStyle}>
                {results.subdomains.map((s, i) => (
                  <div key={i} style={recordRow}>{s}</div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "8px 10px", borderRadius: 6,
  background: "#020617", border: "1px solid #1e293b", color: "#e2e8f0",
};
const btnStyle = (loading) => ({
  padding: "8px 14px", background: loading ? "#1e293b" : "#38bdf8",
  color: loading ? "#64748b" : "#0f172a", borderRadius: 6,
  border: "none", cursor: loading ? "not-allowed" : "pointer", fontWeight: 600,
});
const cardStyle = {
  background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, padding: "12px 16px",
};
const recordRow = {
  fontFamily: "monospace", fontSize: 13, color: "#e2e8f0",
  padding: "4px 0", borderBottom: "1px solid #1e293b",
};

export default DNSEnum;
