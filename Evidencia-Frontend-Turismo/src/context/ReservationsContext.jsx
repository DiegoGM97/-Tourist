import { createContext, useContext, useState, useEffect } from "react";
import apiFetch from "../config/api.js";
import { useAuth } from "./AuthContext";

const ReservationsContext = createContext();

export function ReservationsProvider({ children }) {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    if (user) {
      apiFetch("/reservas")
        .then((data) =>
          setReservations(
            data.map((r) => ({
              id: r.id,
              hotelId: r.hotel_slug,
              hotelTitulo: r.hotel_nombre,
              hotelDestino: r.destino_nombre,
              hotelImagen: r.hotel_imagen,
              correo: r.correo,
              nombre: r.nombre,
              telefono: r.telefono,
              fechaEntrada: r.fecha_inicio,
              fechaSalida: r.fecha_fin,
              huespedes: r.huespedes,
              precio: "$" + Number(r.total).toLocaleString("es-CO"),
              estado: r.estado.charAt(0).toUpperCase() + r.estado.slice(1),
              fechaCreacion: new Date(r.created_at).toLocaleDateString("es-CO"),
            }))
          )
        )
        .catch(() => setReservations([]));
    } else {
      setReservations([]);
    }
  }, [user]);

  const addReservation = async (reservation) => {
    try {
      const nights = Math.ceil(
        (new Date(reservation.fechaSalida) - new Date(reservation.fechaEntrada)) / (1000 * 60 * 60 * 24)
      );
      const priceNum = parseInt(reservation.precio.replace(/[^0-9]/g, "")) || 0;
      const total = priceNum * nights;

      const data = await apiFetch("/reservas", {
        method: "POST",
        body: JSON.stringify({
          hotel_slug: reservation.hotelId,
          fecha_inicio: reservation.fechaEntrada,
          fecha_fin: reservation.fechaSalida,
          total,
          nombre: reservation.nombre,
          correo: reservation.correo,
          telefono: reservation.telefono,
          huespedes: parseInt(reservation.huespedes) || 1,
        }),
      });

      setReservations((prev) => [
        {
          id: data.id,
          hotelId: reservation.hotelId,
          hotelTitulo: reservation.hotelTitulo,
          hotelDestino: reservation.hotelDestino,
          hotelImagen: reservation.hotelImagen,
          correo: reservation.correo,
          nombre: reservation.nombre,
          telefono: reservation.telefono,
          fechaEntrada: reservation.fechaEntrada,
          fechaSalida: reservation.fechaSalida,
          huespedes: reservation.huespedes,
          precio: reservation.precio,
          estado: "Pendiente",
          fechaCreacion: new Date(data.created_at).toLocaleDateString("es-CO"),
        },
        ...prev,
      ]);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const getReservationsByUser = (correo) => {
    return reservations.filter((r) => r.correo === correo);
  };

  return (
    <ReservationsContext.Provider value={{ reservations, addReservation, getReservationsByUser }}>
      {children}
    </ReservationsContext.Provider>
  );
}

export function useReservations() {
  return useContext(ReservationsContext);
}
