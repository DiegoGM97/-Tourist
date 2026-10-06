import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef } from "react";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const togglerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const nav = navRef.current;
      const toggler = togglerRef.current;
      if (!nav || !toggler) return;

      const collapse = nav.querySelector(".navbar-collapse");
      if (!collapse) return;

      const isOpen = collapse.classList.contains("show");
      if (isOpen && !nav.contains(e.target)) {
        toggler.click();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleNavClick = () => {
    const collapse = navRef.current?.querySelector(".navbar-collapse");
    const toggler = togglerRef.current;
    if (collapse?.classList.contains("show") && toggler) {
      toggler.click();
    }
  };

  const handleLogout = () => {
    logout();
    handleNavClick();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-teal" ref={navRef}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Turismo Costa Colombiana
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          ref={togglerRef}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse navbar-overlay" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" onClick={handleNavClick}>
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/destinos.html" onClick={handleNavClick}>
                Destinos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/hoteles.html" onClick={handleNavClick}>
                Hoteles
              </NavLink>
            </li>
            {user && user.rol === "admin" && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin.html" onClick={handleNavClick}>
                  Panel Admin
                </NavLink>
              </li>
            )}
            <li className="nav-item d-flex align-items-center">
              {user ? (
                <div className="dropdown">
                  <button
                    className="nav-link dropdown-toggle d-flex align-items-center border-0 bg-transparent px-2"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{ width: "36px", height: "36px", backgroundColor: "rgba(255,255,255,0.15)" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                      </svg>
                    </div>
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end border-0 shadow-lg"
                    style={{ minWidth: "200px", borderRadius: "0.75rem", padding: "0.5rem 0" }}
                  >
                    <li className="px-3 py-2">
                      <div className="fw-semibold" style={{ color: "#111827", fontSize: "0.9rem" }}>{user.nombre}</div>
                      <small className="text-muted" style={{ fontSize: "0.75rem" }}>{user.correo}</small>
                    </li>
                    <li><hr className="dropdown-divider my-1" /></li>
                    <li>
                      <NavLink
                        className="dropdown-item d-flex align-items-center gap-2 py-2"
                        to="/perfil.html"
                        onClick={handleNavClick}
                        style={{ fontSize: "0.9rem" }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6b7280" viewBox="0 0 16 16">
                          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                          <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                        </svg>
                        Mi perfil
                      </NavLink>
                    </li>
                    <li><hr className="dropdown-divider my-1" /></li>
                    <li>
                      <button
                        className="dropdown-item d-flex align-items-center gap-2 py-2"
                        onClick={handleLogout}
                        style={{ fontSize: "0.9rem", color: "#dc2626" }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
                          <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
                        </svg>
                        Cerrar sesión
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <NavLink className="nav-link" to="/login.html" onClick={handleNavClick}>
                  Iniciar Sesión
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
