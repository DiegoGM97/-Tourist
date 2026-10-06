import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { loginSchema, validate } from "../validations/schemas";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { success, errors: validationErrors } = validate(loginSchema, { correo, contrasena });
    if (!success) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      await login(correo, contrasena);
      toast.success("Bienvenido a Colombia Travel");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Credenciales incorrectas");
    }
  };

  return (
    <div className="container py-5 min-vh-100">
      <div
        className="row justify-content-center align-items-center"
        style={{ minHeight: "calc(100vh - 200px)" }}
      >
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card rounded card-login">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="correo" className="form-label">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.correo ? "is-invalid" : ""}`}
                    id="correo"
                    placeholder="nombre@ejemplo.com"
                    value={correo}
                    onChange={(e) => {
                      setCorreo(e.target.value);
                      if (errors.correo) setErrors({ ...errors, correo: undefined });
                    }}
                  />
                  {errors.correo && (
                    <div className="invalid-feedback">{errors.correo}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="contrasena" className="form-label">
                    Contraseña
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${errors.contrasena ? "is-invalid" : ""}`}
                      id="contrasena"
                      placeholder="Ingresa tu contraseña"
                      autoComplete="current-password"
                      value={contrasena}
                      onChange={(e) => {
                        setContrasena(e.target.value);
                        if (errors.contrasena) setErrors({ ...errors, contrasena: undefined });
                      }}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? "Ocultar" : "Mostrar"}
                    </button>
                    {errors.contrasena && (
                      <div className="invalid-feedback">{errors.contrasena}</div>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn w-100"
                  style={{ backgroundColor: "#0f766e", color: "white" }}
                >
                  Ingresar
                </button>
              </form>
              <p className="text-center mt-3 mb-0">
                ¿No tienes cuenta?{" "}
                <Link to="/registro.html" className="text-decoration-none" style={{ color: "#0f766e" }}>
                  Regístrate
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
