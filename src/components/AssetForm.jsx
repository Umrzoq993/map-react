import { useEffect, useState } from "react";
import AttributesEditor from "./AttributesEditor.jsx";

const TYPES = [
  "GREENHOUSE",
  "FISHPOND",
  "CHICKEN_COOP",
  "COWSHED",
  "STABLE",
  "OTHER",
];

export default function AssetForm({ defaults, onSubmit, onCancel }) {
  const [name, setName] = useState(defaults?.name || "");
  const [type, setType] = useState(defaults?.type || "GREENHOUSE");
  const [status, setStatus] = useState(defaults?.status || "ACTIVE");
  const [attributes, setAttributes] = useState(defaults?.attributes || {});
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [name, type, status, attributes]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nomi talab qilinadi");
      return;
    }
    if (!TYPES.includes(type)) {
      setError("Tur noto‘g‘ri");
      return;
    }
    onSubmit?.({ name: name.trim(), type, status, attributes });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
      <label>
        Nom:
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Issiqxona-1"
        />
      </label>
      <label>
        Tur:
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <label>
        Status:
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>ACTIVE</option>
          <option>INACTIVE</option>
        </select>
      </label>
      <div>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>Attributes</div>
        <AttributesEditor value={attributes} onChange={setAttributes} />
      </div>
      {error && <div style={{ color: "#ef4444" }}>{error}</div>}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button type="button" onClick={onCancel} style={btnGhost}>
          Cancel
        </button>
        <button type="submit" style={btnPrimary}>
          Save
        </button>
      </div>
    </form>
  );
}
const btnPrimary = {
  padding: "8px 12px",
  border: "1px solid #0ea5e9",
  background: "#0ea5e9",
  color: "#fff",
  borderRadius: 8,
  cursor: "pointer",
};
const btnGhost = {
  padding: "8px 12px",
  border: "1px solid #ddd",
  background: "#fff",
  borderRadius: 8,
  cursor: "pointer",
};
