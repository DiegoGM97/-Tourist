const API_URL = "http://localhost:3000/api";

async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("turismo-token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Error en la petición");
  }

  return data;
}

export default apiFetch;
