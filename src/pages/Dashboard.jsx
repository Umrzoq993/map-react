import { useEffect, useState } from "react";
import { fetchStats } from "../services/agri";
import { TYPE_LABELS } from "../constants/agriTypes";

const StatCard = ({ label, value, area }) => (
  <div className="card">
    <div className="label">{label}</div>
    <div className="value">{value?.toLocaleString?.() ?? value} ta</div>
    <div className="trend">Hudud: {area?.toFixed?.(2)} ga</div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchStats();
        setStats(data);
      } catch (e) {
        setErr("Statistikani yuklab bo‘lmadi");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="panel">Yuklanmoqda...</div>;
  if (err) return <div className="panel">{err}</div>;
  if (!stats) return <div className="panel">Ma’lumot topilmadi</div>;

  const entries = Object.entries(stats.counts || {}); // { GREENHOUSE: {count, areaGa}, ... }

  return (
    <>
      <div className="cards">
        {entries.map(([type, v]) => (
          <StatCard
            key={type}
            label={TYPE_LABELS[type] || type}
            value={v?.count ?? 0}
            area={v?.areaGa ?? 0}
          />
        ))}
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <b>Umumiy yer maydoni:</b> {stats.totalAreaGa?.toFixed?.(2)} ga
      </div>
    </>
  );
}
