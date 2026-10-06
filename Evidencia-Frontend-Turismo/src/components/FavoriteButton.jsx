import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function FavoriteButton({ id, type = "destino" }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(`${type}-${id}`);

  const handleClick = () => {
    if (!user) {
      toast.error("Inicia sesión para guardar en favoritos");
      navigate("/login.html");
      return;
    }
    toggleFavorite(`${type}-${id}`, type);
    if (favorited) {
      toast("Eliminado de favoritos", { icon: "🗑️" });
    } else {
      toast.success("Agregado a favoritos");
    }
  };

  return (
    <button
      className={`btn ${favorited ? "btn-primary" : "btn-outline-primary"} favorite-button`}
      type="button"
      onClick={handleClick}
      aria-pressed={favorited}
    >
      <span className="favorite-icon" aria-hidden="true">
        {favorited ? "★" : "☆"}
      </span>{" "}
      {favorited ? "Guardado" : "Favorito"}
    </button>
  );
}

export default FavoriteButton;
