import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import apiFetch from "../config/api.js";
import ConfirmModal from "../components/ConfirmModal.jsx";
import DestinosTab from "./admin/DestinosTab.jsx";
import HotelesTab from "./admin/HotelesTab.jsx";
import UsuariosTab from "./admin/UsuariosTab.jsx";
import ReservasTab from "./admin/ReservasTab.jsx";

function AdminPanel() {
  const [tab, setTab] = useState("destinos");
  const [destinos, setDestinos] = useState([]);
  const [hoteles, setHoteles] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ show: false, titulo: "", mensaje: "", onConfirm: () => {} });

  const loadDestinos = () => apiFetch("/destinos").then(setDestinos).catch(() => {});
  const loadHoteles = () => apiFetch("/hoteles").then(setHoteles).catch(() => {});
  const loadUsuarios = () => apiFetch("/auth/usuarios").then(setUsuarios).catch(() => {});
  const loadReservas = () => apiFetch("/reservas/admin/all").then(setReservas).catch(() => {});

  useEffect(() => {
    window.__confirmModal = (opts) => {
      setConfirmModal({
        show: true,
        titulo: opts.titulo,
        mensaje: opts.mensaje,
        onConfirm: async () => {
          await opts.onConfirm();
          setConfirmModal({ show: false, titulo: "", mensaje: "", onConfirm: () => {} });
        },
      });
    };
    loadDestinos();
    loadHoteles();
    loadUsuarios();
    loadReservas();
    return () => { delete window.__confirmModal; };
  }, []);

  const refreshAll = () => {
    loadDestinos();
    loadHoteles();
    loadUsuarios();
    loadReservas();
  };

  const handleChangeEstado = async (id, nuevoEstado) => {
    try {
      await apiFetch(`/reservas/${id}/estado`, {
        method: "PUT",
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      toast.success(`Estado cambiado a "${nuevoEstado}"`);
      setReservas((prev) =>
        prev.map((r) => (r.id === id ? { ...r, estado: nuevoEstado } : r))
      );
      setReservaSeleccionada((prev) =>
        prev && prev.id === id ? { ...prev, estado: nuevoEstado } : prev
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteReserva = (id) => {
    setConfirmModal({
      show: true,
      titulo: "Eliminar reserva",
      mensaje: "¿Estás seguro de eliminar esta reserva? Esta acción no se puede deshacer.",
      onConfirm: async () => {
        try {
          await apiFetch(`/reservas/${id}`, { method: "DELETE" });
          toast.success("Reserva eliminada");
          setReservas((prev) => prev.filter((r) => r.id !== id));
          setReservaSeleccionada(null);
        } catch (err) {
          toast.error(err.message);
        }
        setConfirmModal({ show: false, titulo: "", mensaje: "", onConfirm: () => {} });
      },
    });
  };

  return (
    <div className="container py-5 min-vh-100">
      <div className="text-center mb-5">
        <h1 className="fw-bold" style={{ color: "#0f766e" }}>Panel de Administración</h1>
        <p className="text-muted">Gestiona destinos, hoteles y reservas del sistema</p>
      </div>

      <ul className="nav nav-pills justify-content-center gap-3 mb-5">
        <li className="nav-item">
          <button
            className={`nav-link px-4 py-2 rounded-pill fw-semibold ${tab === "destinos" ? "text-white" : ""}`}
            style={tab === "destinos" ? { backgroundColor: "#0f766e" } : { backgroundColor: "#e2e8f0", color: "#475569" }}
            onClick={() => setTab("destinos")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
              <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
            </svg>
            Destinos <span className="badge bg-white text-dark ms-2">{destinos.length}</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link px-4 py-2 rounded-pill fw-semibold ${tab === "hoteles" ? "text-white" : ""}`}
            style={tab === "hoteles" ? { backgroundColor: "#0f766e" } : { backgroundColor: "#e2e8f0", color: "#475569" }}
            onClick={() => setTab("hoteles")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
              <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2zm6-4.5V14h4v-1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M2 2v12h12V2z"/>
            </svg>
            Hoteles <span className="badge bg-white text-dark ms-2">{hoteles.length}</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link px-4 py-2 rounded-pill fw-semibold ${tab === "usuarios" ? "text-white" : ""}`}
            style={tab === "usuarios" ? { backgroundColor: "#0f766e" } : { backgroundColor: "#e2e8f0", color: "#475569" }}
            onClick={() => setTab("usuarios")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
              <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h1.142a1.429 1.429 0 0 1 2.794.333c.228.458.54.865.918 1.205A5.98 5.98 0 0 0 11 13c.962 0 1.88-.15 2.732-.425.162.38.392.733.684 1.048A7.36 7.36 0 0 0 13 14h1c.333 0 1-.333 1-1 0-.523-.178-1.017-.484-1.437A5.98 5.98 0 0 0 13 9a5.98 5.98 0 0 0-3.064-.72"/>
            </svg>
            Usuarios <span className="badge bg-white text-dark ms-2">{usuarios.length}</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link px-4 py-2 rounded-pill fw-semibold ${tab === "reservas" ? "text-white" : ""}`}
            style={tab === "reservas" ? { backgroundColor: "#0f766e" } : { backgroundColor: "#e2e8f0", color: "#475569" }}
            onClick={() => setTab("reservas")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
            </svg>
            Reservas <span className="badge bg-white text-dark ms-2">{reservas.length}</span>
          </button>
        </li>
      </ul>

      {tab === "destinos" && <DestinosTab destinos={destinos} onRefresh={refreshAll} />}
      {tab === "hoteles" && <HotelesTab hoteles={hoteles} destinos={destinos} onRefresh={refreshAll} />}
      {tab === "usuarios" && <UsuariosTab usuarios={usuarios} />}
      {tab === "reservas" && (
        <ReservasTab
          reservas={reservas}
          onSelectReserva={setReservaSeleccionada}
          reservaSeleccionada={reservaSeleccionada}
          onCloseReserva={() => setReservaSeleccionada(null)}
          onRefresh={loadReservas}
          onDeleteReserva={handleDeleteReserva}
          onChangeEstado={handleChangeEstado}
        />
      )}

      {confirmModal.show && (
        <ConfirmModal
          titulo={confirmModal.titulo}
          mensaje={confirmModal.mensaje}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal({ show: false, titulo: "", mensaje: "", onConfirm: () => {} })}
        />
      )}
    </div>
  );
}

export default AdminPanel;
