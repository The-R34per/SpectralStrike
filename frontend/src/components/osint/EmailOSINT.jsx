import { useState } from "react";

function EmailOSINT({ startScan, updateScan, finishScan }) {
  const [email, setEmail] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const backend = "http://127.0.0.1:8000";

  const runEmailOSINT = async () => {
    if (!email.trim()) return;

    setResults(null);
    setLoading(true);
    startScan("Running Email OSINT...");
    updateScan(10);

    try {
      updateScan(30);

      // using emailrep.io
      const repRes = await fetch(`${backend}/osint/email/rep?email=${encodeURIComponent(email)}`);

      updateScan(55);

      let repData = null;
      if (repRes.ok) {
        repData = await repRes.json();
      }

      const domain = email.split("@")[1] || "";
      let dnsData = { mx: [], spf: null, dmarc: null };

      if (domain) {
        try {
          const dnsRes = await fetch(`${backend}/osint/email/dns`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ domain }),
          });
          if (dnsRes.ok) {
            dnsData = await dnsRes.json();
          }
        } catch {
        }
      }

      updateScan(85);

      setResults({ rep: repData, dns: dnsData, domain });
      finishScan("Email OSINT Complete");

    } catch (err) {
      console.error("Email OSINT error:", err);
      finishScan("Email OSINT Failed");
    } finally {
      setLoading(false);
    }
  };

  const rep = results?.rep;
  const dns = results?.dns;

  const riskColor = (suspicious) => suspicious ? "#f97316" : "#22c55e";

  return (
    <div>
      <h2 style={{ marginBottom: 10 }}>Email OSINT</h2>
      <p style={{ marginBottom: 16, color: "#94a3b8" }}>
        Check breach exposure, reputation, and email security posture.
      </p>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 6 }}>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runEmailOSINT()}
          placeholder="user@example.com"
          style={{
            width: "100%",
            padding: "8px 10px",
            borderRadius: 6,
            border: "1px solid #1e293b",
            background: "#020617",
            color: "#e2e8f0",
          }}
        />
      </div>

      <button
        onClick={runEmailOSINT}
        disabled={loading}
        style={{
          padding: "8px 14px",
          background: loading ? "#1e293b" : "#38bdf8",
          color: loading ? "#64748b" : "#0f172a",
          borderRadius: 6,
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: 600,
          marginBottom: 16,
        }}
      >
        {loading ? "Scanning..." : "Run Email OSINT"}
      </button>

      {results && (
        <div style={{ marginTop: 10 }}>

          {/* Reputation */}
          {rep && (
            <>
              <h3 style={{ marginBottom: 8, color: "#38bdf8" }}>Reputation</h3>
              <div style={cardStyle}>
                <Row label="Email" value={rep.email} />
                <Row label="Reputation" value={rep.reputation} valueColor={
                  rep.reputation === "high" ? "#22c55e" :
                  rep.reputation === "medium" ? "#facc15" : "#f97316"
                } />
                <Row label="Suspicious" value={rep.suspicious ? "YES" : "NO"} valueColor={riskColor(rep.suspicious)} />
                <Row label="Blacklisted" value={rep.details?.blacklisted ? "YES" : "NO"} valueColor={riskColor(rep.details?.blacklisted)} />
                <Row label="Malicious Activity" value={rep.details?.malicious_activity ? "YES" : "NO"} valueColor={riskColor(rep.details?.malicious_activity)} />
                <Row label="Spam" value={rep.details?.spam ? "YES" : "NO"} valueColor={riskColor(rep.details?.spam)} />
                <Row label="Disposable" value={rep.details?.disposable ? "YES" : "NO"} valueColor={riskColor(rep.details?.disposable)} />
                <Row label="Free Provider" value={rep.details?.free_provider ? "YES" : "NO"} />
                <Row label="Deliverable" value={rep.details?.deliverable ? "YES" : "NO"} valueColor={rep.details?.deliverable ? "#22c55e" : "#f97316"} />
                {rep.details?.credentials_leaked !== undefined && (
                  <Row label="Credentials Leaked" value={rep.details.credentials_leaked ? "YES" : "NO"} valueColor={riskColor(rep.details.credentials_leaked)} />
                )}
                {rep.details?.data_breach !== undefined && (
                  <Row label="In Data Breach" value={rep.details.data_breach ? "YES" : "NO"} valueColor={riskColor(rep.details.data_breach)} />
                )}
                {rep.details?.last_seen && (
                  <Row label="Last Seen" value={rep.details.last_seen} />
                )}
              </div>
            </>
          )}

          {!rep && (
            <p style={{ color: "#f97316", marginBottom: 12 }}>
              Could not reach emailrep.io — rate limited or network issue.
            </p>
          )}

          {/* DNS */}
          <h3 style={{ marginBottom: 8, marginTop: 16, color: "#38bdf8" }}>
            DNS Records — {results.domain}
          </h3>
          <div style={cardStyle}>
            <Row
              label="MX Records"
              value={dns?.mx?.length ? dns.mx.join(", ") : "None found"}
              valueColor={dns?.mx?.length ? "#e2e8f0" : "#f97316"}
            />
            <Row
              label="SPF"
              value={dns?.spf || "Not configured"}
              valueColor={dns?.spf ? "#22c55e" : "#f97316"}
            />
            <Row
              label="DMARC"
              value={dns?.dmarc || "Not configured"}
              valueColor={dns?.dmarc ? "#22c55e" : "#f97316"}
            />
          </div>

          {!dns?.spf && (
            <p style={{ color: "#f97316", fontSize: 13, marginTop: 6 }}>
              No SPF record — domain may be spoofable
            </p>
          )}
          {!dns?.dmarc && (
            <p style={{ color: "#f97316", fontSize: 13, marginTop: 4 }}>
              No DMARC record — no email authentication policy
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, value, valueColor }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 14 }}>
      <span style={{ color: "#94a3b8" }}>{label}</span>
      <span style={{ color: valueColor || "#e2e8f0", fontFamily: "monospace" }}>{value ?? "—"}</span>
    </div>
  );
}

const cardStyle = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: 8,
  padding: "12px 16px",
};

export default EmailOSINT;
