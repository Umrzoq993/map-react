import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTree, fetchProfile } from "../api/orgUnits";

export default function DashboardStats() {
  const { data: tree } = useQuery({
    queryKey: ["orgTree"],
    queryFn: fetchTree,
  });
  const [orgId, setOrgId] = useState(null);

  const roots = useMemo(() => {
    if (!tree) return [];
    // rootlarni tanlab olamiz (parentId = null)
    const rs = [];
    const walk = (nodes) =>
      nodes.forEach((n) => {
        if (n.parentId == null) rs.push(n);
        if (n.children?.length) walk(n.children);
      });
    walk(tree);
    return rs;
  }, [tree]);

  useEffect(() => {
    if (!orgId && roots.length) setOrgId(roots[0].id);
  }, [roots, orgId]);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["orgProfile", orgId],
    queryFn: () => fetchProfile(orgId),
    enabled: !!orgId,
  });

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>

      <div style={{ marginBottom: 16 }}>
        <label>
          Bo‘linma:
          <select
            value={orgId || ""}
            onChange={(e) => setOrgId(parseInt(e.target.value))}
            style={{ marginLeft: 8 }}
          >
            {roots.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isLoading && <div>Yuklanmoqda…</div>}

      {profile && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(180px, 1fr))",
              gap: 16,
            }}
          >
            <StatCard
              title="Umumiy obyekt"
              value={profile.summary?.totals?.assets ?? 0}
            />
            <StatCard
              title="Umumiy maydon (m²)"
              value={Math.round(profile.summary?.totals?.area_m2 ?? 0)}
            />
            {/* Tiplar bo‘yicha 2-3 ta eng kattasini ko‘rsatamiz */}
            {profile.summary?.byType?.slice(0, 2).map((r, i) => (
              <StatCard key={i} title={`${r.type}`} value={`${r.count} ta`} />
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <h3>Tiplar bo‘yicha to‘liq taqsimot</h3>
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                maxWidth: 700,
              }}
            >
              <thead>
                <tr>
                  <th style={th}>Tur</th>
                  <th style={th}>Soni</th>
                  <th style={th}>Maydoni (m²)</th>
                </tr>
              </thead>
              <tbody>
                {(profile.summary?.byType ?? []).map((r, i) => (
                  <tr key={i}>
                    <td style={td}>{r.type}</td>
                    <td style={td}>{r.count}</td>
                    <td style={td}>{Math.round(r.area_m2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
      }}
    >
      <div style={{ color: "#666" }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
    </div>
  );
}
const th = {
  textAlign: "left",
  borderBottom: "1px solid #eee",
  padding: "8px 6px",
};
const td = { borderBottom: "1px solid #f2f2f2", padding: "6px" };
