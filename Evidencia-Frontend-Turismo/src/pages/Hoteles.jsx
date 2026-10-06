import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import apiFetch from "../config/api.js";
import { useReviews } from "../context/ReviewsContext";
import { getDestinoNombre } from "../config/destinos.js";

function Hoteles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filtroDestino, setFiltroDestino] = useState("");
  const [hoteles, setHoteles] = useState([]);
  const { getAverageRating, getReviewsByHotel } = useReviews();

  useEffect(() => {
    apiFetch("/hoteles").then(setHoteles).catch(() => {});
  }, []);

  const destinos = [...new Set(hoteles.map((h) => h.destino_slug))];

  const filteredHoteles = hoteles.filter((h) => {
    const matchesSearch = (h.search || h.nombre || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDestino = filtroDestino === "" || h.destino_slug === filtroDestino;
    return matchesSearch && matchesDestino;
  });

  const noResults = searchQuery.trim() !== "" && filteredHoteles.length === 0;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? "#0f766e" : "#d1d5db", fontSize: "0.9rem" }}>
        ★
      </span>
    ));
  };

  return (
    <div className="container py-5 min-vh-100">
      <section className="mb-5 text-center">
        <h1>Hoteles en la Costa Colombiana</h1>
        <p className="lead">
          Encuentra el alojamiento perfecto para tu estadía. Desde hoteles boutique
          hasta resorts de lujo en el Caribe colombiano.
        </p>
      </section>

      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-8 col-lg-6">
          <SearchBar
            placeholder="Busca por hotel, ciudad o tipo de alojamiento..."
            onSearch={setSearchQuery}
          />
        </div>
      </div>

      <div className="d-flex justify-content-center flex-wrap gap-2 mb-4">
        <button
          className={`btn btn-sm ${filtroDestino === "" ? "text-white" : "btn-outline-secondary"}`}
          style={filtroDestino === "" ? { backgroundColor: "#0f766e" } : {}}
          onClick={() => setFiltroDestino("")}
        >
          Todos
        </button>
        {destinos.map((destino) => (
          <button
            key={destino}
            className={`btn btn-sm ${filtroDestino === destino ? "text-white" : "btn-outline-secondary"}`}
            style={filtroDestino === destino ? { backgroundColor: "#0f766e" } : {}}
            onClick={() => setFiltroDestino(destino)}
          >
            {getDestinoNombre(destino)}
          </button>
        ))}
      </div>

      {noResults && (
        <div className="alert alert-warning" role="alert">
          No encontramos hoteles que coincidan con tu búsqueda.
        </div>
      )}

      <section className="row g-4">
        {filteredHoteles.map((hotel) => {
          const avgRating = getAverageRating(hotel.slug);
          const reviewCount = getReviewsByHotel(hotel.slug).length;

          return (
            <div key={hotel.slug} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 card-hover">
                <img
                  src={hotel.imagen}
                  className="card-img-top"
                  alt={hotel.nombre}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <span className="badge" style={{ backgroundColor: "#0f766e", color: "white" }}>
                      {getDestinoNombre(hotel.destino_slug)}
                    </span>
                    <span className={`badge ${hotel.disponibilidad ? "text-bg-success" : "text-bg-warning"}`}>
                      {hotel.disponibilidad ? "Disponible" : "No disponible"}
                    </span>
                  </div>
                  <h2 className="card-title h5 mt-2">{hotel.nombre}</h2>
                  <p className="card-text text-muted small flex-grow-1">{hotel.descripcion}</p>

                  <div className="d-flex align-items-center gap-1 mb-2">
                    {renderStars(hotel.estrellas)}
                    {avgRating > 0 && (
                      <small className="text-muted">({avgRating} · {reviewCount})</small>
                    )}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="fw-bold text-teal">
                      ${Number(hotel.precio_noche).toLocaleString("es-CO")} <small className="text-muted fw-normal">/ noche</small>
                    </span>
                    <Link
                      to={`/hoteles/${hotel.slug}`}
                      className="btn btn-sm"
                      style={{ backgroundColor: "#0f766e", color: "white" }}
                    >
                      Ver más →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default Hoteles;
