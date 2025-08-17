import { Search, Moon, Sun } from "lucide-react";
import { useMemo, useState } from "react";

export default function Header() {
  const [dark, setDark] = useState(true);
  const title = useMemo(() => {
    const path = location.pathname.replace("/", "");
    return path ? path.charAt(0).toUpperCase() + path.slice(1) : "Dashboard";
  }, [location.pathname]);

  return (
    <header className="header">
      <div className="brand">{title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="search">
          <Search size={16} />
          <input placeholder="Qidirish..." />
        </div>
        <button
          onClick={() => setDark((v) => !v)}
          title="Theme toggle"
          style={{
            background: "var(--panel-2)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "8px 10px",
            cursor: "pointer",
          }}
        >
          {dark ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </header>
  );
}
