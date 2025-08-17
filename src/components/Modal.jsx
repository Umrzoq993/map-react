export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div style={backdrop} onClick={onClose}>
      <div style={sheet} onClick={(e) => e.stopPropagation()}>
        <div style={header}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={xbtn}>
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
const backdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000,
};
const sheet = {
  width: 520,
  maxWidth: "90vw",
  background: "#fff",
  borderRadius: 12,
  padding: 16,
  boxShadow: "0 12px 40px rgba(0,0,0,.3)",
};
const header = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 12,
};
const xbtn = {
  border: "none",
  background: "transparent",
  fontSize: 18,
  cursor: "pointer",
};
