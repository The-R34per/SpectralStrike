const GlobalProgressBar = ({ active, percent, label }) => {
  if (!active) return null;

  return (
    <div style={{
      width: "100%",
      marginTop: 8,
      marginBottom: 8,
    }}>
      <div style={{
        fontSize: 12,
        color: "#7dd3fc",
        marginBottom: 4,
        textShadow: "0 0 6px #0ea5e9",
      }}>
        {label} — {percent}%
      </div>

      <div style={{
        width: "100%",
        height: 6,
        background: "rgba(255,255,255,0.08)",
        borderRadius: 4,
        overflow: "hidden",
      }}>
        <div style={{
          width: `${percent}%`,
          height: "100%",
          background: "linear-gradient(90deg, #0ea5e9, #38bdf8)",
          boxShadow: "0 0 12px #38bdf8",
          transition: "width 0.15s linear",
        }} />
      </div>
    </div>
  );
};

export default GlobalProgressBar;
