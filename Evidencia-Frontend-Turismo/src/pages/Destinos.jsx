import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import FavoriteButton from "../components/FavoriteButton";
import apiFetch from "../config/api.js";

function Destinos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [destinos, setDestinos] = useState([]);

  useEffect(() => {
    apiFetch("/destinos").then(setDestinos).catch(() => {});
  }, []);

  const filteredDestinos = destinos.filter((d) => {
    const search = (d.search || d.nombre || "").toLowerCase();
    return search.includes(searchQuery.toLowerCase()) || d.nombre.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const noResults = searchQuery.trim() !== "" && filteredDestinos.length === 0;

  return (
    <div className="container py-5 min-vh-100">
      <section className="mb-5 text-center">
        <h1>Destinos de la Costa Colombiana</h1>
        <p className="lead">
          Explora los lugares más increíbles del Caribe colombiano.
          Desde islas paradisíacas hasta ciudades llenas de historia y cultura.
        </p>
      </section>

      <SearchBar
        placeholder="Busca por destino, ciudad o experiencia..."
        onSearch={setSearchQuery}
      />

      {noResults && (
        <div className="alert alert-warning" role="alert">
          No encontramos destinos que coincidan con tu búsqueda.
        </div>
      )}

      <section className="row g-4">
        {filteredDestinos.map((destino) => (
          <div key={destino.slug} className="col-12 col-md-4">
            <div className="card h-100 card-hover">
              <img
                src={destino.imagen}
                className="card-img-top"
                alt={destino.nombre}
              />
              <div className="card-body">
                <h2 className="card-title h5">{destino.nombre}</h2>
                <p className="card-text">{destino.descripcion_corta}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <FavoriteButton id={destino.slug} />
                  <Link
                    to={`/destinos/${destino.slug}`}
                    className="btn btn-sm"
                    style={{ backgroundColor: "#0f766e", color: "white" }}
                  >
                    Ver más →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Destinos;
