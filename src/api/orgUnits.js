import client from "./client";

export const fetchTree = async () => (await client.get("/org-units/tree")).data;
export const fetchProfile = async (id) =>
  (await client.get(`/org-units/${id}`)).data;

export const fetchAssets = async ({ id, type, bbox }) => {
  const params = { includeSubtree: true };
  if (type) params.type = type;
  if (bbox) params.bbox = bbox.join(","); // [minLon,minLat,maxLon,maxLat]
  return (await client.get(`/org-units/${id}/assets`, { params })).data;
};
