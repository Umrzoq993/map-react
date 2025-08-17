import { TileLayer, GeoJSON, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import L from "leaflet";
import "leaflet-draw";

function parseMaybeJson(g) {
  if (typeof g === "string") {
    try {
      return JSON.parse(g);
    } catch {}
  }
  return g;
}
function normalizeFC(fc) {
  if (!fc?.features) return fc;
  return {
    ...fc,
    features: fc.features.map((f) => ({
      ...f,
      geometry: parseMaybeJson(f.geometry),
    })),
  };
}
function toFeature(geometry, properties = {}) {
  if (!geometry) return null;
  return { type: "Feature", geometry: parseMaybeJson(geometry), properties };
}

function FitToData({ data, boundary }) {
  const map = useMap();
  useEffect(() => {
    const layers = [];
    if (boundary) layers.push(L.geoJSON(boundary));
    if (data?.features?.length) layers.push(L.geoJSON(data));
    if (!layers.length) return;
    const group = L.featureGroup(layers);
    const b = group.getBounds();
    if (b.isValid()) map.fitBounds(b.pad(0.2));
  }, [data, boundary, map]);
  return null;
}

function BoundsWatcher({ onBoundsChange }) {
  useMapEvents({
    moveend(e) {
      const b = e.target.getBounds();
      const sw = b.getSouthWest(),
        ne = b.getNorthEast();
      onBoundsChange?.([sw.lng, sw.lat, ne.lng, ne.lat]);
    },
  });
  return null;
}

export default function OrgMap({
  assets,
  orgBoundaryGeoJson,
  onFeatureClick,
  enableDraw,
  onPolygonCreated,
  onBoundsChange,
}) {
  const data = useMemo(() => normalizeFC(assets), [assets]);
  const boundaryFeature = useMemo(
    () => toFeature(orgBoundaryGeoJson, { layer: "boundary" }),
    [orgBoundaryGeoJson]
  );
  const boundaryFC = boundaryFeature
    ? { type: "FeatureCollection", features: [boundaryFeature] }
    : null;

  const map = useMap();
  useEffect(() => {
    if (!enableDraw) return;
    const drawControl = new L.Control.Draw({
      draw: {
        polygon: { allowIntersection: false, showArea: true },
        rectangle: false,
        marker: false,
        circle: false,
        polyline: false,
        circlemarker: false,
      },
    });
    map.addControl(drawControl);
    const onCreated = (e) => {
      const gj = e.layer.toGeoJSON();
      onPolygonCreated?.(gj.geometry);
      e.layer.addTo(map);
    };
    map.on(L.Draw.Event.CREATED, onCreated);
    return () => {
      map.off(L.Draw.Event.CREATED, onCreated);
      map.removeControl(drawControl);
    };
  }, [map, enableDraw, onPolygonCreated]);

  const styleFor = (feature) => {
    const t = feature?.properties?.type || "OTHER";
    const colors = {
      GREENHOUSE: "#10b981",
      FISHPOND: "#3b82f6",
      CHICKEN_COOP: "#f59e0b",
      COWSHED: "#ef4444",
      STABLE: "#8b5cf6",
      OTHER: "#64748b",
    };
    return { color: colors[t] || colors.OTHER, weight: 2, fillOpacity: 0.25 };
  };
  const boundaryStyle = {
    color: "#111827",
    weight: 2,
    fillOpacity: 0,
    dashArray: "6,4",
  };

  const onEach = (feature, layer) => {
    if (feature?.properties?.layer === "boundary") return; // klik emas
    layer.on({
      click: () => onFeatureClick?.(feature.properties),
      mouseover: function () {
        this.setStyle({ weight: 3, fillOpacity: 0.35 });
      },
      mouseout: function () {
        this.setStyle({ weight: 2, fillOpacity: 0.25 });
      },
    });
    const name = feature?.properties?.name || "(nomlanmagan)";
    layer.bindTooltip(name, { sticky: true });
  };

  return (
    <>
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <BoundsWatcher onBoundsChange={onBoundsChange} />
      {boundaryFC && <GeoJSON data={boundaryFC} style={boundaryStyle} />}
      {data && (
        <>
          <GeoJSON
            key={JSON.stringify(data?.features?.map((f) => f.properties?.id))}
            data={data}
            style={styleFor}
            onEachFeature={onEach}
          />
          <FitToData data={data} boundary={boundaryFC} />
        </>
      )}
    </>
  );
}
