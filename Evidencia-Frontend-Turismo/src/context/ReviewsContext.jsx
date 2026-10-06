import { createContext, useContext, useState, useEffect } from "react";
import apiFetch from "../config/api.js";

const ReviewsContext = createContext();

function mapReview(r) {
  return {
    id: r.id,
    hotelId: r.tipo_entidad === "hotel" ? r.entidad_id : null,
    destinoId: r.tipo_entidad === "destino" ? r.entidad_id : null,
    rating: r.calificacion,
    comment: r.comentario,
    userName: r.usuario_nombre,
    fecha: new Date(r.created_at).toLocaleDateString("es-CO"),
  };
}

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState([]);

  const loadReviews = async (query = "") => {
    try {
      const data = await apiFetch(`/resenas${query ? "?" + query : ""}`);
      setReviews(data.map(mapReview));
    } catch {
      setReviews([]);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const addReview = async (review) => {
    try {
      const data = await apiFetch("/resenas", {
        method: "POST",
        body: JSON.stringify({
          tipo_entidad: review.hotelId ? "hotel" : "destino",
          entidad_id: review.hotelId || review.destinoId,
          calificacion: review.rating,
          comentario: review.comment,
        }),
      });
      setReviews((prev) => [
        {
          id: data.id,
          hotelId: review.hotelId || null,
          destinoId: review.destinoId || null,
          rating: review.rating,
          comment: review.comment,
          userName: review.userName,
          fecha: new Date(data.created_at).toLocaleDateString("es-CO"),
        },
        ...prev,
      ]);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const getReviewsByHotel = (hotelId) => {
    return reviews.filter((r) => r.hotelId === hotelId);
  };

  const getAverageRating = (hotelId) => {
    const hotelReviews = getReviewsByHotel(hotelId);
    if (hotelReviews.length === 0) return 0;
    const sum = hotelReviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / hotelReviews.length).toFixed(1);
  };

  const getReviewsByDestino = (destinoId) => {
    return reviews.filter((r) => r.destinoId === destinoId);
  };

  const getAverageRatingDestino = (destinoId) => {
    const destinoReviews = getReviewsByDestino(destinoId);
    if (destinoReviews.length === 0) return 0;
    const sum = destinoReviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / destinoReviews.length).toFixed(1);
  };

  return (
    <ReviewsContext.Provider
      value={{ reviews, addReview, getReviewsByHotel, getAverageRating, getReviewsByDestino, getAverageRatingDestino }}
    >
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  return useContext(ReviewsContext);
}
