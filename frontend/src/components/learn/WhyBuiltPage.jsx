import Panel from "../Panel.jsx";

const TIMELINE = [
  {
    label: "// origin",
    heading: "The OwlSec competition",
    body: "SpectralStrike was created as an entry for an internal competition within the OwlSec community. The brief demanded something genuinely useful — a project that could stand on its own, not just something thrown together to check a box.",
  },
  {
    label: "// the problem",
    heading: "The on-ramp is brutal",
    body: "Getting into cybersecurity and red teaming is hard — not because the concepts are impossible, but because existing resources either assume too much, or dump you in the deep end with no guidance. SpectralStrike was built to fix that.",
  },
  {
    label: "// the shift",
    heading: "Potential too big to ignore",
    body: "Midway through the competition, it became clear this was more than a submission. The gap it was filling was real, and the people who needed it deserved something that actually worked — so scope expanded, and the build kept going.",
  },
  {
    label: "// now",
    heading: "A platform with staying power",
    body: "SpectralStrike is no longer just a competition project. It's a platform with a clear purpose: give beginners entering the cybersecurity space a clean, approachable, genuinely hands-on way in.",
  },
];

function WhyBuiltPage({ setActivePage }) {
  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <button onClick={() => setActivePage("learn")} style={backStyle}>
        ← Back
      </button>

      <h1 style={titleStyle}>Why SpectralStrike Was Built</h1>
      <p style={subtitleStyle}>Built for a competition. Stayed for a reason.</p>

      <Panel>
        <h3 style={headingStyle}>The Origin</h3>
        <p style={bodyStyle}>
          SpectralStrike didn't start as a grand plan. It started as a competition
          entry for the OwlSec community — a focused, scrappy build under real time
          pressure. But somewhere in that process, the potential became impossible
          to ignore.
        </p>
      </Panel>

      {/* Timeline */}
      <Panel>
        <h3 style={headingStyle}>How It Got Here</h3>
        <div style={timelineWrap}>
          {TIMELINE.map((item, i) => (
            <div key={item.heading} style={timelineItem}>
              {/* Line + dot */}
              <div style={timelineLeft}>
                <div style={dot} />
                {i < TIMELINE.length - 1 && <div style={line} />}
              </div>
              {/* Content */}
              <div style={timelineContent}>
                <p style={timelineLabel}>{item.label}</p>
                <h4 style={timelineHeading}>{item.heading}</h4>
                <p style={timelineBody}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <h3 style={headingStyle}>In Their Own Words</h3>
        <div style={quoteBlock}>
          <p style={quoteText}>
            "I saw the potential in it and kept building — because the problem it
            solves is real, and the people who need it deserve something that
            actually works."
          </p>
          <p style={quoteAuthor}>
            — The creator, on expanding SpectralStrike beyond the competition
          </p>
        </div>
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
  fontSize: 36,
  fontWeight: 700,
  color: "#00ffc6",
  textShadow: "0 0 12px rgba(0,255,198,0.6)",
  marginBottom: 8,
};

const subtitleStyle = {
  color: "#94a3b8",
  fontSize: 16,
  marginBottom: 28,
};

const headingStyle = {
  color: "#e2e8f0",
  marginBottom: 16,
};

const bodyStyle = {
  color: "#94a3b8",
  fontSize: 15,
  lineHeight: 1.75,
  marginBottom: 0,
};

const timelineWrap = { display: "flex", flexDirection: "column" };

const timelineItem = {
  display: "flex",
  gap: 16,
  marginBottom: 0,
};

const timelineLeft = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: 16,
  flexShrink: 0,
};

const dot = {
  width: 10,
  height: 10,
  borderRadius: "50%",
  background: "#0a0f1f",
  border: "2px solid #00ffc6",
  boxShadow: "0 0 8px rgba(0,255,198,0.6)",
  flexShrink: 0,
  marginTop: 4,
};

const line = {
  width: 1,
  flex: 1,
  background: "linear-gradient(to bottom, rgba(0,255,198,0.5), rgba(124,58,237,0.2))",
  margin: "4px 0",
  minHeight: 24,
};

const timelineContent = {
  paddingBottom: 28,
  flex: 1,
};

const timelineLabel = {
  fontFamily: "'Courier New', monospace",
  fontSize: 11,
  letterSpacing: "0.1em",
  color: "#00ffc6",
  textTransform: "uppercase",
  opacity: 0.7,
  marginBottom: 4,
};

const timelineHeading = {
  fontSize: 15,
  fontWeight: 600,
  color: "#e2e8f0",
  marginBottom: 6,
};

const timelineBody = {
  fontSize: 14,
  lineHeight: 1.7,
  color: "#94a3b8",
};

const quoteBlock = {
  borderLeft: "2px solid #00ffc6",
  paddingLeft: 20,
  background: "rgba(0,255,198,0.04)",
  borderRadius: "0 8px 8px 0",
  padding: "16px 20px",
};

const quoteText = {
  fontSize: 15,
  lineHeight: 1.75,
  color: "#e2e8f0",
  fontStyle: "italic",
  marginBottom: 10,
};

const quoteAuthor = {
  fontFamily: "'Courier New', monospace",
  fontSize: 11,
  color: "#94a3b8",
  opacity: 0.6,
};

export default WhyBuiltPage;
