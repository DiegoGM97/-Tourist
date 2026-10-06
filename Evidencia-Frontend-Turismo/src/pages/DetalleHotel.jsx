import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { useReviews } from "../context/ReviewsContext";
import { useAuth } from "../context/AuthContext";
import { useReservations } from "../context/ReservationsContext";
import toast from "react-hot-toast";
import { reviewSchema, reservaSchema, validate } from "../validations/schemas";
import apiFetch from "../config/api.js";
import { getDestinoNombre } from "../config/destinos.js";

function DetalleHotel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addReview, getReviewsByHotel, getAverageRating } = useReviews();
  const { addReservation } = useReservations();
  const [nuevaResena, setNuevaResena] = useState("");
  const [nuevoRating, setNuevoRating] = useState(5);
  const [showReserva, setShowReserva] = useState(false);
  const [reservaForm, setReservaForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    fechaEntrada: "",
    fechaSalida: "",
    huespedes: "1",
  });
  const [reviewErrors, setReviewErrors] = useState({});
  const [reservaErrors, setReservaErrors] = useState({});
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    apiFetch(`/hoteles/${id}`)
      .then((data) => setHotel(data))
      .catch(() => setHotel(null))
      .finally(() => setLoading(false));
  }, [id]);

  const hotelReviews = hotel ? getReviewsByHotel(hotel.slug) : [];
  const averageRating = hotel ? getAverageRating(hotel.slug) : 0;
  const favorited = hotel ? isFavorite(`hotel-${hotel.slug}`) : false;

  if (loading) {
    return (
      <div className="container py-5 text-center min-vh-100">
        <p>Cargando hotel...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container py-5 text-center min-vh-100">
        <h1>Hotel no encontrado</h1>
        <p className="lead">El hotel que buscas no existe.</p>
        <Link to="/hoteles.html" className="btn" style={{ backgroundColor: "#0f766e", color: "white" }}>
          Volver a Hoteles
        </Link>
      </div>
    );
  }

  const handleFavorite = () => {
    if (!user) {
      toast.error("Inicia sesión para guardar en favoritos");
      navigate("/login.html");
      return;
    }
    toggleFavorite(`hotel-${hotel.slug}`, "hotel");
    if (favorited) {
      toast("Eliminado de favoritos", { icon: "🗑️" });
    } else {
      toast.success("Agregado a favoritos");
    }
  };

  const handleReservar = () => {
    if (!user) {
      toast.error("Inicia sesión para reservar");
      navigate("/login.html");
      return;
    }
    setShowReserva(true);
  };

  const handleReservaSubmit = async (e) => {
    e.preventDefault();
    const { success, errors } = validate(reservaSchema, reservaForm);
    if (!success) {
      setReservaErrors(errors);
      return;
    }
    setReservaErrors({});

    try {
      await addReservation({
        hotelId: hotel.slug,
        hotelTitulo: hotel.nombre,
        hotelDestino: hotel.destino_slug,
        hotelImagen: hotel.imagen,
        correo: user.correo,
        nombre: reservaForm.nombre,
        telefono: reservaForm.telefono,
        fechaEntrada: reservaForm.fechaEntrada,
        fechaSalida: reservaForm.fechaSalida,
        huespedes: reservaForm.huespedes,
        precio: "$" + Number(hotel.precio_noche).toLocaleString("es-CO"),
      });

      toast.success(
        `Reserva recibida para ${hotel.nombre}\n${reservaForm.nombre} · ${reservaForm.fechaEntrada} al ${reservaForm.fechaSalida} · ${reservaForm.huespedes} huésped(es)`,
        { duration: 5000 }
      );
      setShowReserva(false);
      setReservaForm({ nombre: "", correo: "", telefono: "", fechaEntrada: "", fechaSalida: "", huespedes: "1" });
    } catch {
      toast.error("Error al crear la reserva");
    }
  };

  const handleReservaChange = (e) => {
    setReservaForm({ ...reservaForm, [e.target.name]: e.target.value });
    if (reservaErrors[e.target.name]) {
      setReservaErrors({ ...reservaErrors, [e.target.name]: undefined });
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Inicia sesión para dejar una reseña");
      navigate("/login.html");
      return;
    }

    const { success, errors } = validate(reviewSchema, { comment: nuevaResena, rating: nuevoRating });
    if (!success) {
      setReviewErrors(errors);
      return;
    }
    setReviewErrors({});

    try {
      await addReview({
        hotelId: hotel.slug,
        userName: user.nombre,
        rating: nuevoRating,
        comment: nuevaResena.trim(),
      });
      setNuevaResena("");
      setNuevoRating(5);
      toast.success("Reseña publicada");
    } catch {
      toast.error("Error al publicar reseña");
    }
  };

  const renderHotelStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? "#0f766e" : "#d1d5db", fontSize: "1.2rem" }}>
        ★
      </span>
    ));
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? "#f59e0b" : "#d1d5db", fontSize: "1.2rem" }}>
        ★
      </span>
    ));
  };

  const precioFormatted = "$" + Number(hotel.precio_noche).toLocaleString("es-CO");
  const comodidades = hotel.comodidades || [];

  return (
    <div className="min-vh-100">
      <div
        className="w-100"
        style={{
          height: "50vh",
          backgroundImage: `url(${hotel.imagen})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))" }}
        />
        <div className="position-absolute bottom-0 start-0 w-100 p-4 p-md-5 text-white">
          <div className="container">
            <Link to="/hoteles.html" className="text-white text-decoration-none mb-2 d-inline-block">
              ← Volver a Hoteles
            </Link>
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
              <div>
                <h1 className="display-5 fw-bold mb-1">{hotel.nombre}</h1>
                <p className="mb-1" style={{ color: "white" }}>{hotel.tipo} · {getDestinoNombre(hotel.destino_slug)}</p>
                <div className="d-flex align-items-center gap-2">
                  {renderHotelStars(hotel.estrellas)}
                  {averageRating > 0 && (
                    <span className="ms-2" style={{ color: "white" }}>({averageRating} ★ · {hotelReviews.length} reseñas)</span>
                  )}
                </div>
              </div>
              <div className="text-end">
                <div className="display-6 fw-bold">{precioFormatted}</div>
                <small>/ noche</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4 mb-5">
          <div className="col-12 col-lg-8">
            <h2 className="h4 mb-3">Descripción</h2>
            <p className="fs-5 text-muted">{hotel.descripcion}</p>

            <h2 className="h4 mb-3 mt-4">Comodidades</h2>
            <div className="d-flex flex-wrap gap-2">
              {comodidades.map((amenity, index) => (
                <span key={index} className="badge" style={{ backgroundColor: "#0f766e", color: "white", fontSize: "0.9rem" }}>
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="card border-0 ">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className={`badge ${hotel.disponibilidad ? "text-bg-success" : "text-bg-warning"}`}>
                    {hotel.disponibilidad ? "Disponible" : "No disponible"}
                  </span>
                  <div className="d-flex align-items-center gap-1">
                    <span className="fw-bold text-teal">{precioFormatted}</span>
                    <small className="text-muted">/ noche</small>
                  </div>
                </div>

                <button
                  onClick={handleReservar}
                  className="btn w-100 mb-2"
                  style={{ backgroundColor: "#0f766e", color: "white" }}
                >
                  Reservar ahora
                </button>

                <button
                  onClick={handleFavorite}
                  className={`btn w-100 ${favorited ? "btn-primary" : "btn-outline-primary"}`}
                >
                  {favorited ? "★ En favoritos" : "☆ Agregar a favoritos"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-5">
          <h2 className="h4 mb-4" style={{ color: "#0f766e" }}>
            Reseñas de huéspedes
          </h2>

          <div className="card border-0  mb-4">
            <div className="card-body">
              <h3 className="h5 mb-3">Escribir una reseña</h3>
              <form onSubmit={handleSubmitReview} noValidate>
                <div className="mb-3">
                  <label className="form-label">Calificación</label>
                  <div className="d-flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          setNuevoRating(star);
                          if (reviewErrors.rating) setReviewErrors({ ...reviewErrors, rating: undefined });
                        }}
                        style={{
                          background: "none",
                          border: reviewErrors.rating ? "2px solid #dc3545" : "none",
                          borderRadius: "4px",
                          fontSize: "1.5rem",
                          cursor: "pointer",
                          color: star <= nuevoRating ? "#f59e0b" : "#d1d5db",
                        }}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  {reviewErrors.rating && (
                    <div className="text-danger small mt-1">{reviewErrors.rating}</div>
                  )}
                </div>
                <div className="mb-3">
                  <textarea
                    className={`form-control ${reviewErrors.comment ? "is-invalid" : ""}`}
                    rows="3"
                    placeholder="Cuenta tu experiencia..."
                    value={nuevaResena}
                    onChange={(e) => {
                      setNuevaResena(e.target.value);
                      if (reviewErrors.comment) setReviewErrors({ ...reviewErrors, comment: undefined });
                    }}
                  />
                  {reviewErrors.comment && (
                    <div className="invalid-feedback">{reviewErrors.comment}</div>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn"
                  style={{ backgroundColor: "#0f766e", color: "white" }}
                >
                  Publicar reseña
                </button>
              </form>
            </div>
          </div>

          {hotelReviews.length === 0 ? (
            <p className="text-muted">Aún no hay reseñas para este hotel. Sé el primero en escribir una.</p>
          ) : (
            <div className="row g-3">
              {hotelReviews.map((review) => (
                <div key={review.id} className="col-12">
                  <div className="card border-0 ">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <strong>{review.userName}</strong>
                          <div className="d-flex gap-1 ms-2" style={{ display: "inline-flex" }}>
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <small className="text-muted">{review.fecha}</small>
                      </div>
                      <p className="mb-0 text-muted">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="text-center">
          <Link
            to="/hoteles.html"
            className="btn btn-lg"
            style={{ backgroundColor: "#0f766e", color: "white" }}
          >
            ← Explorar otros hoteles
          </Link>
        </div>
      </div>

      {showReserva && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={() => setShowReserva(false)}
        >
          <div
            className="card shadow-lg w-100 mx-3"
            style={{ maxWidth: "520px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 mb-0" style={{ color: "#0f766e" }}>Reservar en {hotel.nombre}</h2>
                <button
                  className="btn-close"
                  onClick={() => setShowReserva(false)}
                  aria-label="Cerrar"
                />
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3 p-2 rounded"
                style={{ backgroundColor: "#f0fdfa" }}>
                <span className="text-muted">{hotel.tipo} · {getDestinoNombre(hotel.destino_slug)}</span>
                <span className="fw-bold text-teal">{precioFormatted} / noche</span>
              </div>

              <form onSubmit={handleReservaSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label">Nombre completo</label>
                  <input
                    type="text"
                    className={`form-control ${reservaErrors.nombre ? "is-invalid" : ""}`}
                    name="nombre"
                    value={reservaForm.nombre}
                    onChange={handleReservaChange}
                    placeholder="Tu nombre"
                  />
                  {reservaErrors.nombre && (
                    <div className="invalid-feedback">{reservaErrors.nombre}</div>
                  )}
                </div>

                <div className="row mb-3">
                  <div className="col-8">
                    <label className="form-label">Correo electrónico</label>
                    <input
                      type="email"
                      className={`form-control ${reservaErrors.correo ? "is-invalid" : ""}`}
                      name="correo"
                      value={reservaForm.correo}
                      onChange={handleReservaChange}
                      placeholder="correo@ejemplo.com"
                    />
                    {reservaErrors.correo && (
                      <div className="invalid-feedback">{reservaErrors.correo}</div>
                    )}
                  </div>
                  <div className="col-4">
                    <label className="form-label">Teléfono</label>
                    <input
                      type="tel"
                      className={`form-control ${reservaErrors.telefono ? "is-invalid" : ""}`}
                      name="telefono"
                      value={reservaForm.telefono}
                      onChange={handleReservaChange}
                      placeholder="3001234567"
                    />
                    {reservaErrors.telefono && (
                      <div className="invalid-feedback">{reservaErrors.telefono}</div>
                    )}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-4">
                    <label className="form-label">Entrada</label>
                    <input
                      type="date"
                      className={`form-control ${reservaErrors.fechaEntrada ? "is-invalid" : ""}`}
                      name="fechaEntrada"
                      value={reservaForm.fechaEntrada}
                      onChange={handleReservaChange}
                    />
                    {reservaErrors.fechaEntrada && (
                      <div className="invalid-feedback">{reservaErrors.fechaEntrada}</div>
                    )}
                  </div>
                  <div className="col-4">
                    <label className="form-label">Salida</label>
                    <input
                      type="date"
                      className={`form-control ${reservaErrors.fechaSalida ? "is-invalid" : ""}`}
                      name="fechaSalida"
                      value={reservaForm.fechaSalida}
                      onChange={handleReservaChange}
                    />
                    {reservaErrors.fechaSalida && (
                      <div className="invalid-feedback">{reservaErrors.fechaSalida}</div>
                    )}
                  </div>
                  <div className="col-4">
                    <label className="form-label">Huéspedes</label>
                    <select
                      className={`form-select ${reservaErrors.huespedes ? "is-invalid" : ""}`}
                      name="huespedes"
                      value={reservaForm.huespedes}
                      onChange={handleReservaChange}
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                    {reservaErrors.huespedes && (
                      <div className="invalid-feedback">{reservaErrors.huespedes}</div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn w-100 text-white"
                  style={{ backgroundColor: "#0f766e" }}
                >
                  Confirmar reserva
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetalleHotel;
