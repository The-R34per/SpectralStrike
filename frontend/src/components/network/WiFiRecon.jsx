import { useState } from "react";

function WiFiRecon({ startScan, updateScan, finishScan }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const backend = "http://127.0.0.1:8000";

  const runWiFi = async () => {
    setResults(null);
    setLoading(true);
    startScan("Scanning Wi-Fi Networks...");
    updateScan(20);

    try {
      updateScan(50);
      const res = await fetch(`${backend}/network/wifi`, { method: "POST" });
      updateScan(85);
      const data = await res.json();
      setResults(data);
      finishScan("Wi-Fi Recon Complete");
    } catch (err) {
      console.error(err);
      finishScan("Wi-Fi Recon Failed");
    } finally {
      setLoading(false);
    }
  };

  const signalBar = (signal) => {
    const pct = Math.min(100, Math.max(0, signal));
    const color = pct > 70 ? "#22c55e" : pct > 40 ? "#facc15" : "#f97316";
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 80, height: 6, background: "#1e293b", borderRadius: 3 }}>
          <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3 }} />
        </div>
        <span style={{ color, fontSize: 12 }}>{signal}%</span>
      </div>
    );
  };

  const securityColor = (auth) => {
    if (!auth) return "#64748b";
    const a = auth.toUpperCase();
    if (a.includes("OPEN") || a.includes("NONE")) return "#f97316";
    if (a.includes("WPA3")) return "#22c55e";
    if (a.includes("WPA2")) return "#38bdf8";
    if (a.includes("WPA")) return "#facc15";
    return "#94a3b8";
  };

  return (
    <div>
      <h2 style={{ marginBottom: 10 }}>Wi-Fi Recon</h2>
      <p style={{ color: "#94a3b8", marginBottom: 16 }}>
        Scan for nearby wireless networks using the system wireless adapter.
      </p>

      <button onClick={runWiFi} disabled={loading} style={btnStyle(loading)}>
        {loading ? "Scanning..." : "Scan Wi-Fi Networks"}
      </button>

      {results?.error && (
        <p style={{ color: "#f97316", marginTop: 12 }}>⚠ {results.error}</p>
      )}

      {results?.networks && (
        <div style={{ marginTop: 20 }}>
          <h3 style={{ color: "#38bdf8", marginBottom: 10 }}>
            Networks Found ({results.networks.length})
          </h3>
          {results.networks.length === 0 ? (
            <p style={{ color: "#f97316" }}>No networks detected.</p>
          ) : (
            results.networks.map((n, i) => (
              <div key={i} style={networkCard}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 15 }}>
                    {n.ssid || "<Hidden SSID>"}
                  </span>
                  <span style={{
                    fontSize: 11, padding: "2px 8px", borderRadius: 4,
                    background: "#0a0f1a", color: securityColor(n.authentication),
                    border: `1px solid ${securityColor(n.authentication)}`,
                  }}>
                    {n.authentication || "Unknown"}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 13 }}>
                  <InfoRow label="BSSID" value={n.bssid} mono />
                  <InfoRow label="Signal" value={signalBar(n.signal)} raw />
                  <InfoRow label="Channel" value={n.channel} />
                  <InfoRow label="Band" value={n.band} />
                  <InfoRow label="Encryption" value={n.encryption} />
                  <InfoRow label="Network Type" value={n.networkType} />
                </div>
              </div>
            ))
          )}
          {results.raw && (
            <details style={{ marginTop: 16 }}>
              <summary style={{ color: "#64748b", cursor: "pointer", fontSize: 13 }}>Raw Output</summary>
              <pre style={{
                marginTop: 8, padding: 12, background: "#0a0f1a",
                border: "1px solid #1e293b", borderRadius: 6,
                color: "#94a3b8", fontSize: 11, overflowX: "auto",
              }}>{results.raw}</pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, mono, raw }) {
  return (
    <div>
      <span style={{ color: "#64748b", fontSize: 11, display: "block" }}>{label}</span>
      {raw ? value : (
        <span style={{ color: "#e2e8f0", fontFamily: mono ? "monospace" : "inherit" }}>
          {value || "—"}
        </span>
      )}
    </div>
  );
}

const btnStyle = (loading) => ({
  padding: "8px 14px", background: loading ? "#1e293b" : "#38bdf8",
  color: loading ? "#64748b" : "#0f172a", borderRadius: 6,
  border: "none", cursor: loading ? "not-allowed" : "pointer", fontWeight: 600,
});
const networkCard = {
  background: "#0f172a", border: "1px solid #1e293b",
  borderRadius: 8, padding: "14px 16px", marginBottom: 10,
};

export default WiFiRecon;
