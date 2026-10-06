function UsuariosTab({ usuarios }) {
  return (
    <div className="row g-4">
      <div className="col-12">
        <h5 className="fw-bold mb-3" style={{ color: "#0f766e" }}>Usuarios Registrados</h5>
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead style={{ backgroundColor: "#f0fdfa" }}>
                  <tr>
                    <th className="ps-4" style={{ color: "#0f766e", fontWeight: 700 }}>ID</th>
                    <th style={{ color: "#0f766e", fontWeight: 700 }}>Nombre</th>
                    <th style={{ color: "#0f766e", fontWeight: 700 }}>Correo</th>
                    <th style={{ color: "#0f766e", fontWeight: 700 }}>Rol</th>
                    <th className="text-end pe-4" style={{ color: "#0f766e", fontWeight: 700 }}>Registro</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id}>
                      <td className="ps-4"><code>{u.id}</code></td>
                      <td className="fw-semibold" style={{ color: "#111827" }}>{u.nombre}</td>
                      <td className="text-muted">{u.correo}</td>
                      <td>
                        <span className="badge" style={{ backgroundColor: u.rol === "admin" ? "#0f766e" : "#e2e8f0", color: u.rol === "admin" ? "white" : "#475569" }}>
                          {u.rol}
                        </span>
                      </td>
                      <td className="text-end pe-4 text-muted">
                        {new Date(u.created_at).toLocaleDateString("es-CO")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsuariosTab;
