import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SidebarNav from "./layout/SidebarNav.jsx";
import DashboardStats from "./pages/DashboardStats.jsx";
import MapView from "./pages/MapView.jsx";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            height: "100vh",
          }}
        >
          <SidebarNav />
          <main style={{ minWidth: 0 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardStats />} />
              <Route path="/map" element={<MapView />} />
              <Route
                path="*"
                element={<div style={{ padding: 24 }}>404</div>}
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
