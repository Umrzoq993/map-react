import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./app/Layout";
import Dashboard from "./pages/Dashboard";
import MapPage from "./pages/MapPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/map" element={<MapPage />} />
        <Route
          path="*"
          element={<div className="panel">Sahifa topilmadi</div>}
        />
      </Routes>
    </Layout>
  );
}
