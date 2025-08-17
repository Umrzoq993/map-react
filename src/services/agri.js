import { api } from "./http";

const AGRI_BASE = import.meta.env.VITE_AGRI_BASE || "/api/agri";
// kerak bo‘lsa .env da VITE_AGRI_BASE=/api/map yoki boshqasiga almashtirasiz

export async function fetchStats() {
  const { data } = await api.get(`${AGRI_BASE}/stats`);
  return data;
}
export async function fetchTypes() {
  const { data } = await api.get(`${AGRI_BASE}/types`);
  return data;
}
export async function fetchFeatures({ types = [], bbox } = {}) {
  const params = {};
  if (types?.length) params.types = types.join(",");
  if (bbox?.length === 4) params.bbox = bbox.join(",");
  const { data } = await api.get(`${AGRI_BASE}/features`, { params });
  return data;
}
