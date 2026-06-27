import { useState } from "react";

function PeopleOSINT({ startScan, updateScan, finishScan }) {
  const [username, setUsername] = useState("");
  const [results, setResults] = useState(null);

  const backend = "http://127.0.0.1:8000";

  const runPeopleOSINT = async () => {
    if (!username.trim()) return;

    startScan("Initializing People OSINT...");
    updateScan(10);
    await new Promise(res => setTimeout(res, 200));
    updateScan(25);
    await new Promise(res => setTimeout(res, 200));
    updateScan(40);
    await new Promise(res => setTimeout(res, 200));

    try {
      updateScan(55);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(`${backend}/osint/people`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const data = await res.json();
      setResults(data);

      updateScan(80);
      await new Promise(res => setTimeout(res, 250));
      finishScan("People OSINT Complete");

    } catch (err) {
      console.error("People OSINT error:", err);
      finishScan("People OSINT Failed");
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 10 }}>People OSINT</h2>
      <p style={{ marginBottom: 16, color: "#94a3b8" }}>
        Correlate usernames across platforms and check for breach exposure.
      </p>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 6 }}>Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="spectralstrike"
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
        onClick={runPeopleOSINT}
        style={{
          padding: "8px 14px",
          background: "#38bdf8",
          color: "#0f172a",
          borderRadius: 6,
          border: "none",
          cursor: "pointer",
          fontWeight: 600,
          marginBottom: 16,
        }}
      >
        Run People OSINT
      </button>

      {results && (
        <div style={{ marginTop: 10 }}>
          <h3 style={{ marginBottom: 8 }}>Accounts Found</h3>
          {results.accounts?.length ? (
            <ul style={{ marginBottom: 12 }}>
              {results.accounts.map((acc, i) => (
                <li key={i} style={{ marginBottom: 4 }}>
                  <span style={{ color: "#e2e8f0" }}>{acc.platform}: </span>
                  <a href={acc.url} target="_blank" rel="noreferrer" style={{ color: "#38bdf8" }}>{acc.url}</a>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "#64748b" }}>No accounts found.</p>
          )}

          <h3 style={{ marginBottom: 8 }}>Breaches</h3>
          {results.breaches?.length ? (
            <ul>
              {results.breaches.map((b, i) => (
                <li key={i} style={{ color: "#f97316" }}>{b}</li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "#22c55e" }}>No known breaches.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default PeopleOSINT;