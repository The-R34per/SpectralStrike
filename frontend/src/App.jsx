import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

import Learn from "./components/Learn.jsx";
import LearnPortScanning from "./components/learn/LearnPortScanning.jsx";
import LearnServiceDetection from "./components/learn/LearnServiceDetection.jsx";
import LearnVulnerabilityFingerprinting from "./components/learn/LearnVulnerabilityFingerprinting.jsx";
import LearnDirectoryBruteforcing from "./components/learn/LearnDirectoryBruteforcing.jsx";
import LearnSubdomainEnumeration from "./components/learn/LearnSubdomainEnumeration.jsx";
import LearnWebRecon from "./components/learn/LearnWebRecon.jsx";
import OSINT from "./components/OSINT.jsx";
import NetworkInfra from "./components/NetworkInfra.jsx";
import LearnDNSEnum from "./components/learn/LearnDNSEnum.jsx";
import LearnARPRecon from "./components/learn/LearnARPRecon.jsx";
import LearnWiFiRecon from "./components/learn/LearnWiFiRecon.jsx";
import LearnIDSEvasion from "./components/learn/LearnIDSEvasion.jsx";
import LearnPivoting from "./components/learn/LearnPivoting.jsx";
import LearnPeopleOSINT from "./components/learn/LearnPeopleOSINT.jsx";
import LearnEmailOSINT from "./components/learn/LearnEmailOSINT.jsx";
import LearnMetadataOSINT from "./components/learn/LearnMetadataOSINT.jsx";
import LearnSocialEngineeringOSINT from "./components/learn/LearnSocialEngineeringOSINT.jsx";
import GlobalProgressBar from "./components/GlobalProgressBar.jsx";
import AboutPage from "./components/learn/AboutPage.jsx";
import HowItWorksPage from "./components/learn/HowItWorksPage.jsx";
import LearnLayout from "./components/learn/LearnLayout.jsx";
import WhatIsPage from "./components/learn/WhatIsPage.jsx";
import WhyBuiltPage from "./components/learn/WhyBuiltPage.jsx";



const backend = "http://127.0.0.1:8000";

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [targets, setTargets] = useState([]);
  const [hostInput, setHostInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [scanResult, setScanResult] = useState(null);

  
  const [stats, setStats] = useState({
  totalTargets: 0,
  totalOpenPorts: 0,
  risk: "LOW",
  });
  

const scrollRef = useRef(null);

useEffect(() => {
  if (scrollRef.current) {
    scrollRef.current.scrollTop = 0;
  }
}, [activePage]);

const [scanProgress, setScanProgress] = useState({
  active: false,
  percent: 0,
  label: "",
});

function startScan(label) {
  setScanProgress({
    active: true,
    percent: 0,
    label: label,
  });
}

function updateScan(percent) {
  setScanProgress(prev => ({
    ...prev,
    percent: percent,
  }));
}

function finishScan(label = "Completed") {
  setScanProgress({
    active: false,
    percent: 100,
    label: label,
  });
}


const [remediationTasks, setRemediationTasks] = useState([]);

const PORT_REMEDIATION = {
  22:   { title: "Restrict SSH access — disable password auth, use key-based auth only", severity: "HIGH" },
  23:   { title: "Telnet detected on port 23 — disable immediately, replace with SSH", severity: "HIGH" },
  80:   { title: "HTTP running on port 80 — investigate if HTTPS redirect is enforced", severity: "MEDIUM" },
  443:  { title: "HTTPS running — verify SSL/TLS certificate and cipher strength", severity: "LOW" },
  3306: { title: "MySQL exposed on port 3306 — restrict to localhost or internal network only", severity: "HIGH" },
  5432: { title: "PostgreSQL exposed on port 5432 — restrict access via firewall rules", severity: "HIGH" },
  8080: { title: "HTTP-Alt on port 8080 — check if this is an unintended dev server exposed publicly", severity: "MEDIUM" },
  21:   { title: "FTP detected on port 21 — FTP is unencrypted, replace with SFTP", severity: "HIGH" },
  25:   { title: "SMTP on port 25 — verify mail server is not an open relay", severity: "MEDIUM" },
  3389: { title: "RDP exposed on port 3389 — restrict access, enable NLA, use VPN", severity: "HIGH" },
};

const addRemediationTasks = (scanData) => {
  const newTasks = [];
  const host = scanData.host;
  const now = new Date().toLocaleDateString();

  scanData.open_ports.forEach((port) => {
    const remedy = PORT_REMEDIATION[port];
    if (remedy) {
      const id = `${host}-port-${port}-${Date.now()}`;
      setRemediationTasks(prev => {
        const exists = prev.some(t => t.host === host && t.port === port);
        if (exists) return prev;
        return [...prev, {
          id,
          host,
          port,
          title: remedy.title,
          severity: remedy.severity,
          source: "PORT_SCAN",
          done: false,
          date: now,
        }];
      });
    }
  });

  setRemediationTasks(prev => {
    const exists = prev.some(t => t.host === host && t.source === "CVE_INTEL");
    if (exists) return prev;
    return [...prev, {
      id: `${host}-cve-${Date.now()}`,
      host,
      port: null,
      title: `Investigate known CVEs for ${host} — check the Threat Intel page for vulnerabilities`,
      severity: scanData.risk_score === "HIGH" ? "HIGH" : "MEDIUM",
      source: "CVE_INTEL",
      done: false,
      date: now,
    }];
  });
};



  const loadTargets = async () => {
    try {
      const res = await axios.get(`${backend}/targets`);
      setTargets(res.data);
      setStats((prev) => ({
        ...prev,
        totalTargets: res.data.length,
      }));
    } catch (err) {
      console.error("Error loading targets:", err);
    }
  };

  const addTarget = async () => {
    if (!hostInput.trim()) return;
    try {
      await axios.post(`${backend}/targets`, {
        host: hostInput.trim(),
        description: descInput.trim() || null,
      });
      setHostInput("");
      setDescInput("");
      loadTargets();
    } catch (err) {
      console.error("Error adding target:", err);
    }
  };

  const deleteTarget = async (id) => {
    try {
      await axios.delete(`${backend}/targets/${id}`);
      if (scanResult && scanResult.host === targets.find((t) => t.id === id)?.host) {
        setScanResult(null);
      }
      loadTargets();
    } catch (err) {
      console.error("Error deleting target:", err);
    }
  };
  
  


  const scanTarget = async (host) => {
  try {
    const res = await axios.get(`${backend}/scan/${host}`);
    setScanResult(res.data);
    setStats((prev) => ({
      ...prev,
      totalOpenPorts: res.data.open_ports.length,
      risk: res.data.risk_score,
    }));
    addRemediationTasks(res.data); 
  } catch (err) {
    console.error("Error scanning target:", err);
  }
  loadTargets();
};

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0a0f1f", color: "#e2e8f0" }}>
      <div
        className="sidebar"
        style={{ width: sidebarCollapsed ? 72 : 240, transition: "width 0.2s ease" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: sidebarCollapsed ? "center" : "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontSize: sidebarCollapsed ? 20 : 22,
              fontWeight: 700,
              color: "#00ffc6",
              textShadow: "0 0 8px rgba(0,255,198,0.6)",
              fontFamily: "monospace",
            }}
          >
            {sidebarCollapsed ? "SS" : "SpectralStrike"}
          </span>
          {!sidebarCollapsed && (
            <span style={{ fontSize: 11, opacity: 0.7 }}>Operations Console</span>
          )}
        </div>

        <div
          className="sidebar-item"
          onClick={() => setSidebarCollapsed((c) => !c)}
          style={{ justifyContent: sidebarCollapsed ? "center" : "flex-start" }}
        >
          <span style={{ fontFamily: "monospace" }}>{sidebarCollapsed ? "[≡]" : "[≡] Collapse Sidebar"}</span>
        </div>

        <SidebarItem
          label="Dashboard"
          icon="[◎]"
          active={activePage === "dashboard"}
          collapsed={sidebarCollapsed}
          onClick={() => setActivePage("dashboard")}
        />
        <SidebarItem
          label="Targets"
          icon="[✚]"
          active={activePage === "targets"}
          collapsed={sidebarCollapsed}
          onClick={() => setActivePage("targets")}
        />
        <SidebarItem
          label="Scan"
          icon="[≋≋]"
          active={activePage === "scan"}
          collapsed={sidebarCollapsed}
          onClick={() => setActivePage("scan")}
        />
		
        <SidebarItem
          label="Port Scanner"
          icon="[%%️]"
          active={activePage === "ports"}
          collapsed={sidebarCollapsed}
          onClick={() => setActivePage("ports")}
        />

        <SidebarItem
          label="Network & Infra"
          icon="[~~️]"
          active={activePage === "network" || activePage.startsWith("learn_dnsenum") || activePage.startsWith("learn_arp") 
		  || activePage.startsWith("learn_wifi") || activePage.startsWith("learn_ids") || activePage.startsWith("learn_pivoting") 
		  || activePage.startsWith("AboutPage") || activePage.startsWith("HowItWorksPage") || activePage.startsWith("WhatIsPage") || activePage.startsWith("WhyBuiltPage")}
          collapsed={sidebarCollapsed}
          onClick={() => setActivePage("network")}
        />
		
        <SidebarItem
          label="OSINT"
          icon="[##]"
          active={activePage === "osint" || activePage.includes("_osint")}
          collapsed={sidebarCollapsed}
          onClick={() => setActivePage("osint")}
        />
		
        <SidebarItem
          label="Directory Buster"
          icon="[!!]"
          active={activePage === "dirbust"}
          collapsed={sidebarCollapsed}
          onClick={() => setActivePage("dirbust")}
        />
		
        <SidebarItem
          label="SubDomain Enum"
          icon="[**]"
          active={activePage === "subdomains"}
          collapsed={sidebarCollapsed}
          onClick={() => setActivePage("subdomains")}
        />

        <SidebarItem
          label="Passwords"
          icon="[$$]"
          active={activePage === "password"}
          collapsed={sidebarCollapsed}
          onClick={() => setActivePage("password")}
        />

        <SidebarItem
          label="Intel"
          icon="[==]"
          active={activePage === "intel"}
          collapsed={sidebarCollapsed}
          onClick={() => setActivePage("intel")}
        />
		
        <SidebarItem
          label="Remediation"
          icon="[<>]"
          active={activePage === "remediation"}
          collapsed={sidebarCollapsed}
          onClick={() => setActivePage("remediation")}
        />

        <SidebarItem
          label="Learn"
          icon="[?]"
          active={
            activePage === "learn" || 
            ["learn_ports", "learn_services", "learn_vulns", "learn_dirbust", "learn_subdomains", "learn_webrecon"].includes(activePage)
          }
          collapsed={sidebarCollapsed}
          onClick={() => setActivePage("learn")}
        />
		
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header scanProgress={scanProgress} />

        {/* SCROLL WRAPPER */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 24,
            position: "relative",
            scrollbarWidth: "none",
          }}
          className="no-scrollbar"
        >
          <div className="scanlines" />

          {activePage === "dashboard" && (
            <Dashboard stats={stats} targets={targets} />
          )}

          {activePage === "targets" && (
            <Targets
              targets={targets}
              hostInput={hostInput}
              descInput={descInput}
              setHostInput={setHostInput}
              setDescInput={setDescInput}
              addTarget={addTarget}
              deleteTarget={deleteTarget}
            />
          )}

          {activePage === "scan" && (
            <Scan
              targets={targets}
              scanResult={scanResult}
              scanTarget={scanTarget}
			  startScan={startScan}
			  updateScan={updateScan}
			  finishScan={finishScan}
            />
          )}

          {activePage === "intel" && <Intel targets={targets} />}
          {activePage === "osint" && <OSINT
			startScan={startScan}
			updateScan={updateScan}
			finishScan={finishScan}/>}
          {activePage === "password" && <PasswordAnalyzer />}
          {activePage === "ports" && (
            <PortScanner targets={targets} scanResult={scanResult} startScan={startScan} updateScan={updateScan} finishScan={finishScan}/>
          )}
          {activePage === "dirbust" && <DirBuster startScan={startScan} updateScan={updateScan} finishScan={finishScan} />}
          {activePage === "subdomains" && <SubdomainEnum startScan={startScan} updateScan={updateScan} finishScan={finishScan}/>}
          {activePage === "remediation" && <RemediationTracker tasks={remediationTasks} setTasks={setRemediationTasks} setActivePage={setActivePage} />}

          {/* Learn main */}
          {activePage === "learn" && (
            <Learn setActivePage={setActivePage} />
          )}

          {/* Learn modules */}
          {activePage === "learn_ports" && (
            <LearnPortScanning setActivePage={setActivePage} />
          )}
          {activePage === "learn_services" && (
            <LearnServiceDetection setActivePage={setActivePage} />
          )}
          {activePage === "learn_vulns" && (
            <LearnVulnerabilityFingerprinting setActivePage={setActivePage} />
          )}
          {activePage === "learn_dirbust" && (
            <LearnDirectoryBruteforcing setActivePage={setActivePage} />
          )}
          {activePage === "learn_subdomains" && (
            <LearnSubdomainEnumeration setActivePage={setActivePage} />
          )}
          {activePage === "learn_webrecon" && (
            <LearnWebRecon setActivePage={setActivePage} />
          )}
		  
		  {/* SpectralStrike Learn Pages */}
			{activePage === "learn_what" && (
			  <WhatIsPage setActivePage={setActivePage} />
			)}
			{activePage === "learn_why" && (
			  <WhyBuiltPage setActivePage={setActivePage} />
			)}
			{activePage === "learn_how" && (
			  <HowItWorksPage setActivePage={setActivePage} />
			)}
			{activePage === "learn_about" && (
			  <AboutPage setActivePage={setActivePage} />
			)}
		  

          {/* Network & Infra */}
          {activePage === "network" && <NetworkInfra startScan={startScan} updateScan={updateScan} finishScan={finishScan} />}

          {activePage === "learn_dnsenum" && (
            <LearnDNSEnum setActivePage={setActivePage} />
          )}
          {activePage === "learn_arp" && (
            <LearnARPRecon setActivePage={setActivePage} />
          )}
          {activePage === "learn_wifi" && (
            <LearnWiFiRecon setActivePage={setActivePage} />
          )}
          {activePage === "learn_ids" && (
            <LearnIDSEvasion setActivePage={setActivePage} />
          )}
          {activePage === "learn_pivoting" && (
            <LearnPivoting setActivePage={setActivePage} />
          )}

          {/* OSINT Learn */}
          {activePage === "learn_people_osint" && (
            <LearnPeopleOSINT setActivePage={setActivePage} />
          )}
          {activePage === "learn_email_osint" && (
            <LearnEmailOSINT setActivePage={setActivePage} />
          )}
          {activePage === "learn_metadata_osint" && (
            <LearnMetadataOSINT setActivePage={setActivePage} />
          )}
          {activePage === "learn_social_osint" && (
            <LearnSocialEngineeringOSINT setActivePage={setActivePage} />
          )}
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ label, icon, active, collapsed, onClick }) {
  return (
    <div
      className={active ? "sidebar-item sidebar-active" : "sidebar-item"}
      onClick={onClick}
      style={{ justifyContent: collapsed ? "center" : "flex-start" }}
    >
      <span style={{ fontFamily: "monospace" }}>{icon}</span>
      {!collapsed && <span>{label}</span>}
    </div>
  );
}

function Header({ scanProgress }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="header">

      {/* LEFT SIDE */}
      <div>
        <div className="header-title">SpectralStrike Operations Console</div>
        <div className="header-status" style={{ fontFamily: "monospace" }}>
          [SYS: ONLINE] &gt; OPS_READY ● LINKED
        </div>
      </div>
	  
	  {/* ⭐ PROGRESS BAR IN THE MIDDLE ⭐ */}
      <div style={{ width: "50%", marginTop: 8 }}>
        <GlobalProgressBar
          active={scanProgress.active}
          percent={scanProgress.percent}
          label={scanProgress.label}
        />
      </div>

      {/* RIGHT SIDE */}
      <div
        style={{
          textAlign: "right",
          fontFamily: "monospace",
          fontSize: 13,
        }}
      >
        {time.toLocaleDateString()} {time.toLocaleTimeString()}
      </div>

      

    </div>
  );
}



function Dashboard({ stats, targets }) {
  const [tick, setTick] = useState(0);
  const [activityLog, setActivityLog] = useState([
    { msg: "System initialized — awaiting target input", color: "#00ffc6", time: new Date().toLocaleTimeString() },
    { msg: "SpectralStrike Operations Console online", color: "#7c3aed", time: new Date().toLocaleTimeString() },
  ]);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (stats.totalTargets > 0) {
      setActivityLog(prev => {
        const msg = { msg: `[TARGETS] ${stats.totalTargets} host(s) registered in target matrix`, color: "#00ffc6", time: new Date().toLocaleTimeString() };
        if (prev.some(p => p.msg === msg.msg)) return prev;
        return [msg, ...prev].slice(0, 20);
      });
    }
  }, [stats.totalTargets]);

  useEffect(() => {
    if (stats.totalOpenPorts > 0) {
      setActivityLog(prev => {
        const msg = { msg: `[SCAN] ${stats.totalOpenPorts} open port(s) detected — risk level: ${stats.risk}`, color: stats.risk === "HIGH" ? "#ef4444" : stats.risk === "MEDIUM" ? "#f59e0b" : "#10b981", time: new Date().toLocaleTimeString() };
        if (prev.some(p => p.msg === msg.msg)) return prev;
        return [msg, ...prev].slice(0, 20);
      });
    }
  }, [stats.totalOpenPorts]);

  const riskColor = (r) => {
    if (r === "HIGH") return "#ef4444";
    if (r === "MEDIUM") return "#f59e0b";
    return "#10b981";
  };

  const cursor = tick % 2 === 0 ? "█" : " ";

  const pieData = {
    labels: ["Active Targets", "Available Slots"],
    datasets: [{
      data: [stats.totalTargets || 0, Math.max(0, 10 - (stats.totalTargets || 0))],
      backgroundColor: ["#00ffc6", "rgba(0,255,198,0.05)"],
      borderColor: ["#00ffc6", "rgba(51,65,85,0.5)"],
      borderWidth: 1,
    }],
  };

  const barData = {
    labels: targets.length > 0 ? targets.map(t => t.host) : ["No targets"],
    datasets: [{
      label: "Open Ports",
      data: targets.length > 0 ? targets.map(t => t.ports?.length || 0) : [0],
      backgroundColor: "rgba(124,58,237,0.6)",
      borderColor: "#7c3aed",
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: "#94a3b8", font: { family: "monospace" } } } },
    scales: {
      x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#94a3b8", font: { family: "monospace", size: 11 } } },
      y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#94a3b8", font: { family: "monospace" } }, beginAtZero: true },
    },
  };


  const riskPercent = stats.risk === "HIGH" ? 90 : stats.risk === "MEDIUM" ? 55 : 15;

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(0,255,198,0.1)", paddingBottom: 12, marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#38bdf8", textShadow: "0 0 12px rgba(56, 189, 248, 0.6)" }}>
          System Overview
        </h1>
        <p style={{ marginTop: 8, color: "#94a3b8", fontSize: 15 }}>Live status of targets, open ports, and infrastructure risk.</p>
        <div style={{ fontFamily: "monospace", fontSize: 11, color: "#475569", marginTop: 4 }}>
          SPECTRALSTRIKE v2.0 ● SESSION ACTIVE ● {new Date().toLocaleDateString()} {cursor}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>

        {/* Targets */}
        <div className="panel" style={{ position: "relative", overflow: "hidden", borderTop: "2px solid #00ffc6" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at top left, rgba(0,255,198,0.05), transparent)", pointerEvents: "none" }} />
          <div style={{ fontSize: 10, color: "#00ffc6", fontFamily: "monospace", letterSpacing: 2, marginBottom: 8 }}>IDENTIFIED TARGETS</div>
          <div style={{ fontSize: 42, fontWeight: 900, color: "#00ffc6", fontFamily: "monospace", lineHeight: 1, textShadow: "0 0 20px rgba(0,255,198,0.4)" }}>
            {String(stats.totalTargets).padStart(2, "0")}
          </div>
          <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", marginTop: 8 }}>HOSTS IN TARGET MATRIX</div>
        </div>

        {/* Open ports */}
        <div className="panel" style={{ position: "relative", overflow: "hidden", borderTop: "2px solid #7c3aed" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at top left, rgba(124,58,237,0.07), transparent)", pointerEvents: "none" }} />
          <div style={{ fontSize: 10, color: "#7c3aed", fontFamily: "monospace", letterSpacing: 2, marginBottom: 8 }}>OPEN VECTORS</div>
          <div style={{ fontSize: 42, fontWeight: 900, color: "#7c3aed", fontFamily: "monospace", lineHeight: 1, textShadow: "0 0 20px rgba(124,58,237,0.4)" }}>
            {String(stats.totalOpenPorts).padStart(2, "0")}
          </div>
          <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", marginTop: 8 }}>EXPOSED INTERFACES DETECTED</div>
        </div>

        {/* Risk level */}
        <div className="panel" style={{ position: "relative", overflow: "hidden", borderTop: "2px solid " + riskColor(stats.risk) }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at top left, " + riskColor(stats.risk) + "11, transparent)", pointerEvents: "none" }} />
          <div style={{ fontSize: 10, color: riskColor(stats.risk), fontFamily: "monospace", letterSpacing: 2, marginBottom: 8 }}>THREAT LEVEL</div>
          <div style={{ fontSize: 42, fontWeight: 900, color: riskColor(stats.risk), fontFamily: "monospace", lineHeight: 1, textShadow: "0 0 20px " + riskColor(stats.risk) + "66" }}>
            {stats.risk || "LOW"}
          </div>
          <div style={{ marginTop: 10, height: 4, borderRadius: 999, background: "#1e293b", overflow: "hidden" }}>
            <div style={{ width: riskPercent + "%", height: "100%", background: riskColor(stats.risk), boxShadow: "0 0 8px " + riskColor(stats.risk), transition: "width 0.6s ease" }} />
          </div>
          <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", marginTop: 6 }}>INFRASTRUCTURE RISK RATING</div>
        </div>

        {/* System status */}
        <div className="panel" style={{ position: "relative", overflow: "hidden", borderTop: "2px solid #10b981" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at top left, rgba(16,185,129,0.05), transparent)", pointerEvents: "none" }} />
          <div style={{ fontSize: 10, color: "#10b981", fontFamily: "monospace", letterSpacing: 2, marginBottom: 8 }}>SYSTEM STATUS</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#10b981", fontFamily: "monospace", lineHeight: 1, textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>
            ONLINE
          </div>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
            {["BACKEND", "SCANNER", "INTEL FEED"].map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px #10b981" }} />
                <span style={{ fontFamily: "monospace", fontSize: 10, color: "#64748b" }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 16, marginBottom: 16 }}>
        <Panel>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 12, letterSpacing: "1px", color: "#00ffc6", fontFamily: "monospace" }}>[▣] TARGET DISTRIBUTION</h3>
            <span style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>LIVE</span>
          </div>
          <div style={{ maxWidth: "200px", margin: "0 auto" }}>
            <Pie data={pieData} options={{ plugins: { legend: { display: false } } }} />
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 12 }}>
            <div style={{ fontFamily: "monospace", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ffc6" }} />
              <span style={{ color: "#94a3b8" }}>Active: {stats.totalTargets}</span>
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(0,255,198,0.1)", border: "1px solid #334155" }} />
              <span style={{ color: "#94a3b8" }}>Free: {Math.max(0, 10 - stats.totalTargets)}</span>
            </div>
          </div>
        </Panel>

        <Panel>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 12, letterSpacing: "1px", color: "#7c3aed", fontFamily: "monospace" }}>[▣] OPEN PORTS PER TARGET</h3>
            <span style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>VECTOR MAP</span>
          </div>
          <div style={{ height: "180px" }}>
            <Bar data={barData} options={chartOptions} />
          </div>
        </Panel>
      </div>

      {/* Bottom row: target table + activity log */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>

        {/* Target table */}
        <Panel>
          <div style={{ fontSize: 11, color: "#00ffc6", fontFamily: "monospace", letterSpacing: 1, marginBottom: 12 }}>
            [▣] TARGET REGISTRY
          </div>
          {targets.length === 0 ? (
            <div style={{ color: "#475569", fontFamily: "monospace", fontSize: 12, textAlign: "center", padding: "20px 0" }}>
              No targets registered — add a target to begin.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "monospace", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1e293b" }}>
                  {["HOST", "PORTS", "RISK"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "6px 8px", color: "#475569", fontSize: 10, letterSpacing: 1 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {targets.map(t => {
                  const portCount = t.ports?.length || 0;
                  const risk = portCount === 0 ? "LOW" : portCount < 5 ? "MEDIUM" : "HIGH";
                  return (
                    <tr key={t.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                      <td style={{ padding: "8px 8px", color: "#00ffc6" }}>{t.host}</td>
                      <td style={{ padding: "8px 8px", color: "#7c3aed" }}>{portCount}</td>
                      <td style={{ padding: "8px 8px" }}>
                        <span style={{
                          fontSize: 10, padding: "2px 6px", borderRadius: 4,
                          background: riskColor(risk) + "22",
                          color: riskColor(risk),
                          border: "1px solid " + riskColor(risk) + "55",
                        }}>
                          {risk}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Panel>

        {/* Activity log */}
        <Panel>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "#00ffc6", fontFamily: "monospace", letterSpacing: 1 }}>
              [▣] ACTIVITY LOG
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 10, color: "#475569" }}>
              {cursor} LIVE
            </div>
          </div>
          <div style={{ maxHeight: 220, overflowY: "auto", scrollbarWidth: "none" }}>
            {activityLog.map((entry, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                <span style={{ fontFamily: "monospace", fontSize: 10, color: "#334155", flexShrink: 0, marginTop: 1 }}>
                  {entry.time}
                </span>
                <span style={{ fontFamily: "monospace", fontSize: 11, color: entry.color, lineHeight: 1.4 }}>
                  {entry.msg}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

{/* REUSABLE PROGRESS BAR ENGINE */}
function OperationProgressBar({ progress, loading, label = "PROCESSING VECTORS" }) {
  if (!loading && progress === 0) return null;

  return (
    <div style={{ marginTop: 16, marginBottom: 16, fontFamily: "monospace" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#00ffc6", marginBottom: 4 }}>
        <span>[{label}]</span>
        <span>{progress}%</span>
      </div>
      <div style={{ height: 6, background: "#0f172a", borderRadius: 3, overflow: "hidden", border: "1px solid #1e293b" }}>
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #7c3aed, #00ffc6)",
            boxShadow: "0 0 8px rgba(0,255,198,0.5)",
            transition: "width 0.1s linear"
          }}
        />
      </div>
    </div>
  );
}

function PortScanner({ targets, scanResult, startScan, updateScan, finishScan }) {
  const [selectedTarget, setSelectedTarget] = useState("");
  const [ports, setPorts] = useState("22,80,443");
  const [results, setResults] = useState(null);
  const [usePrevious, setUsePrevious] = useState(true);
  const [scanType, setScanType] = useState("syn");

  if (!targets || !Array.isArray(targets)) {
    return (
      <Panel>
        <h3>No targets loaded.</h3>
      </Panel>
    );
  }

  const selectedTargetObj = targets.find((t) => t.host === selectedTarget);
  const previousPorts = selectedTargetObj?.ports || [];

  const runScan = async () => {
  if (!selectedTarget) return;

  const portList = usePrevious
    ? previousPorts
    : ports
        .split(",")
        .map((p) => parseInt(p.trim()))
        .filter((p) => !isNaN(p));

  if (portList.length === 0) return;

  startScan("Initializing Port Scan...");
  updateScan(5);

  await new Promise(res => setTimeout(res, 400));

  updateScan(15);
  await new Promise(res => setTimeout(res, 300));

  updateScan(25);
  await new Promise(res => setTimeout(res, 300));

  updateScan(35);
  await new Promise(res => setTimeout(res, 300));

  try {
    updateScan(45);

    const res = await axios.post(`${backend}/scan/ports`, {
      target: selectedTarget,
      ports: portList,
      scanType: scanType,
    });

    updateScan(65);
    await new Promise(res => setTimeout(res, 350));

    const enhanced = res.data.results.map((r) => {
      if (scanType === "syn") {
        return { ...r, state: r.status === "open" ? "open" : "filtered" };
      }
      if (scanType === "udp") {
        return { ...r, state: r.status === "open" ? "open" : "open|filtered" };
      }
      return { ...r, state: r.status };
    });

    setResults({ target: res.data.target, results: enhanced });

    updateScan(85);
    await new Promise(res => setTimeout(res, 400));

    finishScan("Port Scan Complete");

  } catch (err) {
    console.error("Port scan error:", err);
    finishScan("Port Scan Failed");
  }
};

  const toggleStyle = {
    position: "relative",
    width: "50px",
    height: "24px",
    background: usePrevious ? "#10b981" : "#334155",
    borderRadius: "999px",
    cursor: "pointer",
    transition: "0.2s",
    boxShadow: usePrevious ? "0 0 10px #10b981" : "none",
  };

  const knobStyle = {
    position: "absolute",
    top: "3px",
    left: usePrevious ? "26px" : "3px",
    width: "18px",
    height: "18px",
    background: "white",
    borderRadius: "50%",
    transition: "0.2s",
  };

  return (
    <div>
      <h1 style={{ fontSize: 32, marginBottom: 10, fontWeight: 700, color: "#38bdf8", textShadow: "0 0 12px rgba(56, 189, 248, 0.6)" }}>Port Scanner</h1>
      <p style={{ marginBottom: 20, color: "#94a3b8", fontSize: 15 }}>Run stealth, TCP connect, and UDP scans against selected targets.</p>

      {scanResult && (
        <Panel>
          <h3>Initial Scan Results for {scanResult.host}</h3>

          {scanResult.open_ports.map((p, idx) => (
            <div key={p} style={{ marginBottom: 6 }}>
              <strong>Port {p}</strong> — {scanResult.services[idx]}
            </div>
          ))}

          {scanResult.findings && scanResult.findings.length > 0 && (
            <>
              <h4 style={{ marginTop: 12 }}>Potential Issues</h4>
              {scanResult.findings.map((f, i) => (
                <div key={i} style={{ color: "#eab308" }}>
                  {f}
                </div>
              ))}
            </>
          )}
        </Panel>
      )}

      <Panel>
        <h3 style={{ marginBottom: 10 }}>Select Target</h3>
        <select
          value={selectedTarget}
          onChange={(e) => setSelectedTarget(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 12,
            borderRadius: 6,
            border: "1px solid #334155",
            background: "#0f172a",
            color: "white",
          }}
        >
          <option value="">Choose a target...</option>
          {targets.map((t) => (
            <option key={t.id} value={t.host}>
              {t.host}
            </option>
          ))}
        </select>

        <h3 style={{ marginBottom: 10 }}>Scan Type</h3>
        <select
          value={scanType}
          onChange={(e) => setScanType(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 12,
            borderRadius: 6,
            border: "1px solid #334155",
            background: "#0f172a",
            color: "white",
          }}
        >
          <option value="syn">SYN Scan (Stealth)</option>
          <option value="connect">TCP Connect Scan</option>
          <option value="udp">UDP Scan</option>
        </select>

        <h3 style={{ marginBottom: 10 }}>Port Source</h3>
        <div
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}
        >
          <div style={toggleStyle} onClick={() => setUsePrevious(!usePrevious)}>
            <div style={knobStyle}></div>
          </div>
          <span>{usePrevious ? "Using initial scan ports" : "Custom ports"}</span>
        </div>

        {usePrevious ? (
          <div
            style={{
              background: "#0f172a",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #334155",
              marginBottom: 12,
              color: "white",
            }}
          >
            {previousPorts.length > 0
              ? previousPorts.join(", ")
              : "No ports available for this target"}
          </div>
        ) : (
          <input
            placeholder="22,80,443"
            value={ports}
            onChange={(e) => setPorts(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 12,
              borderRadius: 6,
              border: "1px solid #334155",
              background: "#0f172a",
              color: "white",
            }}
          />
        )}

        <button className="btn btn-primary" onClick={runScan}>
          Scan Ports
        </button>
      </Panel>

      {results && (
        <Panel>
          <h3 style={{ marginBottom: 12 }}>
            Results for {results.target}
          </h3>

          {results.results.map((r) => (
            <div
              key={r.port}
              style={{
                background: "#0f172a",
                padding: 12,
                borderRadius: 6,
                marginBottom: 10,
                borderLeft:
                  r.state === "open"
                    ? "3px solid #10b981"
                    : r.state.includes("filtered")
                    ? "3px solid #eab308"
                    : "3px solid #ef4444",
              }}
            >
              <strong>Port {r.port}</strong>:{" "}
              <span
                style={{
                  color:
                    r.state === "open"
                      ? "#10b981"
                      : r.state.includes("filtered")
                      ? "#eab308"
                      : "#ef4444",
                  fontWeight: "bold",
                }}
              >
                {r.state}
              </span>
            </div>
          ))}
        </Panel>
      )}
    </div>
  );
}


function SubdomainEnum({ startScan, updateScan, finishScan }) {
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); 
  const [sortAsc, setSortAsc] = useState(true);
  const [copied, setCopied] = useState(null);

  const runEnum = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setProgress(5);
    setError(null);
    setResults(null);


    startScan?.("Subdomain Enumeration...");
    updateScan?.(5);

    const interval = setInterval(() => {
      setProgress((old) => {
        if (old >= 95) return old;
        const next = old + Math.floor(Math.random() * 5) + 1;
        updateScan?.(Math.min(next, 95));
        return next;
      });
    }, 200);

    try {
      const res = await axios.post(`${backend}/recon/subdomains`, {
        domain,
        brute: true,
      });
      clearInterval(interval);
      setProgress(100);
      updateScan?.(100);
      setTimeout(() => {
        setResults(res.data);
        setLoading(false);
        setProgress(0);
        finishScan?.("Subdomain Enum Complete");
      }, 400);
    } catch (err) {
      clearInterval(interval);
      setLoading(false);
      setProgress(0);
      setError("Scan failed — check the backend or domain and try again.");
      finishScan?.("Subdomain Enum Failed");
      console.error(err);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  };

  const statusColor = (status) => {
    if (status === 200) return "#10b981";
    if (status === "unreachable") return "#ef4444";
    return "#3b82f6";
  };

  const filteredResults = results?.results
    ?.filter((r) => {
      if (filter === "reachable") return r.status !== "unreachable";
      if (filter === "unreachable") return r.status === "unreachable";
      return true;
    })
    .sort((a, b) =>
      sortAsc
        ? a.subdomain.localeCompare(b.subdomain)
        : b.subdomain.localeCompare(a.subdomain)
    );

  const totalFound = results?.results?.length ?? 0;
  const totalReachable = results?.results?.filter((r) => r.status !== "unreachable").length ?? 0;
  const totalUnreachable = totalFound - totalReachable;

  return (
    <div>
      <h1 style={{ fontSize: 32, marginBottom: 10, fontWeight: 700, color: "#38bdf8", textShadow: "0 0 12px rgba(56, 189, 248, 0.6)" }}>Subdomain Enumeration</h1>
      <p style={{ marginBottom: 20, color: "#94a3b8", fontSize: 15 }}>Discover subdomains via passive certificate transparency and brute force.</p>

      <Panel>
        <input
          placeholder="example.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && runEnum()}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 12,
            borderRadius: 6,
            border: "1px solid #334155",
            background: "#0f172a",
            color: "white",
          }}
        />
        <button className="btn btn-primary" onClick={runEnum} disabled={loading}>
          {loading ? "Enumerating..." : "Start Scan"}
        </button>

        {error && (
          <div style={{ marginTop: 12, color: "#ef4444", fontFamily: "monospace", fontSize: 13 }}>
            ⚠ {error}
          </div>
        )}
      </Panel>

      {results && (
        <Panel>
          {/* Summary stats */}
          <div style={{ display: "flex", gap: 24, marginBottom: 16 }}>
            <div style={{ fontFamily: "monospace", fontSize: 13 }}>
              <span style={{ color: "#94a3b8" }}>TOTAL </span>
              <span style={{ color: "#00ffc6", fontWeight: 700 }}>{totalFound}</span>
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 13 }}>
              <span style={{ color: "#94a3b8" }}>REACHABLE </span>
              <span style={{ color: "#10b981", fontWeight: 700 }}>{totalReachable}</span>
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 13 }}>
              <span style={{ color: "#94a3b8" }}>UNREACHABLE </span>
              <span style={{ color: "#ef4444", fontWeight: 700 }}>{totalUnreachable}</span>
            </div>
          </div>

          {/* Filter + sort controls */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            {["all", "reachable", "unreachable"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="btn"
                style={{
                  padding: "4px 12px",
                  fontSize: 12,
                  background: filter === f ? "#7c3aed" : "#1e293b",
                  boxShadow: filter === f ? "0 0 8px rgba(124,58,237,0.4)" : "none",
                  textTransform: "uppercase",
                }}
              >
                {f}
              </button>
            ))}
            <button
              onClick={() => setSortAsc((s) => !s)}
              className="btn"
              style={{ padding: "4px 12px", fontSize: 12, background: "#1e293b", marginLeft: "auto" }}
            >
              Sort: {sortAsc ? "A → Z" : "Z → A"}
            </button>
          </div>

          <h3 style={{ marginBottom: 12 }}>Results for {results.domain}</h3>

          {filteredResults?.length === 0 && (
            <div style={{ color: "#64748b", fontFamily: "monospace", fontSize: 13 }}>
              No results match the current filter.
            </div>
          )}

          {filteredResults?.map((r) => (
            <div
              key={r.subdomain}
              style={{
                background: "#0f172a",
                padding: 12,
                borderRadius: 6,
                marginBottom: 10,
                borderLeft: `3px solid ${statusColor(r.status)}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong style={{ fontFamily: "monospace" }}>{r.subdomain}</strong>
                <div style={{ color: "#e2e8f0", fontSize: 13, marginTop: 2 }}>
                  Status: {r.status} — IP: {r.ip || "N/A"}
                </div>
              </div>
              <button
                onClick={() => handleCopy(r.subdomain)}
                className="btn"
                style={{
                  padding: "4px 10px",
                  fontSize: 11,
                  background: copied === r.subdomain ? "#10b981" : "#1e293b",
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                {copied === r.subdomain ? "Copied!" : "Copy"}
              </button>
            </div>
          ))}
        </Panel>
      )}
    </div>
  );
}

function DirBuster({ startScan, updateScan, finishScan }) {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customWords, setCustomWords] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const DEFAULT_WORDLIST = [
    "admin", "login", "dashboard", "backup", "api", "uploads",
    "images", "css", "js", "server-status", "phpmyadmin",
    "test", "dev", "old", "private", "config", "wp-admin",
    "wp-login.php", "robots.txt", ".env", "setup", "install",
    "debug", "console", "manage", "portal", "static", "assets",
  ];

  const toggleStyle = {
    position: "relative",
    width: "50px",
    height: "24px",
    background: showCustom ? "#10b981" : "#334155",
    borderRadius: "999px",
    cursor: "pointer",
    transition: "0.2s",
    boxShadow: showCustom ? "0 0 10px #10b981" : "none",
  };

  const knobStyle = {
    position: "absolute",
    top: "3px",
    left: showCustom ? "26px" : "3px",
    width: "18px",
    height: "18px",
    background: "white",
    borderRadius: "50%",
    transition: "0.2s",
  };

  const runDirbust = async () => {
    if (!url.trim()) return;

    setResults(null);
    setLoading(true);
    startScan("Fuzzing directories...");
    updateScan(5);

    const wordlist = showCustom && customWords.trim()
      ? customWords.split("\n").map(w => w.trim()).filter(Boolean)
      : DEFAULT_WORDLIST;

    let prog = 5;
    const interval = setInterval(() => {
      prog = Math.min(prog + Math.floor(Math.random() * 6) + 1, 92);
      updateScan(prog);
    }, 200);

    try {
      const res = await fetch(`${backend}/web/dirbust`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), wordlist }),
      });
      clearInterval(interval);
      const data = await res.json();
      setResults(data);
      updateScan(100);
      finishScan("Directory Scan Complete");
    } catch (err) {
      clearInterval(interval);
      console.error(err);
      finishScan("Directory Scan Failed");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    if (status === 200) return "#22c55e";
    if (status === 301 || status === 302) return "#38bdf8";
    if (status === 403) return "#facc15";
    if (status === 500) return "#f97316";
    return "#ef4444";
  };

  const statusBorder = (status) => {
    if (status === 200) return "#22c55e";
    if (status === 301 || status === 302) return "#38bdf8";
    if (status === 403) return "#facc15";
    if (status === 500) return "#f97316";
    return "#1e293b";
  };

  const filteredResults = results?.results?.filter(r => {
    if (filterStatus === "all") return true;
    if (filterStatus === "200") return r.status === 200;
    if (filterStatus === "redirect") return r.status === 301 || r.status === 302;
    if (filterStatus === "forbidden") return r.status === 403;
    if (filterStatus === "error") return r.status === "error";
    return true;
  }) ?? [];

  const statusCounts = results?.results?.reduce((acc, r) => {
    const key = r.status === 200 ? "200"
      : (r.status === 301 || r.status === 302) ? "redirect"
      : r.status === 403 ? "forbidden"
      : r.status === "error" ? "error" : "other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {}) ?? {};

  return (
    <div>
      <h1 style={{ fontSize: 32, marginBottom: 10, fontWeight: 700, color: "#38bdf8", textShadow: "0 0 12px rgba(56, 189, 248, 0.6)" }}>Directory Brute-Forcing</h1>
      <p style={{ marginBottom: 20, color: "#94a3b8", fontSize: 15 }}>Fuzz web directories and endpoints to discover hidden paths.</p>
      <Panel>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 13 }}>
            Target URL
          </label>
          <input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runDirbust()}
            style={{
              width: "100%", padding: 10, borderRadius: 6,
              border: "1px solid #334155", background: "#0f172a",
              color: "white", boxSizing: "border-box",
            }}
          />
        </div>

        <h3 style={{ marginBottom: 10 }}>Wordlist Source</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={toggleStyle} onClick={() => setShowCustom(!showCustom)}>
            <div style={knobStyle}></div>
          </div>
          <span>{showCustom ? "Custom wordlist" : "Default wordlist"}</span>
        </div>

        {showCustom ? (
          <div style={{ marginBottom: 12 }}>
            <textarea
              value={customWords}
              onChange={(e) => setCustomWords(e.target.value)}
              placeholder={"admin\nlogin\nbackup\n.env"}
              rows={6}
              style={{
                width: "100%", padding: 10, borderRadius: 6,
                border: "1px solid #334155", background: "#0a0f1a",
                color: "#e2e8f0", fontFamily: "monospace", fontSize: 13,
                boxSizing: "border-box", resize: "vertical",
              }}
            />
            <p style={{ color: "#475569", fontSize: 12, marginTop: 4 }}>
              {customWords.trim()
                ? `${customWords.split("\n").filter(w => w.trim()).length} paths loaded`
                : "Enter one path per line"}
            </p>
          </div>
        ) : (
          <div style={{
            background: "#0f172a", padding: 10, borderRadius: 6,
            border: "1px solid #334155", marginBottom: 12, color: "#64748b", fontSize: 13,
          }}>
            {DEFAULT_WORDLIST.join(", ")}
          </div>
        )}

        <button className="btn btn-primary" onClick={runDirbust} disabled={loading}>
          {loading ? "Fuzzing Paths..." : "Start Scan"}
        </button>
      </Panel>

      {results && (
        <Panel>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
            <h3 style={{ margin: 0 }}>Results for {results.url}</h3>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[
                { key: "all", label: `All (${results.results.length})` },
                { key: "200", label: `200 OK (${statusCounts["200"] || 0})`, color: "#22c55e" },
                { key: "redirect", label: `Redirect (${statusCounts["redirect"] || 0})`, color: "#38bdf8" },
                { key: "forbidden", label: `403 (${statusCounts["forbidden"] || 0})`, color: "#facc15" },
                { key: "error", label: `Error (${statusCounts["error"] || 0})`, color: "#f97316" },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilterStatus(f.key)}
                  style={{
                    padding: "4px 10px", borderRadius: 4, fontSize: 12,
                    cursor: "pointer", border: "1px solid",
                    borderColor: filterStatus === f.key ? (f.color || "#38bdf8") : "#1e293b",
                    background: filterStatus === f.key ? "#0f172a" : "#020617",
                    color: filterStatus === f.key ? (f.color || "#38bdf8") : "#64748b",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filteredResults.length === 0 ? (
            <p style={{ color: "#64748b" }}>No results match this filter.</p>
          ) : (
            filteredResults.map((r, i) => (
              <div
                key={i}
                style={{
                  background: "#0f172a", padding: 12, borderRadius: 6,
                  marginBottom: 8,
                  borderLeft: `3px solid ${statusBorder(r.status)}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "monospace", color: "#e2e8f0", fontWeight: 600 }}>
                    /{r.path}
                  </span>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ color: statusColor(r.status), fontFamily: "monospace", fontSize: 13 }}>
                      {r.status}
                    </span>
                    <span style={{ color: "#475569", fontSize: 12 }}>
                      {r.length} bytes
                    </span>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#38bdf8", fontSize: 12 }}
                    >
                      ↗
                    </a>
                  </div>
                </div>
                {r.redirect && (
                  <div style={{ color: "#38bdf8", fontSize: 12, marginTop: 4 }}>
                    → {r.redirect}
                  </div>
                )}
              </div>
            ))
          )}
        </Panel>
      )}
    </div>
  );
}

function Targets({
  targets,
  hostInput,
  descInput,
  setHostInput,
  setDescInput,
  addTarget,
  deleteTarget,
}) {
  const [targetMode, setTargetMode] = useState("custom");  
  const [loadingIp, setLoadingIp] = useState(false);

  const handleModeChange = async (mode) => {
    setTargetMode(mode);
    if (mode === "self") {
      setLoadingIp(true);
      try {
        const res = await axios.get("https://api.ipify.org?format=json");
        setHostInput(res.data.ip);
        setDescInput("Local Perimeter (My Public IP)");
      } catch (err) {
        console.error("Failed to fetch public IP, using loopback:", err);
        setHostInput("127.0.0.1");
        setDescInput("Local Host Loopback (My Machine)");
      }
      setLoadingIp(false);
    } else {
      setHostInput("");
      setDescInput("");
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ borderBottom: "1px solid rgba(0, 255, 198, 0.1)", paddingBottom: 12, marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#38bdf8", textShadow: "0 0 12px rgba(56, 189, 248, 0.6)" }}>Target Configuration</h1>
        <p style={{ marginTop: 8, color: "#94a3b8", fontSize: 15 }}>Register and manage hosts in the target matrix.</p>
      </div>

      <Panel>
        <h3 style={{ fontSize: 14, color: "#00ffc6", fontFamily: "monospace", marginBottom: 16 }}>
          [▣] SELECT TARGET SCOPE
        </h3>

        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <button
            className="btn"
            type="button"
            style={{
              flex: 1,
              background: targetMode === "self" ? "rgba(0, 255, 198, 0.2)" : "#0f172a",
              border: targetMode === "self" ? "1px solid #00ffc6" : "1px solid #334155",
              color: targetMode === "self" ? "#00ffc6" : "#e2e8f0",
              padding: "12px",
              fontFamily: "monospace",
              fontSize: 13,
              boxShadow: targetMode === "self" ? "0 0 10px rgba(0, 255, 198, 0.2)" : "none",
            }}
            onClick={() => handleModeChange("self")}
            disabled={loadingIp}
          >
            {loadingIp ? "[<>] RESOLVING IP..." : "[@] MY NETWORK INTERFACE"}
          </button>

          <button
            className="btn"
            type="button"
            style={{
              flex: 1,
              background: targetMode === "custom" ? "rgba(124, 58, 237, 0.2)" : "#0f172a",
              border: targetMode === "custom" ? "1px solid #7c3aed" : "1px solid #334155",
              color: targetMode === "custom" ? "#b48eff" : "#e2e8f0",
              padding: "12px",
              fontFamily: "monospace",
              fontSize: 13,
              boxShadow: targetMode === "custom" ? "0 0 10px rgba(124, 58, 237, 0.2)" : "none",
            }}
            onClick={() => handleModeChange("custom")}
          >
            [⇄] CUSTOM TARGET DEFINITION
          </button>
        </div>

        <div style={{ opacity: targetMode === "self" ? 0.6 : 1, transition: "opacity 0.2s ease" }}>
          <label style={{ fontSize: 11, fontFamily: "monospace", color: "#94a3b8", display: "block", marginBottom: 6 }}>
            NETWORK INDICATOR / ADDRESS
          </label>
          <input
            placeholder="Host (e.g., 192.168.1.1 or example.com)"
            value={hostInput}
            onChange={(e) => setHostInput(e.target.value)}
            disabled={targetMode === "self"} 
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 16,
              borderRadius: 6,
              border: "1px solid #334155",
              background: "#0f172a",
              color: "white",
              fontFamily: "monospace"
            }}
          />

          <label style={{ fontSize: 11, fontFamily: "monospace", color: "#94a3b8", display: "block", marginBottom: 6 }}>
            SCOPE ATTACHED METADATA
          </label>
          <input
            placeholder="Description (optional)"
            value={descInput}
            onChange={(e) => setDescInput(e.target.value)}
            disabled={targetMode === "self"}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 20,
              borderRadius: 6,
              border: "1px solid #334155",
              background: "#0f172a",
              color: "white",
            }}
          />
        </div>

        <button 
          className="btn btn-primary" 
          onClick={addTarget}
          style={{ width: "100%", padding: "12px", fontWeight: "bold" }}
        >
          Initialize Target Into Scope
        </button>
      </Panel>

      {/* ACTIVE INVENTORY LIST */}
      <Panel>
        <h3 style={{ fontSize: 14, color: "#94a3b8", fontFamily: "monospace", marginBottom: 16 }}>
          [#] RETRIEVED ASSET INVENTORY
        </h3>
        {targets.length === 0 && <p style={{ opacity: 0.5, fontSize: 14, fontFamily: "monospace" }}>No assets currently targeted.</p>}
        {targets.map((t) => (
          <div
            key={t.id}
            style={{
              background: "#0f172a",
              padding: 14,
              borderRadius: 6,
              marginBottom: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderLeft: t.description?.includes("Public IP") ? "3px solid #00ffc6" : "3px solid #7c3aed"
            }}
          >
            <div>
              <strong style={{ fontFamily: "monospace", color: "#e2e8f0" }}>{t.host}</strong>
              {t.description && (
                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{t.description}</div>
              )}
            </div>
            <button className="btn btn-red" onClick={() => deleteTarget(t.id)} style={{ padding: "6px 12px", fontSize: 12 }}>
              Remove
            </button>
          </div>
        ))}
      </Panel>
    </div>
  );
}

function Scan({ targets, scanResult, scanTarget, startScan, updateScan, finishScan }) {
  
  const runScan = async (host) => {
    startScan("Initializing Scan...");
    updateScan(10);
    await new Promise(res => setTimeout(res, 300));

    updateScan(25);
    await new Promise(res => setTimeout(res, 300));

    updateScan(40);
    await new Promise(res => setTimeout(res, 300));

    try {
      updateScan(55);

      await scanTarget(host);

      updateScan(75);
      await new Promise(res => setTimeout(res, 350));

      finishScan("Scan Complete");

    } catch (err) {
      console.error("Scan error:", err);
      finishScan("Scan Failed");
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 32, marginBottom: 10, fontWeight: 700, color: "#38bdf8", textShadow: "0 0 12px rgba(56, 189, 248, 0.6)" }}>Scan</h1>

      <Panel>
        {targets.length === 0 && <p style={{ opacity: 0.7 }}>No targets to scan.</p>}
        {targets.map((t) => (
          <div
            key={t.id}
            style={{
              background: "#0f172a",
              padding: 12,
              borderRadius: 6,
              marginBottom: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <strong>{t.host}</strong>
            <button className="btn btn-green" onClick={() => runScan(t.host)}>
              Scan
            </button>
          </div>
        ))}
      </Panel>

      <Panel>
        {!scanResult && <p style={{ opacity: 0.7 }}>No scan yet.</p>}
        {scanResult && (
          <>
            <p>
              <strong>Host:</strong> {scanResult.host}
            </p>
            <p>
              <strong>Risk:</strong> {scanResult.risk_score}
            </p>
            <p>
              <strong>Open Ports:</strong>{" "}
              {scanResult.open_ports?.length
                ? scanResult.open_ports.join(", ")
                : "None"}
            </p>
            <p>
              <strong>Services:</strong>{" "}
              {scanResult.services?.length ? scanResult.services.join(", ") : "None"}
            </p>
          </>
        )}
      </Panel>
    </div>
  );
}


function Panel({ children }) {
  return <div className="panel">{children}</div>;
}

function Intel({ targets }) {
  const [intel, setIntel] = useState([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState("all");
  const [severity, setSeverity] = useState("all");

  const loadIntel = async (newOffset = 0) => {
	  if (selectedTarget === "all") {
		  setIntel([]);
		  setTotal(0);
		  return;
	  }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        limit: 10,
        offset: newOffset,
      });
      if (selectedTarget !== "all") params.append("target", selectedTarget);
      if (severity !== "all") params.append("severity", severity);

      const res = await axios.get(`${backend}/intel?${params.toString()}`);
      setIntel((prev) =>
        newOffset === 0 ? res.data.results : [...prev, ...res.data.results]
      );
      setTotal(res.data.count);
      setOffset(newOffset);
    } catch (err) {
      console.error("Intel load error:", err);
      setError("Failed to load threat intel — check the backend.");
    }
    setLoading(false);
  };

  useEffect(() => {
    setIntel([]);
    setOffset(0);
    loadIntel(0);
  }, [selectedTarget, severity]);

  const severityColor = (sev) => {
    const s = (sev || "").toUpperCase();
    if (s === "CRITICAL") return "#7c3aed";
    if (s === "HIGH") return "#ef4444";
    if (s === "MEDIUM") return "#f59e0b";
    if (s === "LOW") return "#10b981";
    return "#3b82f6";
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>

      <div style={{ borderBottom: "1px solid rgba(56,189,248,0.1)", paddingBottom: 12, marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#38bdf8", textShadow: "0 0 12px rgba(56, 189, 248, 0.6)" }}>
          Threat Intel Feed
        </h1>
        <p style={{ marginTop: 8, color: "#94a3b8", fontSize: 15 }}>Browse recent CVEs and filter by target or severity.</p>
      </div>

      <Panel>
        <div style={{ fontSize: 11, color: "#00ffc6", fontFamily: "monospace", marginBottom: 8, letterSpacing: 1 }}>
          [▣] FILTER BY TARGET
        </div>
        <select
          value={selectedTarget}
          onChange={(e) => setSelectedTarget(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #334155",
            background: "#0f172a",
            color: "white",
            fontFamily: "monospace",
            fontSize: 13,
            marginBottom: 14,
          }}
        >
          <option value="all" disabled>Select a Target</option>
          {targets?.map((t) => (
            <option key={t.id} value={t.host}>
              {t.host}{t.description ? " — " + t.description : ""}
            </option>
          ))}
        </select>

        <div style={{ fontSize: 11, color: "#00ffc6", fontFamily: "monospace", marginBottom: 8, letterSpacing: 1 }}>
          [▣] FILTER BY SEVERITY
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {["all", "critical", "high", "medium", "low"].map((s) => (
            <button
              key={s}
              onClick={() => setSeverity(s)}
              className="btn"
              style={{
                padding: "4px 14px",
                fontSize: 12,
                fontFamily: "monospace",
                textTransform: "uppercase",
                background: severity === s ? severityColor(s === "all" ? "info" : s) : "#1e293b",
                boxShadow: severity === s ? "0 0 8px " + severityColor(s === "all" ? "info" : s) + "66" : "none",
                border: "1px solid " + (severity === s ? severityColor(s === "all" ? "info" : s) : "#334155"),
                color: "white",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 24 }}>
          <div style={{ fontFamily: "monospace", fontSize: 13 }}>
            <span style={{ color: "#94a3b8" }}>LOADED </span>
            <span style={{ color: "#00ffc6", fontWeight: 700 }}>{intel.length}</span>
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 13 }}>
            <span style={{ color: "#94a3b8" }}>TOTAL </span>
            <span style={{ color: "#e2e8f0", fontWeight: 700 }}>{total}</span>
          </div>
        </div>
      </Panel>

      {error && (
        <div style={{ color: "#ef4444", fontFamily: "monospace", fontSize: 13, marginBottom: 16 }}>
          ⚠ {error}
        </div>
      )}

      <Panel>
        <div style={{ fontSize: 11, color: "#00ffc6", fontFamily: "monospace", marginBottom: 16, letterSpacing: 1 }}>
          [▣] VULNERABILITY REPORTS
        </div>

        {intel.filter(item => item.id !== null).length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontFamily: "monospace", fontSize: 20, color: "#334155", marginBottom: 8 }}>[ 0 RESULTS ]</div>
            <div style={{ color: "#64748b", fontFamily: "monospace", fontSize: 13 }}>
              No CVEs found for this target and filter.
            </div>
          </div>
        )}

        {intel.filter(item => item.id !== null).map((item, index) => {
          const color = severityColor(item.severity);
          return (
            <div
              key={item.id + "-" + index}
              style={{
                padding: "14px 16px",
                marginBottom: 12,
                background: "#0f172a",
                borderRadius: 6,
                borderLeft: "3px solid " + color,
                transition: "0.2s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontFamily: "monospace", fontSize: 13, color: "#00ffc6", fontWeight: 700 }}>
                  {item.id}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {item.cvss && (
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: "#94a3b8" }}>
                      CVSS {item.cvss}
                    </span>
                  )}
                  <span style={{
                    fontSize: 10,
                    fontFamily: "monospace",
                    padding: "2px 8px",
                    borderRadius: 4,
                    background: color + "22",
                    color: color,
                    border: "1px solid " + color + "55",
                    letterSpacing: 1,
                  }}>
                    {(item.severity || "INFO").toUpperCase()}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.5, marginBottom: 10 }}>
                {item.summary}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>
                  Published: {item.published}
                </div>
                <a href={item.href} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#7c3aed", fontFamily: "monospace", textDecoration: "none" }}>
                  View Details
                </a>
              </div>
            </div>
          );
        })}

        {(intel.length < total) && (
          <button
            className="btn btn-primary"
            onClick={() => loadIntel(offset + 10)}
            disabled={loading}
            style={{ width: "100%", marginTop: 8 }}
          >
            {loading ? "Loading..." : "Load More (" + intel.length + " / " + total + ")"}
          </button>
        )}

        {loading && intel.length === 0 && (
          <div style={{ color: "#64748b", fontFamily: "monospace", fontSize: 13, textAlign: "center", padding: 20 }}>
            Fetching threat intel...
          </div>
        )}
      </Panel>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{label}</div>
      <div
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: color || "white",
          fontFamily: "monospace",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function PasswordAnalyzer() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [genLength, setGenLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);

  const runAnalysis = async () => {
    if (!password.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${backend}/password/analyze`, { password });
      setResult(res.data);
    } catch (err) {
      console.error("Password analysis error:", err);
      setError("Analysis failed — check the backend and try again.");
    }
    setLoading(false);
  };

  const generatePassword = () => {
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let charset = lower;
    if (useUpper) charset += upper;
    if (useNumbers) charset += numbers;
    if (useSymbols) charset += symbols;

    let required = [lower[Math.floor(Math.random() * lower.length)]];
    if (useUpper) required.push(upper[Math.floor(Math.random() * upper.length)]);
    if (useNumbers) required.push(numbers[Math.floor(Math.random() * numbers.length)]);
    if (useSymbols) required.push(symbols[Math.floor(Math.random() * symbols.length)]);

    const rest = Array.from({ length: genLength - required.length }, () =>
      charset[Math.floor(Math.random() * charset.length)]
    );

    const combined = [...required, ...rest].sort(() => Math.random() - 0.5).join("");
    setGenerated(combined);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const useGenerated = () => {
    setPassword(generated);
    setResult(null);
  };

  const strengthColor = (score) => {
    switch (score) {
      case 1: return "#ef4444";
      case 2: return "#f97316";
      case 3: return "#eab308";
      case 4: return "#22c55e";
      case 5: return "#0ea5e9";
      default: return "#64748b";
    }
  };

  const inputStyle = {
    width: "100%",
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
  };

  const toggleStyle = (active) => ({
    padding: "4px 12px",
    fontSize: 12,
    borderRadius: 4,
    cursor: "pointer",
    border: "1px solid #334155",
    background: active ? "#7c3aed" : "#1e293b",
    boxShadow: active ? "0 0 8px rgba(124,58,237,0.4)" : "none",
    color: "white",
    textTransform: "uppercase",
    fontFamily: "monospace",
  });

  return (
    <div>
      <h1 style={{ fontSize: 32, marginBottom: 10, fontWeight: 700, color: "#38bdf8", textShadow: "0 0 12px rgba(56, 189, 248, 0.6)" }}>Password Analyzer / Generator</h1>
      <p style={{ marginBottom: 20, color: "#94a3b8", fontSize: 15 }}>Analyze password strength and check for known breach exposure.</p>

      {/* ── ANALYZER ── */}
      <Panel>
        <div style={{ fontSize: 11, color: "#00ffc6", fontFamily: "monospace", marginBottom: 8, letterSpacing: 1 }}>
          [▣] ANALYZE PASSWORD
        </div>

        <div style={{ position: "relative", marginBottom: 12 }}>
          <input
		  type={showPassword ? "text" : "password"}
		  placeholder="Enter password to analyze"
		  value={password}
		  onChange={(e) => { setPassword(e.target.value); setResult(null); }}
		  onKeyDown={(e) => e.key === "Enter" && !loading && runAnalysis()}
		  style={{ ...inputStyle, marginBottom: 0, paddingRight: 44, boxSizing: "border-box" }}
		  />
          <button
            onClick={() => setShowPassword((s) => !s)}
            style={{
              position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", color: "#94a3b8", cursor: "pointer",
              fontFamily: "monospace", fontSize: 13,
            }}
          >
            {showPassword ? "[hide]" : "[show]"}
          </button>
        </div>

        <button className="btn btn-primary" onClick={runAnalysis} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Password"}
        </button>

        {error && (
          <div style={{ marginTop: 12, color: "#ef4444", fontFamily: "monospace", fontSize: 13 }}>
            {error}
          </div>
        )}
      </Panel>

      {/* ── ANALYSIS RESULTS ── */}
      {result && (
        <Panel>
          <div style={{ fontSize: 11, color: "#00ffc6", fontFamily: "monospace", marginBottom: 12, letterSpacing: 1 }}>
            [▣] ANALYSIS RESULTS
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ marginBottom: 6, fontFamily: "monospace", fontSize: 13 }}>
              Strength:{" "}
              <span style={{ color: strengthColor(result.score), fontWeight: 700 }}>
                {result.strength}
              </span>
            </div>
            <div style={{ height: 10, borderRadius: 999, background: "#0f172a", overflow: "hidden", border: "1px solid #1e293b" }}>
              <div
                style={{
                  width: `${(result.score / 5) * 100}%`,
                  height: "100%",
                  background: strengthColor(result.score),
                  boxShadow: `0 0 10px ${strengthColor(result.score)}`,
                  transition: "width 0.4s ease-out",
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            {[
              { label: "Entropy", value: `${result.entropy_bits} bits` },
              { label: "Crack Time", value: result.crack_time },
              {
                label: "Breach Exposure",
                value: result.breached_count > 0
                  ? `${result.breached_count} known hits`
                  : "No known hits",
                color: result.breached_count > 0 ? "#ef4444" : "#10b981",
              },
              { label: "Score", value: `${result.score} / 5` },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: "#0f172a", padding: 10, borderRadius: 6, border: "1px solid #1e293b" }}>
                <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "monospace", marginBottom: 4 }}>{label.toUpperCase()}</div>
                <div style={{ fontWeight: 700, color: color || "#e2e8f0" }}>{value}</div>
              </div>
            ))}
          </div>

          {result.suggestions?.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: "#00ffc6", fontFamily: "monospace", marginBottom: 8, letterSpacing: 1 }}>
                [!] RECOMMENDATIONS
              </div>
              {result.suggestions.map((s, idx) => (
                <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: "#7c3aed", fontFamily: "monospace" }}>›</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      )}

      {/* ── GENERATOR ── */}
      <Panel>
        <div style={{ fontSize: 11, color: "#00ffc6", fontFamily: "monospace", marginBottom: 12, letterSpacing: 1 }}>
          [▣] PASSWORD GENERATOR
        </div>

        {/* Length slider */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
            <span>Length</span>
            <span style={{ fontFamily: "monospace", color: "#00ffc6", fontWeight: 700 }}>{genLength}</span>
          </div>
          <input
            type="range"
            min={8}
            max={64}
            value={genLength}
            onChange={(e) => setGenLength(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#7c3aed" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#64748b", fontFamily: "monospace" }}>
            <span>8</span><span>64</span>
          </div>
        </div>

        {/* Toggle options */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          <button style={toggleStyle(useUpper)} onClick={() => setUseUpper((s) => !s)}>Uppercase</button>
          <button style={toggleStyle(useNumbers)} onClick={() => setUseNumbers((s) => !s)}>Numbers</button>
          <button style={toggleStyle(useSymbols)} onClick={() => setUseSymbols((s) => !s)}>Symbols</button>
        </div>

        <button className="btn btn-primary" onClick={generatePassword} style={{ marginBottom: 12 }}>
          Generate Password
        </button>

        {/* Generated output */}
        {generated && (
          <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 6, padding: 12 }}>
            <div style={{ fontFamily: "monospace", fontSize: 14, wordBreak: "break-all", color: "#00ffc6", marginBottom: 10 }}>
              {generated}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn"
                onClick={handleCopy}
                style={{ background: copied ? "#10b981" : "#1e293b", fontSize: 12, padding: "4px 12px", transition: "background 0.2s" }}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                className="btn"
                onClick={useGenerated}
                style={{ background: "#1e293b", fontSize: 12, padding: "4px 12px" }}
              >
                Use for Analysis →
              </button>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}

function RemediationTracker({ tasks, setTasks, setActivePage }) {
  const [filter, setFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [newTitle, setNewTitle] = useState("");
  const [newHost, setNewHost] = useState("");
  const [newSeverity, setNewSeverity] = useState("MEDIUM");
  const [showAdd, setShowAdd] = useState(false);

  const severityColor = (sev) => {
    if (sev === "HIGH") return "#ef4444";
    if (sev === "MEDIUM") return "#f59e0b";
    if (sev === "LOW") return "#10b981";
    return "#3b82f6";
  };

  const sourceLabel = (source) => {
    if (source === "PORT_SCAN") return "PORT SCAN";
    if (source === "CVE_INTEL") return "CVE INTEL";
    return "MANUAL";
  };

  const sourceColor = (source) => {
    if (source === "PORT_SCAN") return "#3b82f6";
    if (source === "CVE_INTEL") return "#7c3aed";
    return "#00ffc6";
  };

  const addTask = () => {
    if (!newTitle.trim() || !newHost.trim()) return;
    setTasks(prev => [...prev, {
      id: `manual-${Date.now()}`,
      host: newHost.trim(),
      port: null,
      title: newTitle.trim(),
      severity: newSeverity,
      source: "MANUAL",
      done: false,
      date: new Date().toLocaleDateString(),
    }]);
    setNewTitle("");
    setNewHost("");
    setNewSeverity("MEDIUM");
    setShowAdd(false);
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const filtered = tasks
    .filter(t => {
      if (filter === "open") return !t.done;
      if (filter === "resolved") return t.done;
      return true;
    })
    .filter(t => {
      if (severityFilter !== "all") return t.severity === severityFilter;
      return true;
    })
    .sort((a, b) => {
      const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return (order[a.severity] ?? 3) - (order[b.severity] ?? 3);
    });

  const total = tasks.length;
  const resolved = tasks.filter(t => t.done).length;
  const progress = total === 0 ? 0 : Math.round((resolved / total) * 100);

  const inputStyle = {
    width: "100%",
    padding: 10,
    borderRadius: 6,
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    fontFamily: "monospace",
    fontSize: 13,
    marginBottom: 10,
    boxSizing: "border-box",
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ borderBottom: "1px solid rgba(56,189,248,0.1)", paddingBottom: 12, marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#38bdf8", textShadow: "0 0 12px rgba(56, 189, 248, 0.6)" }}>
          Remediation Matrix
        </h1>
        <p style={{ marginTop: 8, color: "#94a3b8", fontSize: 15 }}>Track and resolve vulnerabilities discovered during scanning.</p>
      </div>

      {/* Progress overview */}
      <Panel>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontFamily: "monospace", fontSize: 13 }}>
            <span style={{ color: "#94a3b8" }}>TOTAL </span>
            <span style={{ color: "#e2e8f0", fontWeight: 700 }}>{total}</span>
            <span style={{ color: "#94a3b8", marginLeft: 16 }}>OPEN </span>
            <span style={{ color: "#ef4444", fontWeight: 700 }}>{total - resolved}</span>
            <span style={{ color: "#94a3b8", marginLeft: 16 }}>RESOLVED </span>
            <span style={{ color: "#10b981", fontWeight: 700 }}>{resolved}</span>
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 13, color: "#00ffc6" }}>
            {progress}% MITIGATED
          </div>
        </div>
        <div style={{ height: 8, borderRadius: 999, background: "#1e293b", overflow: "hidden" }}>
          <div style={{
            width: progress + "%",
            height: "100%",
            background: progress === 100 ? "#10b981" : "#7c3aed",
            boxShadow: "0 0 10px rgba(124,58,237,0.4)",
            transition: "width 0.4s ease-out",
          }} />
        </div>

        {total === 0 && (
          <div style={{ marginTop: 12, color: "#64748b", fontFamily: "monospace", fontSize: 13 }}>
            No tasks yet — run a scan on a target to auto-generate remediation tasks.
          </div>
        )}
      </Panel>

      {/* Filters + add button */}
      <Panel>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace", width: "100%", marginBottom: 4 }}>STATUS</div>
          {["all", "open", "resolved"].map(f => (
            <button key={f} className="btn" onClick={() => setFilter(f)} style={{
              padding: "4px 12px", fontSize: 12, fontFamily: "monospace", textTransform: "uppercase",
              background: filter === f ? "#7c3aed" : "#1e293b",
              boxShadow: filter === f ? "0 0 8px rgba(124,58,237,0.4)" : "none",
              border: "1px solid " + (filter === f ? "#7c3aed" : "#334155"),
            }}>
              {f}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace", width: "100%", marginBottom: 4 }}>SEVERITY</div>
          {["all", "HIGH", "MEDIUM", "LOW"].map(s => (
            <button key={s} className="btn" onClick={() => setSeverityFilter(s)} style={{
              padding: "4px 12px", fontSize: 12, fontFamily: "monospace", textTransform: "uppercase",
              background: severityFilter === s ? severityColor(s) : "#1e293b",
              boxShadow: severityFilter === s ? "0 0 8px " + severityColor(s) + "66" : "none",
              border: "1px solid " + (severityFilter === s ? severityColor(s) : "#334155"),
            }}>
              {s}
            </button>
          ))}
        </div>
      </Panel>

      {/* Task list */}
      <Panel>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#00ffc6", fontFamily: "monospace", letterSpacing: 1 }}>
            [▣] ACTIVE VULNERABILITY QUEUE
          </div>
          <button
            className="btn"
            onClick={() => setShowAdd(s => !s)}
            style={{ fontSize: 12, padding: "4px 12px", background: showAdd ? "#1e293b" : "#7c3aed", boxShadow: showAdd ? "none" : "0 0 8px rgba(124,58,237,0.4)" }}
          >
            {showAdd ? "Cancel" : "+ Add Task"}
          </button>
        </div>

        {/* Add task form */}
        {showAdd && (
          <div style={{ background: "#0f172a", borderRadius: 6, padding: 14, marginBottom: 16, border: "1px solid #334155" }}>
            <div style={{ fontSize: 11, color: "#00ffc6", fontFamily: "monospace", marginBottom: 10, letterSpacing: 1 }}>
              [+] NEW TASK
            </div>
            <input placeholder="Target / Asset (e.g. example.com)" value={newHost} onChange={e => setNewHost(e.target.value)} style={inputStyle} />
            <input placeholder="Task description" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={inputStyle} />
            <select value={newSeverity} onChange={e => setNewSeverity(e.target.value)} style={inputStyle}>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
            <button className="btn btn-primary" onClick={addTask}>Add Task</button>
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{ color: "#64748b", fontFamily: "monospace", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
            No tasks match the current filter.
          </div>
        )}

        {filtered.map(t => (
          <div
            key={t.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              padding: "14px 18px",
              background: "#0f172a",
              marginBottom: 12,
              borderRadius: 6,
              borderLeft: "4px solid " + (t.done ? "#334155" : severityColor(t.severity)),
              opacity: t.done ? 0.5 : 1,
              transition: "0.2s ease",
            }}
          >
            <div style={{ flex: 1, marginRight: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                <span style={{
                  fontFamily: "monospace", fontSize: 10,
                  color: severityColor(t.severity),
                  background: severityColor(t.severity) + "22",
                  border: "1px solid " + severityColor(t.severity) + "55",
                  padding: "2px 6px", borderRadius: 4,
                }}>
                  {t.severity}
                </span>
                <span style={{
                  fontFamily: "monospace", fontSize: 10,
                  color: sourceColor(t.source),
                  background: sourceColor(t.source) + "22",
                  border: "1px solid " + sourceColor(t.source) + "55",
                  padding: "2px 6px", borderRadius: 4,
                }}>
                  {sourceLabel(t.source)}
                </span>
                <strong style={{ color: "#00ffc6", fontSize: 13, fontFamily: "monospace" }}>{t.host}</strong>
                {t.port && (
                  <span style={{ color: "#64748b", fontFamily: "monospace", fontSize: 11 }}>:PORT {t.port}</span>
                )}
              </div>

              <div style={{ color: "#e2e8f0", fontSize: 13, textDecoration: t.done ? "line-through" : "none", marginBottom: 6 }}>
                {t.title}
              </div>

              {t.source === "CVE_INTEL" && (
                <div
                  onClick={() => setActivePage("intel")}
                  style={{ color: "#7c3aed", fontFamily: "monospace", fontSize: 11, cursor: "pointer", display: "inline-block" }}
                >
                  → View in Threat Intel Feed
                </div>
              )}

              <div style={{ color: "#475569", fontFamily: "monospace", fontSize: 10, marginTop: 4 }}>
                Added: {t.date}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
              <button
                className="btn"
                style={{
                  background: t.done ? "#1e293b" : "#7c3aed",
                  boxShadow: t.done ? "none" : "0 0 10px rgba(124,58,237,0.4)",
                  padding: "5px 12px", fontSize: 12,
                }}
                onClick={() => toggleTask(t.id)}
              >
                {t.done ? "Reopen" : "Resolve"}
              </button>
              <button
                className="btn"
                style={{ background: "#1e293b", padding: "5px 12px", fontSize: 12, color: "#ef4444" }}
                onClick={() => deleteTask(t.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </Panel>
    </div>
  );
}

export default App;