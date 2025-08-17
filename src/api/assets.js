import client from "./client";

export const createAsset = async (payload) =>
  (await client.post("/assets", payload)).data;
export const updateAsset = async (id, payload) =>
  (await client.put(`/assets/${id}`, payload)).data;
export const deleteAsset = async (id) =>
  (await client.delete(`/assets/${id}`)).data;
