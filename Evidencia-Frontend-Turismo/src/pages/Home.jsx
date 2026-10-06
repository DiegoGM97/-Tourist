import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import apiFetch from "../config/api.js";
import { getDestinoNombre } from "../config/destinos.js";

function Home() {
  const shown = useRef(false);
  const [destinos, setDestinos] = useState([]);
  const [hoteles, setHoteles] = useState([]);

  useEffect(() => {
    if (shown.current) return;
    shown.current = true;
    toast("¡Bienvenido al Caribe colombiano! Explora los destinos más increíbles de nuestra costa.", {
      icon: "🌴",
      duration: 4000,
    });

    apiFetch("/destinos").then(setDestinos).catch(() => {});
    apiFetch("/hoteles").then(setHoteles).catch(() => {});
  }, []);

  const destinosDestacados = destinos.slice(0, 4);
  const hotelesDestacados = hoteles.filter((h) => h.estrellas >= 4).slice(0, 3);

  return (
    <div className="min-vh-100">
      <section
        className="text-white d-flex align-items-center"
        style={{
          minHeight: "70vh",
          backgroundImage: "url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: "linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)" }}
        />
        <div className="container position-relative py-5">
          <div className="row">
            <div className="col-lg-7">
              <h1 className="display-3 fw-bold mb-3">
                Vive el Caribe<br />Colombiano
              </h1>
              <p className="lead mb-4" style={{ fontSize: "1.2rem", color: "white" }}>
                Descubre playas de arena blanca, ciudades históricas, selvas tropicales y la
                mejor gastronomía del Caribe. Tu aventura en la costa colombiana comienza aquí.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link
                  to="/destinos.html"
                  className="btn btn-lg text-white"
                  style={{ backgroundColor: "#0f766e" }}
                >
                  Explorar destinos
                </Link>
                <Link
                  to="/hoteles.html"
                  className="btn btn-lg btn-outline-light"
                >
                  Ver hoteles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="text-center mb-5">
          <h2 className="h1 fw-bold">¿Por qué elegirnos?</h2>
          <p className="lead text-muted">Todo lo que necesitas para tu viaje al Caribe en un solo lugar</p>
        </div>
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 text-center p-4">
              <div className="card-body">
                <div className="mb-3" style={{ fontSize: "3rem" }}>🏖️</div>
                <h3 className="h5 fw-bold">7 Destinos Únicos</h3>
                <p className="text-muted mb-0">
                  Desde la isla de San Andrés hasta las montañas de la Sierra Nevada.
                  Cada destino tiene su propia historia y encanto.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 text-center p-4">
              <div className="card-body">
                <div className="mb-3" style={{ fontSize: "3rem" }}>🏨</div>
                <h3 className="h5 fw-bold">17 Hoteles Seleccionados</h3>
                <p className="text-muted mb-0">
                  Resorts all inclusive, boutiques de lujo y cabañas frente al mar.
                  Alojamiento para cada presupuesto y estilo.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 text-center p-4">
              <div className="card-body">
                <div className="mb-3" style={{ fontSize: "3rem" }}>⭐</div>
                <h3 className="h5 fw-bold">Reseñas Reales</h3>
                <p className="text-muted mb-0">
                  Lee opiniones de viajeros que ya visitaron cada hotel.
                  Calificaciones, fotos y consejos para tu viaje.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" style={{ backgroundColor: "#f0fdfa" }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h1 fw-bold mb-1">Destinos populares</h2>
              <p className="text-muted mb-0">Los lugares más visitados de la costa colombiana</p>
            </div>
            <Link to="/destinos.html" className="btn btn-outline-secondary d-none d-md-inline-block">
              Ver todos →
            </Link>
          </div>
          <div className="row g-4">
            {destinosDestacados.map((destino) => (
              <div key={destino.slug} className="col-12 col-sm-6 col-lg-3">
                <Link to={`/destinos/${destino.slug}`} className="text-decoration-none">
                  <div className="card h-100 border-0 card-hover">
                    <img
                      src={destino.imagen}
                      className="card-img-top"
                      alt={destino.nombre}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h3 className="card-title h6 fw-bold">{destino.nombre}</h3>
                      <p className="card-text small text-muted mb-0">
                        {destino.descripcion_corta?.slice(0, 80)}...
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-4 d-md-none">
            <Link to="/destinos.html" className="btn" style={{ backgroundColor: "#0f766e", color: "white" }}>
              Ver todos los destinos
            </Link>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="h1 fw-bold mb-1">Hoteles destacados</h2>
            <p className="text-muted mb-0">Los mejores alojamientos según nuestros viajeros</p>
          </div>
          <Link to="/hoteles.html" className="btn btn-outline-secondary d-none d-md-inline-block">
            Ver todos →
          </Link>
        </div>
        <div className="row g-4">
          {hotelesDestacados.map((hotel) => (
            <div key={hotel.slug} className="col-12 col-md-4">
              <Link to={`/hoteles/${hotel.slug}`} className="text-decoration-none">
                <div className="card h-100 border-0 card-hover">
                  <img
                    src={hotel.imagen}
                    className="card-img-top"
                    alt={hotel.nombre}
                    style={{ height: "220px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <span className="badge" style={{ backgroundColor: "#0f766e", color: "white", fontSize: "0.7rem" }}>
                        {getDestinoNombre(hotel.destino_slug)}
                      </span>
                      <span className="text-warning">
                        <span style={{ color: "#0f766e" }}>{"★".repeat(hotel.estrellas)}</span>
                      </span>
                    </div>
                    <h3 className="card-title h6 fw-bold mt-2">{hotel.nombre}</h3>
                    <p className="card-text small text-muted mb-2">{hotel.tipo}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold" style={{ color: "#0f766e" }}>
                        ${Number(hotel.precio_noche).toLocaleString("es-CO")}
                        <small className="text-muted fw-normal"> / noche</small>
                      </span>
                      <span className={`badge ${hotel.disponibilidad ? "text-bg-success" : "text-bg-warning"}`}>
                        {hotel.disponibilidad ? "Disponible" : "No disponible"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-4 d-md-none">
          <Link to="/hoteles.html" className="btn" style={{ backgroundColor: "#0f766e", color: "white" }}>
            Ver todos los hoteles
          </Link>
        </div>
      </section>

      <section
        className="py-5 text-white text-center"
        style={{
          background: "linear-gradient(135deg, #0f766e 0%, #065f46 100%)",
        }}
      >
        <div className="container py-4">
          <h2 className="h1 fw-bold mb-3">¿Listo para tu aventura?</h2>
          <p className="lead mb-4 mx-auto" style={{ maxWidth: "600px", color: "white" }}>
            Explora nuestros destinos, elige tu hotel ideal y reserva tu viaje al Caribe colombiano.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link
              to="/destinos.html"
              className="btn btn-lg btn-light"
            >
              Empezar ahora
            </Link>
            <Link
              to="/hoteles.html"
              className="btn btn-lg btn-outline-light"
            >
              Ver hoteles disponibles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
