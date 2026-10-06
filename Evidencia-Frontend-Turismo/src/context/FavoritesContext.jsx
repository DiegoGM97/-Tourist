import { createContext, useContext, useState, useEffect } from "react";
import apiFetch from "../config/api.js";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (user) {
      apiFetch("/favoritos")
        .then((data) => {
          setFavorites(
            data.map((f) => ({
              id: f.tipo_entidad + "-" + f.entidad_id,
              type: f.tipo_entidad,
              itemId: f.entidad_id,
            }))
          );
        })
        .catch(() => setFavorites([]));
    } else {
      setFavorites([]);
    }
  }, [user]);

  const toggleFavorite = async (id, type = "destino") => {
    const itemId = id.replace("hotel-", "").replace("destino-", "");
    try {
      const data = await apiFetch("/favoritos/toggle", {
        method: "POST",
        body: JSON.stringify({ tipo_entidad: type, entidad_id: itemId }),
      });

      if (data.action === "added") {
        setFavorites((prev) => [...prev, { id, type, itemId }]);
      } else {
        setFavorites((prev) => prev.filter((f) => f.id !== id));
      }
    } catch {
      // Si falla la API, toggle local
      setFavorites((prev) => {
        const existing = prev.find((f) => f.id === id);
        if (existing) {
          return prev.filter((f) => f.id !== id);
        }
        return [...prev, { id, type, itemId }];
      });
    }
  };

  const isFavorite = (id) => favorites.some((f) => f.id === id);

  const getFavoritesByType = (type) => favorites.filter((f) => f.type === type);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, getFavoritesByType }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
