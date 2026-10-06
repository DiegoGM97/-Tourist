function ConfirmModal({ titulo, mensaje, onConfirm, onCancel }) {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}
      onClick={onCancel}
    >
      <div
        className="card shadow-lg w-100 mx-3"
        style={{ maxWidth: "420px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-body p-4 text-center">
          <div
            className="d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#fef3c7" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#92400e" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
            </svg>
          </div>
          <h4 className="fw-bold mb-2" style={{ color: "#111827" }}>{titulo}</h4>
          <p className="text-muted mb-4">{mensaje}</p>
          <div className="d-flex gap-2">
            <button
              className="btn flex-fill py-2 fw-semibold"
              style={{ backgroundColor: "#f3f4f6", color: "#374151", borderRadius: "0.5rem" }}
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button
              className="btn flex-fill py-2 fw-semibold text-white"
              style={{ backgroundColor: "#dc2626", borderRadius: "0.5rem" }}
              onClick={onConfirm}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
