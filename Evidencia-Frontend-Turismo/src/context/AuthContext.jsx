import { createContext, useContext, useState, useEffect } from "react";
import apiFetch from "../config/api.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("turismo-token");
    if (token) {
      apiFetch("/auth/me")
        .then((data) => setUser(data))
        .catch(() => localStorage.removeItem("turismo-token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (correo, contrasena) => {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ correo, contrasena }),
    });
    localStorage.setItem("turismo-token", data.token);
    setUser(data.user);
    return data;
  };

  const register = async (nombre, correo, contrasena) => {
    const data = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ nombre, correo, contrasena }),
    });
    localStorage.setItem("turismo-token", data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("turismo-token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
