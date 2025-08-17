import { TileLayer } from "react-leaflet";

export default function AgriTileLayer() {
  const url =
    import.meta.env.VITE_TILES ||
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
  return (
    <TileLayer
      url={url}
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    />
  );
}
