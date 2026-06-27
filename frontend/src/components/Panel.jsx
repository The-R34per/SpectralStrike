function Panel({ children }) {
  return (
    <div
      style={{
        background: "#0f172a",
        padding: 20,
        borderRadius: 8,
        marginBottom: 20,
        border: "1px solid #1e293b",
      }}
    >
      {children}
    </div>
  );
}

export default Panel;
