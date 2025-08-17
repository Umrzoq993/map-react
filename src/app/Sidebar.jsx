import { Sidebar, Menu, MenuItem, sidebarClasses } from "react-pro-sidebar";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchStats } from "../services/agri";
import { TYPE_LABELS } from "../constants/agriTypes";

export default function AppSidebar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [counts, setCounts] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const s = await fetchStats();
        setCounts(
          Object.fromEntries(
            Object.entries(s?.counts || {}).map(([k, v]) => [k, v?.count ?? 0])
          )
        );
      } catch (e) {
        /* jim */
      }
    })();
  }, []);

  return (
    <Sidebar
      rootStyles={{
        [`.${sidebarClasses.container}`]: {
          borderRight: "1px solid var(--border)",
          background: "var(--panel)",
        },
      }}
    >
      <div style={{ padding: 16, fontWeight: 700 }}>Agro Tashkilot</div>
      <Menu
        menuItemStyles={{
          button: ({ active }) => ({
            color: active ? "var(--text)" : "var(--muted)",
            background: active ? "var(--panel-2)" : "transparent",
            borderRadius: 10,
            margin: "4px 8px",
            padding: "10px 12px",
          }),
        }}
      >
        <MenuItem
          active={pathname === "/dashboard"}
          onClick={() => nav("/dashboard")}
        >
          Dashboard
        </MenuItem>
        <MenuItem active={pathname === "/map"} onClick={() => nav("/map")}>
          Xarita
        </MenuItem>
      </Menu>

      {/* Tur/son tez ko'rinish */}
      <div style={{ padding: 12, color: "var(--muted)", fontSize: 13 }}>
        {Object.entries(counts).map(([t, c]) => (
          <div
            key={t}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "4px 0",
            }}
          >
            <span>{TYPE_LABELS[t] || t}</span>
            <b style={{ color: "var(--text)" }}>{c}</b>
          </div>
        ))}
      </div>
    </Sidebar>
  );
}
