import { useState } from "react";
import Panel from "./Panel.jsx";
import PeopleOSINT from "./osint/PeopleOSINT.jsx";
import EmailOSINT from "./osint/EmailOSINT.jsx";
import MetadataOSINT from "./osint/MetadataOSINT.jsx";
import SocialEngineeringOSINT from "./osint/SocialEngineeringOSINT.jsx";

function OSINT({ startScan, updateScan, finishScan }) {
  const [activeTool, setActiveTool] = useState("people");

  return (
    <div>
      <h1
        style={{
          fontSize: 32,
          marginBottom: 10,
          fontWeight: 700,
          color: "#38bdf8",
          textShadow: "0 0 12px rgba(56, 189, 248, 0.6)",
        }}
      >
        OSINT Intelligence Suite
      </h1>

      <p style={{ marginBottom: 20, color: "#94a3b8", fontSize: 15 }}>
        Run open‑source intelligence on identities, emails, files, and human targets.
      </p>

      <div style={tabBarStyle}>
        <button style={tabStyle(activeTool === "people")} onClick={() => setActiveTool("people")}>People</button>
        <button style={tabStyle(activeTool === "email")} onClick={() => setActiveTool("email")}>Email</button>
        <button style={tabStyle(activeTool === "metadata")} onClick={() => setActiveTool("metadata")}>Metadata</button>
        <button style={tabStyle(activeTool === "social")} onClick={() => setActiveTool("social")}>Social Engineering</button>
      </div>

      <Panel>
        {activeTool === "people" && (
          <PeopleOSINT
            startScan={startScan}
            updateScan={updateScan}
            finishScan={finishScan}
          />
        )}

        {activeTool === "email" && (
          <EmailOSINT
            startScan={startScan}
            updateScan={updateScan}
            finishScan={finishScan}
          />
        )}

        {activeTool === "metadata" && (
          <MetadataOSINT
            startScan={startScan}
            updateScan={updateScan}
            finishScan={finishScan}
          />
        )}

        {activeTool === "social" && (
          <SocialEngineeringOSINT
            startScan={startScan}
            updateScan={updateScan}
            finishScan={finishScan}
          />
        )}
      </Panel>
    </div>
  );
}

const tabBarStyle = {
  display: "flex",
  gap: "8px",
  marginBottom: 16,
};

const tabStyle = (active) => ({
  flex: 1,
  padding: "10px 12px",
  background: active ? "#0f172a" : "#020617",
  color: active ? "#38bdf8" : "#64748b",
  border: active ? "1px solid #38bdf8" : "1px solid #1e293b",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 500,
  transition: "0.2s",
});

export default OSINT;
