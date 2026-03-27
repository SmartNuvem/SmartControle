import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3333";

export const api = axios.create({
  baseURL: apiUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("smartcontrole_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function assetUrl(path?: string | null) {
  if (!path) return "";
  return `${apiUrl}${path}`;
}


