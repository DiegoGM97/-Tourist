function ReservasTab({ reservas, onSelectReserva, reservaSeleccionada, onCloseReserva, onDeleteReserva, onChangeEstado }) {
  return (
    <>
      <div className="row g-4">
        <div className="col-12">
          <h5 className="fw-bold mb-3" style={{ color: "#0f766e" }}>Todas las Reservas</h5>
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead style={{ backgroundColor: "#f0fdfa" }}>
                    <tr>
                      <th className="ps-4" style={{ color: "#0f766e", fontWeight: 700 }}>ID</th>
                      <th style={{ color: "#0f766e", fontWeight: 700 }}>Hotel</th>
                      <th style={{ color: "#0f766e", fontWeight: 700 }}>Cliente</th>
                      <th style={{ color: "#0f766e", fontWeight: 700 }}>Entrada</th>
                      <th style={{ color: "#0f766e", fontWeight: 700 }}>Salida</th>
                      <th style={{ color: "#0f766e", fontWeight: 700 }}>Huespedes</th>
                      <th style={{ color: "#0f766e", fontWeight: 700 }}>Total</th>
                      <th style={{ color: "#0f766e", fontWeight: 700 }}>Estado</th>
                      <th className="text-end pe-4" style={{ color: "#0f766e", fontWeight: 700 }}>Fecha</th>
                      <th className="text-end pe-4" style={{ color: "#0f766e", fontWeight: 700 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservas.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center text-muted py-4">No hay reservas registradas</td>
                      </tr>
                    ) : (
                      reservas.map((r) => (
                        <tr key={r.id}>
                          <td className="ps-4"><code>{r.id}</code></td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <img src={r.hotel_imagen} alt="" style={{ width: "40px", height: "40px", borderRadius: "0.5rem", objectFit: "cover" }} />
                              <div>
                                <div className="fw-semibold" style={{ color: "#111827", fontSize: "0.85rem" }}>{r.hotel_nombre}</div>
                                <small className="text-muted">{r.destino_nombre}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="fw-semibold" style={{ color: "#111827", fontSize: "0.85rem" }}>{r.nombre}</div>
                              <small className="text-muted">{r.correo}</small>
                            </div>
                          </td>
                          <td className="text-muted">{new Date(r.fecha_inicio).toLocaleDateString("es-CO")}</td>
                          <td className="text-muted">{new Date(r.fecha_fin).toLocaleDateString("es-CO")}</td>
                          <td className="text-center">{r.huespedes}</td>
                          <td className="fw-semibold" style={{ color: "#0f766e" }}>${Number(r.total).toLocaleString("es-CO")}</td>
                          <td>
                            <span className="badge" style={{
                              backgroundColor: r.estado === "confirmada" ? "#d1fae5" : r.estado === "pendiente" ? "#fef3c7" : "#fee2e2",
                              color: r.estado === "confirmada" ? "#065f46" : r.estado === "pendiente" ? "#92400e" : "#991b1b"
                            }}>
                              {r.estado.charAt(0).toUpperCase() + r.estado.slice(1)}
                            </span>
                          </td>
                          <td className="text-end pe-4 text-muted">
                            {new Date(r.created_at).toLocaleDateString("es-CO")}
                          </td>
                          <td className="text-end pe-4">
                            <button
                              className="btn btn-sm d-inline-flex align-items-center gap-1"
                              style={{ backgroundColor: "#0f766e", color: "white", borderRadius: "0.5rem", padding: "0.4rem 0.8rem" }}
                              onClick={() => onSelectReserva(r)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                              </svg>
                              Ver
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {reservaSeleccionada && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={onCloseReserva}
        >
          <div
            className="card shadow-lg w-100 mx-3"
            style={{ maxWidth: "520px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0 fw-bold" style={{ color: "#0f766e" }}>Detalle de Reserva</h4>
                <button
                  className="btn-close"
                  onClick={onCloseReserva}
                  aria-label="Cerrar"
                />
              </div>

              <div className="d-flex align-items-center gap-3 mb-3 p-2 rounded" style={{ backgroundColor: "#f0fdfa" }}>
                <img
                  src={reservaSeleccionada.hotel_imagen}
                  alt=""
                  style={{ width: "60px", height: "60px", borderRadius: "0.5rem", objectFit: "cover" }}
                />
                <div>
                  <div className="fw-bold" style={{ color: "#111827" }}>{reservaSeleccionada.hotel_nombre}</div>
                  <small className="text-muted">{reservaSeleccionada.destino_nombre}</small>
                </div>
              </div>

              <div className="mb-3">
                <h6 className="text-uppercase text-muted mb-2" style={{ fontSize: "0.75rem" }}>Cliente</h6>
                <div className="row g-2">
                  <div className="col-6">
                    <small className="text-muted">Nombre</small>
                    <div className="fw-semibold">{reservaSeleccionada.nombre}</div>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Correo</small>
                    <div className="fw-semibold">{reservaSeleccionada.correo}</div>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Teléfono</small>
                    <div className="fw-semibold">{reservaSeleccionada.telefono || "—"}</div>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Huéspedes</small>
                    <div className="fw-semibold">{reservaSeleccionada.huespedes}</div>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <h6 className="text-uppercase text-muted mb-2" style={{ fontSize: "0.75rem" }}>Reserva</h6>
                <div className="row g-2">
                  <div className="col-6">
                    <small className="text-muted">Entrada</small>
                    <div className="fw-semibold">{new Date(reservaSeleccionada.fecha_inicio).toLocaleDateString("es-CO")}</div>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Salida</small>
                    <div className="fw-semibold">{new Date(reservaSeleccionada.fecha_fin).toLocaleDateString("es-CO")}</div>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Total</small>
                    <div className="fw-bold" style={{ color: "#0f766e", fontSize: "1.1rem" }}>${Number(reservaSeleccionada.total).toLocaleString("es-CO")}</div>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Estado</small>
                    <div>
                      <span className="badge" style={{
                        backgroundColor: reservaSeleccionada.estado === "confirmada" ? "#d1fae5" : reservaSeleccionada.estado === "pendiente" ? "#fef3c7" : "#fee2e2",
                        color: reservaSeleccionada.estado === "confirmada" ? "#065f46" : reservaSeleccionada.estado === "pendiente" ? "#92400e" : "#991b1b"
                      }}>
                        {reservaSeleccionada.estado.charAt(0).toUpperCase() + reservaSeleccionada.estado.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2 mb-3">
                <a
                  href={`https://wa.me/${reservaSeleccionada.telefono}?text=${encodeURIComponent(`Hola ${reservaSeleccionada.nombre}, te escribimos desde Colombia Travel sobre tu reserva en ${reservaSeleccionada.hotel_nombre}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm flex-fill d-inline-flex align-items-center justify-content-center gap-1"
                  style={{ backgroundColor: "#25d366", color: "white", borderRadius: "0.5rem" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                  </svg>
                  WhatsApp
                </a>
                <a
                  href={`mailto:${reservaSeleccionada.correo}?subject=${encodeURIComponent(`Colombia Travel - Reserva en ${reservaSeleccionada.hotel_nombre}`)}&body=${encodeURIComponent(`Hola ${reservaSeleccionada.nombre},\n\nTe escribimos desde Colombia Travel sobre tu reserva en ${reservaSeleccionada.hotel_nombre} (${reservaSeleccionada.destino_nombre}).\n\nFecha de entrada: ${new Date(reservaSeleccionada.fecha_inicio).toLocaleDateString("es-CO")}\nFecha de salida: ${new Date(reservaSeleccionada.fecha_fin).toLocaleDateString("es-CO")}\n\n¿En qué podemos ayudarte?\n\nSaludos,\nEquipo Colombia Travel`)}`}
                  className="btn btn-sm flex-fill d-inline-flex align-items-center justify-content-center gap-1"
                  style={{ backgroundColor: "#ea4335", color: "white", borderRadius: "0.5rem" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
                  </svg>
                  Correo
                </a>
              </div>

              <div className="mb-3">
                <h6 className="text-uppercase text-muted mb-2" style={{ fontSize: "0.75rem" }}>Cambiar estado</h6>
                <div className="d-flex gap-2">
                  {["pendiente", "confirmada", "cancelada"].map((estado) => (
                    <button
                      key={estado}
                      className={`btn btn-sm flex-fill ${reservaSeleccionada.estado === estado ? "fw-bold" : ""}`}
                      style={{
                        backgroundColor: reservaSeleccionada.estado === estado
                          ? (estado === "confirmada" ? "#d1fae5" : estado === "pendiente" ? "#fef3c7" : "#fee2e2")
                          : "#f3f4f6",
                        color: reservaSeleccionada.estado === estado
                          ? (estado === "confirmada" ? "#065f46" : estado === "pendiente" ? "#92400e" : "#991b1b")
                          : "#6b7280",
                        border: reservaSeleccionada.estado === estado ? "2px solid currentColor" : "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                      }}
                      onClick={() => onChangeEstado(reservaSeleccionada.id, estado)}
                    >
                      {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="btn btn-sm w-100 d-inline-flex align-items-center justify-content-center gap-1"
                style={{ backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: "0.5rem" }}
                onClick={() => onDeleteReserva(reservaSeleccionada.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3V2h11v1h-11z"/>
                </svg>
                Eliminar reserva
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReservasTab;
