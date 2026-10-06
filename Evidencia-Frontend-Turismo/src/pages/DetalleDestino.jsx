import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useReviews } from "../context/ReviewsContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { reviewSchema, validate } from "../validations/schemas";
import apiFetch from "../config/api.js";

function DetalleDestino() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addReview, getReviewsByDestino, getAverageRatingDestino } = useReviews();
  const [nuevaResena, setNuevaResena] = useState("");
  const [nuevoRating, setNuevoRating] = useState(5);
  const [reviewErrors, setReviewErrors] = useState({});
  const [destino, setDestino] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    apiFetch(`/destinos/${id}`)
      .then((data) => setDestino(data))
      .catch(() => setDestino(null))
      .finally(() => setLoading(false));
  }, [id]);

  const destinoReviews = destino ? getReviewsByDestino(destino.slug) : [];
  const averageRating = destino ? getAverageRatingDestino(destino.slug) : 0;

  if (loading) {
    return (
      <div className="container py-5 text-center min-vh-100">
        <p>Cargando destino...</p>
      </div>
    );
  }

  if (!destino) {
    return (
      <div className="container py-5 text-center min-vh-100">
        <h1>Destino no encontrado</h1>
        <p className="lead">El destino que buscas no existe.</p>
        <Link to="/destinos.html" className="btn" style={{ backgroundColor: "#0f766e", color: "white" }}>
          Volver a Destinos
        </Link>
      </div>
    );
  }

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
        destinoId: destino.slug,
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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? "#f59e0b" : "#d1d5db", fontSize: "1.2rem" }}>
        ★
      </span>
    ));
  };

  const lugares = destino.lugares_interes || [];
  const actividades = destino.actividades || [];
  const consejos = destino.consejos || [];

  return (
    <div className="min-vh-100">
      <div
        className="w-100"
        style={{
          height: "50vh",
          backgroundImage: `url(${destino.imagen})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))" }}
        />
        <div className="position-absolute bottom-0 start-0 w-100 p-4 p-md-5 text-white">
          <div className="container">
            <Link to="/destinos.html" className="text-white text-decoration-none mb-2 d-inline-block">
              ← Volver a Destinos
            </Link>
            <h1 className="display-5 fw-bold mb-1">{destino.nombre}</h1>
            <p className="lead mb-0" style={{ color: "white" }}>{destino.subtitulo}</p>
            {averageRating > 0 && (
              <div className="d-flex align-items-center gap-2 mt-2">
                {renderStars(Math.round(averageRating))}
                <span style={{ color: "white" }}>({averageRating} · {destinoReviews.length} reseñas)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container py-5">
        <section className="mb-5">
          <p className="fs-5 text-muted">{destino.descripcion_larga}</p>
          <div className="row g-3 mt-2">
            <div className="col-md-6">
              <div className="card h-100 border-0 ">
                <div className="card-body">
                  <h6 className="text-uppercase text-muted mb-1">Clima</h6>
                  <p className="mb-0">{destino.clima}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100 border-0 ">
                <div className="card-body">
                  <h6 className="text-uppercase text-muted mb-1">Mejor época para visitar</h6>
                  <p className="mb-0">{destino.mejor_epoca}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-5">
          <h2 className="h4 mb-4" style={{ color: "#0f766e" }}>
            Lugares que visitar
          </h2>
          <div className="row g-4">
            {lugares.map((lugar, index) => (
              <div key={index} className="col-12 col-md-6">
                <div className="card h-100 border-0 ">
                  <div className="card-body">
                    <h3 className="h5 card-title" style={{ color: "#0f766e" }}>
                      {lugar.nombre}
                    </h3>
                    <p className="card-text text-muted mb-0">{lugar.descripcion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-5">
          <h2 className="h4 mb-4" style={{ color: "#0f766e" }}>
            Actividades imperdibles
          </h2>
          <div className="row g-3">
            {actividades.map((actividad, index) => (
              <div key={index} className="col-12 col-md-6">
                <div className="d-flex align-items-start">
                  <span className="badge me-3 mt-1" style={{ backgroundColor: "#0f766e" }}>
                    {index + 1}
                  </span>
                  <p className="mb-0">{actividad}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-5">
          <h2 className="h4 mb-4" style={{ color: "#0f766e" }}>
            Consejos para tu visita
          </h2>
          <div className="card border-0 ">
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                {consejos.map((consejo, index) => (
                  <li key={index} className="d-flex align-items-start mb-2">
                    <span className="me-2" style={{ color: "#0f766e" }}>
                      ✓
                    </span>
                    <span>{consejo}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-5">
          <h2 className="h4 mb-4" style={{ color: "#0f766e" }}>
            Reseñas de viajeros
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
                    placeholder="Cuéntanos tu experiencia en este destino..."
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

          {destinoReviews.length === 0 ? (
            <p className="text-muted">Aún no hay reseñas para este destino. Sé el primero en escribir una.</p>
          ) : (
            <div className="row g-3">
              {destinoReviews.map((review) => (
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
            to="/destinos.html"
            className="btn btn-lg"
            style={{ backgroundColor: "#0f766e", color: "white" }}
          >
            ← Explorar otros destinos
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DetalleDestino;
