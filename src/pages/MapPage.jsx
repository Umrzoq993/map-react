import { useEffect, useMemo, useState } from "react";
import { MapContainer, GeoJSON, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchFeatures, fetchTypes } from "../services/agri";
import {
  TYPE_COLORS,
  TYPE_LABELS,
  fallbackColor,
  fallbackLabel,
} from "../constants/agriTypes";
import { sqmToGa } from "../utils/area";
import AgriTileLayer from "../components/AgriTileLayer";

function FitToFeatures({ fc }) {
  const map = useMap();
  useEffect(() => {
    try {
      if (!fc?.features?.length) return;
      const bounds = [];
      fc.features.forEach((f) => {
        const g = f.geometry;
        if (!g) return;
        if (g.type === "Point") {
          bounds.push([g.coordinates[1], g.coordinates[0]]);
        } else if (g.type === "Polygon" || g.type === "MultiPolygon") {
          const pushCoord = (coords) =>
            coords.forEach((c) => {
              if (Array.isArray(c[0])) pushCoord(c);
              else bounds.push([c[1], c[0]]);
            });
          pushCoord(g.coordinates);
        }
      });
      if (!bounds.length) return;
      map.fitBounds(bounds, { padding: [20, 20] });
    } catch (e) {
      console.warn("fit bounds error", e);
    }
  }, [fc, map]);
  return null;
}

export default function MapPage() {
  const [types, setTypes] = useState([]);
  const [active, setActive] = useState([]); // tanlangan turlar
  const [fc, setFc] = useState(null);
  const [loading, setLoading] = useState(false);

  // turlarni yuklash
  useEffect(() => {
    (async () => {
      const t = await fetchTypes();
      setTypes(t);
      setActive(t); // default: hammasi yoqilgan
    })();
  }, []);

  // features yuklash
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchFeatures({ types: active });
        setFc(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [active]);

  const styleFn = useMemo(
    () => (feature) => {
      const t = feature?.properties?.t || feature?.properties?.type;
      const color = TYPE_COLORS[t] || fallbackColor;
      return {
        color,
        weight: 2,
        opacity: 0.9,
        fillColor: color,
        fillOpacity: 0.2,
      };
    },
    []
  );

  const onEach = (feature, layer) => {
    const p = feature.properties || {};
    const t = p.t || p.type;
    const name = p.name || p.title || `#${p.id || "?"}`;
    const areaGa = p.areaGa ?? (p.areaSqm ? sqmToGa(p.areaSqm) : undefined);
    const label = TYPE_LABELS[t] || fallbackLabel;
    const html = `
      <div>
        <div style="font-weight:700">${name}</div>
        <div>Turi: ${label}</div>
        ${areaGa ? `<div>Hudud: ${areaGa.toFixed(2)} ga</div>` : ""}
        ${p.address ? `<div>Manzil: ${p.address}</div>` : ""}
      </div>
    `;
    layer.bindPopup(html);
  };

  return (
    <div className="panel" style={{ height: "calc(100dvh - 64px - 40px)" }}>
      {/* Filter chips */}
      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}
      >
        {types.map((t) => {
          const activeOn = active.includes(t);
          return (
            <button
              key={t}
              onClick={() =>
                setActive((prev) =>
                  prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                )
              }
              style={{
                background: activeOn ? "var(--panel-2)" : "transparent",
                border: `1px solid ${TYPE_COLORS[t] || fallbackColor}`,
                color: "var(--text)",
                borderRadius: 999,
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              {TYPE_LABELS[t] || t}
            </button>
          );
        })}
      </div>

      <div style={{ position: "relative", height: "100%" }}>
        {loading && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 1000,
              background: "var(--panel-2)",
              border: "1px solid var(--border)",
              padding: "6px 10px",
              borderRadius: 8,
            }}
          >
            Yuklanmoqda...
          </div>
        )}

        <MapContainer
          center={[41.3, 69.25]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <AgriTileLayer />
          {fc && <GeoJSON data={fc} style={styleFn} onEachFeature={onEach} />}
          <FitToFeatures fc={fc} />
        </MapContainer>

        {/* Legenda */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            zIndex: 1000,
            background: "var(--panel)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 12,
            minWidth: 200,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Legenda</div>
          <div style={{ display: "grid", gap: 6 }}>
            {(types.length ? types : Object.keys(TYPE_LABELS)).map((t) => {
              const color = TYPE_COLORS[t] || fallbackColor;
              return (
                <div
                  key={t}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 3,
                      background: color,
                      display: "inline-block",
                    }}
                  />
                  <span style={{ opacity: 0.9 }}>{TYPE_LABELS[t] || t}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
