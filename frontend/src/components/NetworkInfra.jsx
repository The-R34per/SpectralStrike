import { useState } from "react";
import Panel from "./Panel.jsx";

import DNSEnum from "./network/DNSEnum.jsx";
import ARPRecon from "./network/ARPRecon.jsx";
import WiFiRecon from "./network/WiFiRecon.jsx";
import IDSEvasion from "./network/IDSEvasion.jsx";
import Pivoting from "./network/Pivoting.jsx";

function NetworkInfra({ startScan, updateScan, finishScan }) {
  const [activeTool, setActiveTool] = useState("dns");

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
        Network & Infrastructure Suite
      </h1>

      <p style={{ marginBottom: 20, color: "#94a3b8", fontSize: 15 }}>
        Perform network‑level reconnaissance and infrastructure analysis.
      </p>

      <div style={tabBarStyle}>
        <button style={tabStyle(activeTool === "dns")} onClick={() => setActiveTool("dns")}>
          DNS Enumeration
        </button>
        <button style={tabStyle(activeTool === "arp")} onClick={() => setActiveTool("arp")}>
          ARP Recon
        </button>
        <button style={tabStyle(activeTool === "wifi")} onClick={() => setActiveTool("wifi")}>
          Wi‑Fi Recon
        </button>
        <button style={tabStyle(activeTool === "ids")} onClick={() => setActiveTool("ids")}>
          IDS Evasion
        </button>
        <button style={tabStyle(activeTool === "pivot")} onClick={() => setActiveTool("pivot")}>
          Pivoting
        </button>
      </div>

      <Panel>
        {activeTool === "dns" && <DNSEnum startScan={startScan} updateScan={updateScan} finishScan={finishScan} />}
		{activeTool === "arp" && <ARPRecon startScan={startScan} updateScan={updateScan} finishScan={finishScan} />}
		{activeTool === "wifi" && <WiFiRecon startScan={startScan} updateScan={updateScan} finishScan={finishScan} />}
		{activeTool === "ids" && <IDSEvasion />}
		{activeTool === "pivot" && <Pivoting />}
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

export default NetworkInfra;
