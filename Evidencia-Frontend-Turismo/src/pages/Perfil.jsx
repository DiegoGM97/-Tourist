import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { useReservations } from "../context/ReservationsContext";
import { getDestinoNombre } from "../config/destinos.js";
import apiFetch from "../config/api.js";
import toast from "react-hot-toast";

function Perfil() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const { getFavoritesByType, toggleFavorite } = useFavorites();
  const { getReservationsByUser } = useReservations();
  const [destinos, setDestinos] = useState([]);
  const [hoteles, setHoteles] = useState([]);

  useEffect(() => {
    apiFetch("/destinos").then(setDestinos).catch(() => {});
    apiFetch("/hoteles").then(setHoteles).catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center min-vh-100">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!user) {
    navigate("/login.html");
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada");
    navigate("/");
  };

  const handleRemoveFavorite = (e, fav) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(fav.id, fav.type);
    toast("Eliminado de favoritos", { icon: "🗑️" });
  };

  const hotelesFavoritos = getFavoritesByType("hotel");
  const destinosFavoritos = getFavoritesByType("destino");
  const reservas = getReservationsByUser(user.correo);

  const getHotelData = (slug) => hoteles.find((h) => h.slug === slug);
  const getDestinoData = (slug) => destinos.find((d) => d.slug === slug);

  return (
    <div className="container py-5 min-vh-100">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">

          <div className="card border-0 card-login mb-4 card-login">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-4 flex-wrap">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: 90,
                    height: 90,
                    backgroundColor: "#0f766e",
                    color: "white",
                    fontSize: "2.2rem",
                    fontWeight: 700,
                  }}
                >
                  {user.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow-1">
                  <h1 className="h3 mb-1">{user.nombre}</h1>
                  <p className="text-muted mb-2">{user.correo}</p>
                  <div className="d-flex gap-3 flex-wrap">
                    <span className="badge" style={{ backgroundColor: "#0f766e" }}>
                      {hotelesFavoritos.length} hoteles favoritos
                    </span>
                    <span className="badge" style={{ backgroundColor: "#0f766e" }}>
                      {destinosFavoritos.length} destinos favoritos
                    </span>
                    <span className="badge bg-secondary">
                      {reservas.length} reserva(s)
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>

          <section className="mb-4">
            <h2 className="h4 mb-3" style={{ color: "#0f766e" }}>
              Mis favoritos
            </h2>

            {hotelesFavoritos.length === 0 && destinosFavoritos.length === 0 ? (
              <div className="card border-0 card-login">
                <div className="card-body text-center py-4">
                  <p className="text-muted mb-3">Aún no tienes favoritos guardados.</p>
                  <Link to="/destinos.html" className="btn btn-sm" style={{ backgroundColor: "#0f766e", color: "white" }}>
                    Explorar destinos
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {hotelesFavoritos.length > 0 && (
                  <div className="mb-4">
                    <h3 className="h6 text-muted mb-2">Hoteles</h3>
                    <div className="row g-3">
                      {hotelesFavoritos.map((fav) => {
                        const hotel = getHotelData(fav.itemId);
                        return (
                          <div key={fav.id} className="col-12 col-sm-6 col-lg-4">
                            <Link to={`/hoteles/${fav.itemId}`} className="text-decoration-none">
                              <div className="card h-100 border-0 shadow-sm">
                                {hotel && (
                                  <img
                                    src={hotel.imagen}
                                    alt={hotel.nombre}
                                    style={{ height: "140px", objectFit: "cover" }}
                                  />
                                )}
                                <div className="card-body p-3">
                                  <div className="d-flex justify-content-between align-items-start mb-1">
                                    <span className="badge" style={{ backgroundColor: "#0f766e", fontSize: "0.65rem" }}>
                                      Hotel
                                    </span>
                                    <button
                                      className="btn btn-sm"
                                      style={{ color: "#dc2626", fontSize: "0.75rem", zIndex: 1 }}
                                      onClick={(e) => handleRemoveFavorite(e, fav)}
                                    >
                                      Quitar
                                    </button>
                                  </div>
                                  <h4 className="card-title h6 mb-1 mt-1">
                                    {hotel ? hotel.nombre : fav.itemId}
                                  </h4>
                                  {hotel && (
                                    <p className="text-muted small mb-0">
                                      {getDestinoNombre(hotel.destino_slug)} · ${Number(hotel.precio_noche).toLocaleString("es-CO")}/noche
                                    </p>
                                  )}
                                </div>
                              </div>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {destinosFavoritos.length > 0 && (
                  <div>
                    <h3 className="h6 text-muted mb-2">Destinos</h3>
                    <div className="row g-3">
                      {destinosFavoritos.map((fav) => {
                        const destino = getDestinoData(fav.itemId);
                        return (
                          <div key={fav.id} className="col-12 col-sm-6 col-lg-4">
                            <Link to={`/destinos/${fav.itemId}`} className="text-decoration-none">
                              <div className="card h-100 border-0 shadow-sm">
                                {destino && (
                                  <img
                                    src={destino.imagen}
                                    alt={destino.nombre}
                                    style={{ height: "140px", objectFit: "cover" }}
                                  />
                                )}
                                <div className="card-body p-3">
                                  <div className="d-flex justify-content-between align-items-start mb-1">
                                    <span className="badge" style={{ backgroundColor: "#065f46", fontSize: "0.65rem" }}>
                                      Destino
                                    </span>
                                    <button
                                      className="btn btn-sm"
                                      style={{ color: "#dc2626", fontSize: "0.75rem", zIndex: 1 }}
                                      onClick={(e) => handleRemoveFavorite(e, fav)}
                                    >
                                      Quitar
                                    </button>
                                  </div>
                                  <h4 className="card-title h6 mb-1 mt-1">
                                    {destino ? getDestinoNombre(destino.slug) : fav.itemId}
                                  </h4>
                                  {destino && (
                                    <p className="text-muted small mb-0">
                                      {destino.subtitulo}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </section>

          <section className="mb-4">
            <h2 className="h4 mb-3" style={{ color: "#0f766e" }}>
              Mis reservas
            </h2>

            {reservas.length === 0 ? (
              <div className="card border-0 card-login">
                <div className="card-body text-center py-4">
                  <p className="text-muted mb-3">Aún no has realizado ninguna reserva.</p>
                  <Link to="/hoteles.html" className="btn btn-sm" style={{ backgroundColor: "#0f766e", color: "white" }}>
                    Ver hoteles disponibles
                  </Link>
                </div>
              </div>
            ) : (
              <div className="row g-3">
                {reservas.map((reserva) => (
                  <div key={reserva.id} className="col-12">
                    <div className="card border-0 card-login">
                      <div className="card-body p-3">
                        <div className="row align-items-center g-3">
                          <div className="col-auto">
                            <img
                              src={reserva.hotelImagen}
                              alt={reserva.hotelTitulo}
                              style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "0.5rem" }}
                            />
                          </div>
                          <div className="col">
                            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                              <div>
                                <h4 className="h6 mb-1">{reserva.hotelTitulo}</h4>
                                <p className="text-muted small mb-1">{reserva.hotelDestino}</p>
                              </div>
                              <span
                                className="badge"
                                style={{
                                  backgroundColor: reserva.estado === "Pendiente" ? "#f59e0b" : reserva.estado === "Confirmada" ? "#10b981" : "#ef4444",
                                  color: "white",
                                }}
                              >
                                {reserva.estado}
                              </span>
                            </div>
                            <div className="d-flex gap-3 flex-wrap mt-2 small">
                              <span><strong>Entrada:</strong> {reserva.fechaEntrada}</span>
                              <span><strong>Salida:</strong> {reserva.fechaSalida}</span>
                              <span><strong>Huéspedes:</strong> {reserva.huespedes}</span>
                              <span><strong>Precio:</strong> {reserva.precio} / noche</span>
                            </div>
                            <p className="text-muted small mb-0 mt-1">
                              Reservado el {reserva.fechaCreacion}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}

export default Perfil;
