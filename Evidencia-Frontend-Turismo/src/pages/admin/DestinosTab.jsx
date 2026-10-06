import { useState } from "react";
import toast from "react-hot-toast";
import apiFetch from "../../config/api.js";

function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const emptyDestino = { slug: "", nombre: "", subtitulo: "", descripcion_corta: "", descripcion_larga: "", imagen: "", clima: "", mejor_epoca: "", lugares: "", actividades: "", consejos: "" };

function DestinosTab({ destinos, onRefresh }) {
  const [formDestino, setFormDestino] = useState(emptyDestino);
  const [editingDestino, setEditingDestino] = useState(null);

  const inputClass = "form-control";
  const labelClass = "form-label fw-semibold mb-1";

  const parseLugares = (text) => {
    return text.split(",").map(s => s.trim()).filter(Boolean).map(item => {
      const [nombre, descripcion] = item.split(":").map(s => s.trim());
      return { nombre, descripcion: descripcion || "" };
    });
  };

  const parseArray = (text) => text.split(",").map(s => s.trim()).filter(Boolean);

  const cancelEdit = () => {
    setEditingDestino(null);
    setFormDestino(emptyDestino);
  };

  const handleEditDestino = (d) => {
    setEditingDestino(d.slug);
    setFormDestino({
      slug: d.slug,
      nombre: d.nombre,
      subtitulo: d.subtitulo || "",
      descripcion_corta: d.descripcion_corta,
      descripcion_larga: d.descripcion_larga,
      imagen: d.imagen,
      clima: d.clima || "",
      mejor_epoca: d.mejor_epoca || "",
      lugares: (d.lugares_interes || []).map(l => `${l.nombre}:${l.descripcion}`).join(", "),
      actividades: (d.actividades || []).join(", "),
      consejos: (d.consejos || []).join(", "),
    });
    window.scrollTo({ top: document.getElementById("form-destino").offsetTop - 20, behavior: "smooth" });
  };

  const handleAddDestino = async (e) => {
    e.preventDefault();
    try {
      await apiFetch("/destinos", {
        method: "POST",
        body: JSON.stringify({
          slug: formDestino.slug,
          nombre: formDestino.nombre,
          subtitulo: formDestino.subtitulo,
          descripcion_corta: formDestino.descripcion_corta,
          descripcion_larga: formDestino.descripcion_larga,
          imagen: formDestino.imagen,
          clima: formDestino.clima,
          mejor_epoca: formDestino.mejor_epoca,
          lugares_interes: parseLugares(formDestino.lugares),
          actividades: parseArray(formDestino.actividades),
          consejos: parseArray(formDestino.consejos),
        }),
      });
      toast.success("Destino creado");
      setFormDestino(emptyDestino);
      onRefresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdateDestino = async (e) => {
    e.preventDefault();
    try {
      await apiFetch(`/destinos/${editingDestino}`, {
        method: "PUT",
        body: JSON.stringify({
          nombre: formDestino.nombre,
          subtitulo: formDestino.subtitulo,
          descripcion_corta: formDestino.descripcion_corta,
          descripcion_larga: formDestino.descripcion_larga,
          imagen: formDestino.imagen,
          clima: formDestino.clima,
          mejor_epoca: formDestino.mejor_epoca,
          lugares_interes: parseLugares(formDestino.lugares),
          actividades: parseArray(formDestino.actividades),
          consejos: parseArray(formDestino.consejos),
        }),
      });
      toast.success("Destino actualizado");
      cancelEdit();
      onRefresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteDestino = (slug) => {
    window.__confirmModal?.({
      titulo: "Eliminar destino",
      mensaje: `¿Estás seguro de eliminar el destino "${slug}"? Se eliminarán también todos los hoteles asociados.`,
      onConfirm: async () => {
        try {
          await apiFetch(`/destinos/${slug}`, { method: "DELETE" });
          toast.success("Destino eliminado");
          onRefresh();
        } catch (err) {
          toast.error(err.message);
        }
      },
    });
  };

  return (
    <div className="row g-4">
      <div className="col-12" id="form-destino">
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0 fw-bold" style={{ color: "#0f766e" }}>
                {editingDestino ? (
                  <><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="me-2" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168z"/></svg> Editar Destino</>
                ) : (
                  <><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="me-2" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/></svg> Agregar Destino</>
                )}
              </h4>
              {editingDestino && (
                <button className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1" onClick={cancelEdit}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                  </svg>
                  Cancelar
                </button>
              )}
            </div>
            <form onSubmit={editingDestino ? handleUpdateDestino : handleAddDestino}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className={labelClass}>Nombre *</label>
                  <input className={inputClass} required value={formDestino.nombre} onChange={e => {
                    const nombre = e.target.value;
                    if (!editingDestino) {
                      setFormDestino({...formDestino, nombre, slug: generateSlug(nombre)});
                    } else {
                      setFormDestino({...formDestino, nombre});
                    }
                  }} placeholder="Mi Destino" />
                  <input type="hidden" value={formDestino.slug} />
                </div>
                <div className="col-md-4">
                  <label className={labelClass}>Subtítulo</label>
                  <input className={inputClass} value={formDestino.subtitulo} onChange={e => setFormDestino({...formDestino, subtitulo: e.target.value})} placeholder="Breve subtítulo" />
                </div>
                <div className="col-md-4">
                  <label className={labelClass}>Slug</label>
                  <input className={inputClass + " bg-light"} value={formDestino.slug} disabled />
                </div>
                <div className="col-12">
                  <label className={labelClass}>Descripción corta *</label>
                  <input className={inputClass} required value={formDestino.descripcion_corta} onChange={e => setFormDestino({...formDestino, descripcion_corta: e.target.value})} placeholder="Descripción para la tarjeta" />
                </div>
                <div className="col-12">
                  <label className={labelClass}>Descripción larga *</label>
                  <textarea className={inputClass} rows="2" required value={formDestino.descripcion_larga} onChange={e => setFormDestino({...formDestino, descripcion_larga: e.target.value})} placeholder="Descripción completa del destino" />
                </div>
                <div className="col-md-6">
                  <label className={labelClass}>URL de imagen *</label>
                  <input className={inputClass} required value={formDestino.imagen} onChange={e => setFormDestino({...formDestino, imagen: e.target.value})} placeholder="https://..." />
                </div>
                <div className="col-md-3">
                  <label className={labelClass}>Clima</label>
                  <input className={inputClass} value={formDestino.clima} onChange={e => setFormDestino({...formDestino, clima: e.target.value})} placeholder="Tropical cálido..." />
                </div>
                <div className="col-md-3">
                  <label className={labelClass}>Mejor época</label>
                  <input className={inputClass} value={formDestino.mejor_epoca} onChange={e => setFormDestino({...formDestino, mejor_epoca: e.target.value})} placeholder="De diciembre a mayo..." />
                </div>
                <div className="col-md-4">
                  <label className={labelClass}>Lugares (separados por coma, nombre:descripción)</label>
                  <textarea className={inputClass} rows="2" value={formDestino.lugares} onChange={e => setFormDestino({...formDestino, lugares: e.target.value})} placeholder="Playa Bonita:Hermosa playa, Montaña:Vistas increíbles" />
                </div>
                <div className="col-md-4">
                  <label className={labelClass}>Actividades (separadas por coma)</label>
                  <textarea className={inputClass} rows="2" value={formDestino.actividades} onChange={e => setFormDestino({...formDestino, actividades: e.target.value})} placeholder="Snorkel, Buceo, Kayak" />
                </div>
                <div className="col-md-4">
                  <label className={labelClass}>Consejos (separados por coma)</label>
                  <textarea className={inputClass} rows="2" value={formDestino.consejos} onChange={e => setFormDestino({...formDestino, consejos: e.target.value})} placeholder="Llevar protector solar, Ir temprano" />
                </div>
              </div>
              <button type="submit" className="btn text-white mt-4 px-4 py-2 fw-semibold" style={{ backgroundColor: "#0f766e", borderRadius: "0.5rem" }}>
                {editingDestino ? (
                  <><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/></svg> Actualizar Destino</>
                ) : (
                  <><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/></svg> Agregar Destino</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="col-12">
        <h5 className="fw-bold mb-3" style={{ color: "#0f766e" }}>Listado de Destinos</h5>
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead style={{ backgroundColor: "#f0fdfa" }}>
                  <tr>
                    <th className="ps-4" style={{ color: "#0f766e", fontWeight: 700 }}>Nombre</th>
                    <th style={{ color: "#0f766e", fontWeight: 700 }}>Subtítulo</th>
                    <th className="text-end pe-4" style={{ color: "#0f766e", fontWeight: 700 }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {destinos.map((d) => (
                    <tr key={d.slug} style={editingDestino === d.slug ? { backgroundColor: "#f0fdfa" } : {}}>
                      <td className="ps-4">
                        <div className="fw-semibold" style={{ color: "#111827" }}>{d.nombre}</div>
                        <small className="text-muted">{d.slug}</small>
                      </td>
                      <td className="text-muted">{d.subtitulo || "—"}</td>
                      <td className="text-end pe-4">
                        <div className="d-flex gap-2 justify-content-end">
                          <button
                            className="btn btn-sm d-inline-flex align-items-center gap-1"
                            style={{ backgroundColor: "#0f766e", color: "white", borderRadius: "0.5rem", padding: "0.4rem 0.8rem" }}
                            onClick={() => handleEditDestino(d)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                            </svg>
                            Editar
                          </button>
                          <button
                            className="btn btn-sm d-inline-flex align-items-center"
                            style={{ backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: "0.5rem", padding: "0.4rem 0.6rem" }}
                            onClick={() => handleDeleteDestino(d.slug)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3V2h11v1h-11z"/>
                            </svg>
                          </button>
                        </div>
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

export default DestinosTab;
