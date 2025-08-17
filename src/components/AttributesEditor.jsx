import { useState } from "react";

export default function AttributesEditor({ value, onChange }) {
  const [rows, setRows] = useState(() => {
    if (!value) return [];
    return Object.entries(value).map(([k, v]) => ({ key: k, val: String(v) }));
  });

  function emit(next) {
    const obj = {};
    next.forEach(({ key, val }) => {
      if (key) obj[key] = parseVal(val);
    });
    onChange?.(obj);
  }
  const parseVal = (v) => {
    if (v === "true") return true;
    if (v === "false") return false;
    if (!isNaN(Number(v)) && v.trim() !== "") return Number(v);
    return v;
  };

  function addRow() {
    const next = [...rows, { key: "", val: "" }];
    setRows(next);
    emit(next);
  }
  function removeRow(i) {
    const next = rows.slice();
    next.splice(i, 1);
    setRows(next);
    emit(next);
  }
  function updateRow(i, field, value) {
    const next = rows.slice();
    next[i] = { ...next[i], [field]: value };
    setRows(next);
    emit(next);
  }

  return (
    <div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 60px", gap: 8 }}
      >
        <b>Key</b>
        <b>Value</b>
        <span />
        {rows.map((r, i) => (
          <FragmentRow key={i}>
            <input
              value={r.key}
              onChange={(e) => updateRow(i, "key", e.target.value)}
              placeholder="masalan: capacity"
            />
            <input
              value={r.val}
              onChange={(e) => updateRow(i, "val", e.target.value)}
              placeholder="1200"
            />
            <button onClick={() => removeRow(i)} style={rm}>
              −
            </button>
          </FragmentRow>
        ))}
      </div>
      <button onClick={addRow} style={add}>
        + Add attribute
      </button>
    </div>
  );
}
function FragmentRow({ children }) {
  return <div style={{ display: "contents" }}>{children}</div>;
}
const add = {
  marginTop: 8,
  padding: "6px 10px",
  border: "1px solid #ddd",
  background: "#fff",
  borderRadius: 8,
  cursor: "pointer",
};
const rm = {
  padding: "6px 10px",
  border: "1px solid #ef4444",
  background: "#ef4444",
  color: "#fff",
  borderRadius: 8,
  cursor: "pointer",
};
