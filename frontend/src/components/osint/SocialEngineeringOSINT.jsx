import { useState } from "react";

function SocialEngineeringOSINT() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [profile, setProfile] = useState(null);

  const runSocialRecon = () => {
    setProfile({
      name,
      company,
      role,
      risks: [
        "High LinkedIn presence",
        "Public email address",
        "Mentions internal tools on social media",
      ],
      suggestions: [
        "Phishing via corporate email",
        "Pretext as internal IT support",
      ],
    });
  };

  return (
    <div>
      <h2 style={{ marginBottom: 10 }}>Social Engineering Recon</h2>
      <p style={{ marginBottom: 16, color: "#94a3b8" }}>
        Build a target profile and identify human‑layer weaknesses.
      </p>

      <div style={{ marginBottom: 10 }}>
        <label style={{ display: "block", marginBottom: 6 }}>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ display: "block", marginBottom: 6 }}>Company</label>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Acme Corp"
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 6 }}>Role</label>
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Systems Administrator"
          style={inputStyle}
        />
      </div>

      <button
        onClick={runSocialRecon}
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
        Build Target Profile
      </button>

      {profile && (
        <div style={{ marginTop: 10 }}>
          <h3 style={{ marginBottom: 8 }}>Target Profile</h3>
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Company:</strong> {profile.company}
          </p>
          <p>
            <strong>Role:</strong> {profile.role}
          </p>

          <h3 style={{ marginTop: 12, marginBottom: 8 }}>Identified Risks</h3>
          <ul>
            {profile.risks.map((r, i) => (
              <li key={i} style={{ color: "#f97316" }}>{r}</li>
            ))}
          </ul>

          <h3 style={{ marginTop: 12, marginBottom: 8 }}>Potential Attack Vectors</h3>
          <ul>
            {profile.suggestions.map((s, i) => (
              <li key={i} style={{ color: "#e2e8f0" }}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #1e293b",
  background: "#020617",
  color: "#e2e8f0",
};

export default SocialEngineeringOSINT;
