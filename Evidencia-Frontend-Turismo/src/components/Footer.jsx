import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer bg-dark text-white py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3 mb-md-0">
            <h5>Turismo Costa Colombiana</h5>
            <p className="small text-white-50">
              Tu aventura en el Caribe comienza aquí.
            </p>
          </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <h5>Enlaces</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-white-50">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/destinos.html" className="text-white-50">
                  Destinos
                </Link>
              </li>
              <li>
                <Link to="/hoteles.html" className="text-white-50">
                  Hoteles
                </Link>
              </li>
              <li>
                <Link to="/login.html" className="text-white-50">
                  Iniciar Sesión
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contacto</h5>
            <p className="small text-white-50 mb-0">
              info@turismocoastacolombiana.com
            </p>
          </div>
        </div>
        <hr className="my-3 border-secondary" />
      </div>
    </footer>
  );
}

export default Footer;
