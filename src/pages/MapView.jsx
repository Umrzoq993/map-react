import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MapContainer } from "react-leaflet";
import { fetchTree, fetchProfile, fetchAssets } from "../api/orgUnits";
import { createAsset, updateAsset, deleteAsset } from "../api/assets";
import OrgTree from "../components/OrgTree.jsx";
import OrgMap from "../components/OrgMap.jsx";
import Modal from "../components/Modal.jsx";
import AssetForm from "../components/AssetForm.jsx";

const ASSET_TYPES = [
  "GREENHOUSE",
  "FISHPOND",
  "CHICKEN_COOP",
  "COWSHED",
  "STABLE",
  "OTHER",
];

export default function MapView() {
  const qc = useQueryClient();
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [bbox, setBbox] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const pendingGeomRef = useRef(null);
  const bboxTimer = useRef(null);

  const { data: tree } = useQuery({
    queryKey: ["orgTree"],
    queryFn: fetchTree,
  });
  const { data: profile } = useQuery({
    queryKey: ["orgProfile", selectedOrg],
    queryFn: () => fetchProfile(selectedOrg),
    enabled: !!selectedOrg,
  });
  const { data: assets, isFetching: assetsLoading } = useQuery({
    queryKey: ["orgAssets", selectedOrg, selectedType, bbox],
    queryFn: () => fetchAssets({ id: selectedOrg, type: selectedType, bbox }),
    enabled: !!selectedOrg,
  });

  function handleBoundsChange(b) {
    if (bboxTimer.current) clearTimeout(bboxTimer.current);
    bboxTimer.current = setTimeout(() => setBbox(b), 300);
  }
  function handlePolygonCreated(geometry) {
    pendingGeomRef.current = geometry;
    setCreateOpen(true);
  }
  async function submitCreate(form) {
    if (!selectedOrg || !pendingGeomRef.current) return;
    const footprintGeoJson = JSON.stringify(pendingGeomRef.current);
    await createAsset({ orgUnitId: selectedOrg, ...form, footprintGeoJson });
    setCreateOpen(false);
    pendingGeomRef.current = null;
    qc.invalidateQueries({ queryKey: ["orgAssets", selectedOrg] });
    qc.invalidateQueries({ queryKey: ["orgProfile", selectedOrg] });
  }
  async function submitEdit(form) {
    if (!selectedAsset?.id) return;
    await updateAsset(selectedAsset.id, form);
    setEditOpen(false);
    qc.invalidateQueries({ queryKey: ["orgAssets", selectedOrg] });
    qc.invalidateQueries({ queryKey: ["orgProfile", selectedOrg] });
  }
  async function handleDelete() {
    if (!selectedAsset?.id) return;
    if (!confirm("Haqiqatan o‘chirilsinmi?")) return;
    await deleteAsset(selectedAsset.id);
    setSelectedAsset(null);
    qc.invalidateQueries({ queryKey: ["orgAssets", selectedOrg] });
    qc.invalidateQueries({ queryKey: ["orgProfile", selectedOrg] });
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "280px 1fr 340px",
        height: "100vh",
      }}
    >
      <aside
        style={{ overflow: "auto", borderRight: "1px solid #eee", padding: 12 }}
      >
        <h3 style={{ marginTop: 0 }}>Bo‘linmalar</h3>
        {tree && (
          <OrgTree
            tree={tree}
            onSelect={(id) => {
              setSelectedOrg(id);
              setSelectedAsset(null);
            }}
          />
        )}
      </aside>

      <main style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 1000,
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            background: "rgba(255,255,255,.9)",
            padding: 8,
            borderRadius: 12,
            boxShadow: "0 4px 16px rgba(0,0,0,.15)",
          }}
        >
          <button
            onClick={() => setSelectedType(null)}
            style={chip(selectedType === null)}
          >
            All
          </button>
          {ASSET_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType((prev) => (prev === t ? null : t))}
              style={chip(selectedType === t)}
            >
              {t}
            </button>
          ))}
          {assetsLoading && (
            <span style={{ marginLeft: 8, fontSize: 12, color: "#666" }}>
              loading…
            </span>
          )}
          {selectedOrg && (
            <span style={{ marginLeft: 8, fontSize: 12, color: "#0ea5e9" }}>
              ✍️ Poligon chizib yangi obyekt qo‘shing
            </span>
          )}
        </div>

        <MapContainer
          center={[41.3, 69.2]}
          zoom={10}
          style={{ height: "100%", width: "100%" }}
        >
          <OrgMap
            assets={assets}
            orgBoundaryGeoJson={profile?.boundaryGeoJson}
            enableDraw={!!selectedOrg}
            onFeatureClick={setSelectedAsset}
            onPolygonCreated={handlePolygonCreated}
            onBoundsChange={handleBoundsChange}
          />
        </MapContainer>
      </main>

      <aside
        style={{ borderLeft: "1px solid #eee", padding: 16, overflow: "auto" }}
      >
        {profile ? (
          <>
            <h2 style={{ margin: 0 }}>{profile.name}</h2>
            <div style={{ color: "#666", marginBottom: 12 }}>
              {profile.type}
            </div>
            <h3>Summary</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <div style={card}>
                <div>Umumiy obyekt</div>
                <b>{profile.summary?.totals?.assets ?? 0}</b>
              </div>
              <div style={card}>
                <div>Umumiy maydon (m²)</div>
                <b>{Math.round(profile.summary?.totals?.area_m2 ?? 0)}</b>
              </div>
            </div>
            <ul>
              {profile.summary?.byType?.map((r, i) => (
                <li key={i}>
                  {r.type}: {r.count} ta
                </li>
              ))}
            </ul>
            <hr />
            <h3>Tanlangan obyekt</h3>
            {selectedAsset ? (
              <>
                <div>
                  <b>{selectedAsset.name}</b>
                </div>
                <div style={{ color: "#666" }}>
                  {selectedAsset.type} • status: {selectedAsset.status}
                </div>
                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  <button onClick={() => setEditOpen(true)} style={btnPrimary}>
                    Edit
                  </button>
                  <button onClick={handleDelete} style={btnDanger}>
                    Delete
                  </button>
                </div>
                <pre style={{ whiteSpace: "pre-wrap", marginTop: 12 }}>
                  {JSON.stringify(selectedAsset, null, 2)}
                </pre>
              </>
            ) : (
              <div>Obyekt ustiga bosing.</div>
            )}
          </>
        ) : (
          <div>Bo‘linma tanlang.</div>
        )}
      </aside>

      {/* CREATE MODAL */}
      <Modal
        open={createOpen}
        title="Yangi obyekt"
        onClose={() => {
          setCreateOpen(false);
          pendingGeomRef.current = null;
        }}
      >
        <AssetForm
          defaults={{
            type: selectedType || "GREENHOUSE",
            status: "ACTIVE",
            attributes: {},
          }}
          onSubmit={submitCreate}
          onCancel={() => {
            setCreateOpen(false);
            pendingGeomRef.current = null;
          }}
        />
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        open={editOpen}
        title="Obyektni tahrirlash"
        onClose={() => setEditOpen(false)}
      >
        <AssetForm
          defaults={selectedAsset || {}}
          onSubmit={submitEdit}
          onCancel={() => setEditOpen(false)}
        />
      </Modal>
    </div>
  );
}

const card = {
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: "10px 12px",
};
const chip = (active) => ({
  padding: "6px 10px",
  borderRadius: 999,
  border: "1px solid #ddd",
  background: active ? "#0ea5e9" : "white",
  color: active ? "white" : "#111",
  cursor: "pointer",
});
const btnPrimary = {
  padding: "6px 10px",
  border: "1px solid #0ea5e9",
  background: "#0ea5e9",
  color: "#fff",
  borderRadius: 8,
  cursor: "pointer",
};
const btnDanger = {
  padding: "6px 10px",
  border: "1px solid #ef4444",
  background: "#ef4444",
  color: "#fff",
  borderRadius: 8,
  cursor: "pointer",
};
