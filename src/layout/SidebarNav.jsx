import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function SidebarNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ height: "100vh", borderRight: "1px solid #eee" }}>
      <Sidebar collapsed={collapsed} backgroundColor="#ffffff">
        <div
          style={{ padding: 12, display: "flex", alignItems: "center", gap: 8 }}
        >
          <button
            onClick={() => setCollapsed((v) => !v)}
            title="Collapse"
            style={{
              border: "1px solid #ddd",
              background: "#fff",
              borderRadius: 8,
              padding: "4px 8px",
              cursor: "pointer",
            }}
          >
            {collapsed ? "»" : "«"}
          </button>
          {!collapsed && <b>AgriMap</b>}
        </div>
        <Menu>
          <MenuItem
            active={pathname === "/dashboard"}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </MenuItem>
          <MenuItem
            active={pathname === "/map"}
            onClick={() => navigate("/map")}
          >
            Map
          </MenuItem>
        </Menu>
        {!collapsed && (
          <div
            style={{
              marginTop: "auto",
              padding: 12,
              fontSize: 12,
              color: "#666",
            }}
          >
            <div>© {new Date().getFullYear()} AgriMap</div>
          </div>
        )}
      </Sidebar>
    </div>
  );
}
