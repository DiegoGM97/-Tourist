import { useState } from "react";
import toast from "react-hot-toast";
import apiFetch from "../../config/api.js";
import { getDestinoNombre } from "../../config/destinos.js";

function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const emptyHotel = { slug: "", destino_slug: "", nombre: "", descripcion: "", precio_noche: "", imagen: "", estrellas: "3", tipo: "", comodidades: "" };

function HotelesTab({ hoteles, destinos, onRefresh }) {
  const [formHotel, setFormHotel] = useState(emptyHotel);
  const [editingHotel, setEditingHotel] = useState(null);

  const inputClass = "form-control";
  const labelClass = "form-label fw-semibold mb-1";

  const parseArray = (text) => text.split(",").map(s => s.trim()).filter(Boolean);

  const cancelEdit = () => {
    setEditingHotel(null);
    setFormHotel(emptyHotel);
  };

  const handleEditHotel = (h) => {
    setEditingHotel(h.slug);
    setFormHotel({
      slug: h.slug,
      destino_slug: h.destino_slug,
      nombre: h.nombre,
      descripcion: h.descripcion,
      precio_noche: h.precio_noche,
      imagen: h.imagen,
      estrellas: String(h.estrellas),
      tipo: h.tipo || "",
      comodidades: (h.comodidades || []).join(", "),
    });
    window.scrollTo({ top: document.getElementById("form-hotel").offsetTop - 20, behavior: "smooth" });
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    try {
      await apiFetch("/hoteles", {
        method: "POST",
        body: JSON.stringify({
          slug: formHotel.slug,
          destino_slug: formHotel.destino_slug,
          nombre: formHotel.nombre,
          descripcion: formHotel.descripcion,
          precio_noche: parseFloat(formHotel.precio_noche),
          imagen: formHotel.imagen,
          estrellas: parseInt(formHotel.estrellas),
          tipo: formHotel.tipo,
          comodidades: parseArray(formHotel.comodidades),
        }),
      });
      toast.success("Hotel creado");
      setFormHotel(emptyHotel);
      onRefresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdateHotel = async (e) => {
    e.preventDefault();
    try {
      await apiFetch(`/hoteles/${editingHotel}`, {
        method: "PUT",
        body: JSON.stringify({
          destino_slug: formHotel.destino_slug,
          nombre: formHotel.nombre,
          descripcion: formHotel.descripcion,
          precio_noche: parseFloat(formHotel.precio_noche),
          imagen: formHotel.imagen,
          estrellas: parseInt(formHotel.estrellas),
          tipo: formHotel.tipo,
          comodidades: parseArray(formHotel.comodidades),
        }),
      });
      toast.success("Hotel actualizado");
      cancelEdit();
      onRefresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteHotel = (slug) => {
    window.__confirmModal?.({
      titulo: "Eliminar hotel",
      mensaje: `¿Estás seguro de eliminar el hotel "${slug}"? Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        try {
          await apiFetch(`/hoteles/${slug}`, { method: "DELETE" });
          toast.success("Hotel eliminado");
          onRefresh();
        } catch (err) {
          toast.error(err.message);
        }
      },
    });
  };

  return (
    <div className="row g-4">
      <div className="col-12" id="form-hotel">
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0 fw-bold" style={{ color: "#0f766e" }}>
                {editingHotel ? (
                  <><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="me-2" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168z"/></svg> Editar Hotel</>
                ) : (
                  <><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="me-2" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/></svg> Agregar Hotel</>
                )}
              </h4>
              {editingHotel && (
                <button className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1" onClick={cancelEdit}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                  </svg>
                  Cancelar
                </button>
              )}
            </div>
            <form onSubmit={editingHotel ? handleUpdateHotel : handleAddHotel}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className={labelClass}>Nombre *</label>
                  <input className={inputClass} required value={formHotel.nombre} onChange={e => {
                    const nombre = e.target.value;
                    if (!editingHotel) {
                      setFormHotel({...formHotel, nombre, slug: generateSlug(nombre)});
                    } else {
                      setFormHotel({...formHotel, nombre});
                    }
                  }} placeholder="Hotel Mi Nombre" />
                  <input type="hidden" value={formHotel.slug} />
                </div>
                <div className="col-md-4">
                  <label className={labelClass}>Destino *</label>
                  <select className={inputClass} required value={formHotel.destino_slug} onChange={e => setFormHotel({...formHotel, destino_slug: e.target.value})}>
                    <option value="">Seleccionar destino</option>
                    {destinos.map(d => <option key={d.slug} value={d.slug}>{d.nombre}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className={labelClass}>Slug</label>
                  <input className={inputClass + " bg-light"} value={formHotel.slug} disabled />
                </div>
                <div className="col-12">
                  <label className={labelClass}>Descripción *</label>
                  <textarea className={inputClass} rows="2" required value={formHotel.descripcion} onChange={e => setFormHotel({...formHotel, descripcion: e.target.value})} placeholder="Descripción del hotel" />
                </div>
                <div className="col-md-3">
                  <label className={labelClass}>Precio por noche *</label>
                  <input className={inputClass} type="number" required value={formHotel.precio_noche} onChange={e => setFormHotel({...formHotel, precio_noche: e.target.value})} placeholder="450000" />
                </div>
                <div className="col-md-3">
                  <label className={labelClass}>URL de imagen *</label>
                  <input className={inputClass} required value={formHotel.imagen} onChange={e => setFormHotel({...formHotel, imagen: e.target.value})} placeholder="https://..." />
                </div>
                <div className="col-md-2">
                  <label className={labelClass}>Estrellas</label>
                  <select className={inputClass} value={formHotel.estrellas} onChange={e => setFormHotel({...formHotel, estrellas: e.target.value})}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} estrella{n>1?"s":""}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className={labelClass}>Tipo</label>
                  <input className={inputClass} value={formHotel.tipo} onChange={e => setFormHotel({...formHotel, tipo: e.target.value})} placeholder="Resort All Inclusive" />
                </div>
                <div className="col-12">
                  <label className={labelClass}>Comodidades (separadas por coma)</label>
                  <textarea className={inputClass} rows="2" value={formHotel.comodidades} onChange={e => setFormHotel({...formHotel, comodidades: e.target.value})} placeholder="Piscina, Wifi, Spa, Restaurante" />
                </div>
              </div>
              <button type="submit" className="btn text-white mt-4 px-4 py-2 fw-semibold" style={{ backgroundColor: "#0f766e", borderRadius: "0.5rem" }}>
                {editingHotel ? (
                  <><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/></svg> Actualizar Hotel</>
                ) : (
                  <><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/></svg> Agregar Hotel</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="col-12">
        <h5 className="fw-bold mb-3" style={{ color: "#0f766e" }}>Listado de Hoteles</h5>
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead style={{ backgroundColor: "#f0fdfa" }}>
                  <tr>
                    <th className="ps-4" style={{ color: "#0f766e", fontWeight: 700 }}>Nombre</th>
                    <th style={{ color: "#0f766e", fontWeight: 700 }}>Destino</th>
                    <th style={{ color: "#0f766e", fontWeight: 700 }}>Precio / Noche</th>
                    <th style={{ color: "#0f766e", fontWeight: 700 }}>Estrellas</th>
                    <th className="text-end pe-4" style={{ color: "#0f766e", fontWeight: 700 }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {hoteles.map((h) => (
                    <tr key={h.slug} style={editingHotel === h.slug ? { backgroundColor: "#f0fdfa" } : {}}>
                      <td className="ps-4">
                        <div className="fw-semibold" style={{ color: "#111827" }}>{h.nombre}</div>
                        <small className="text-muted">{h.slug}</small>
                      </td>
                      <td><span className="badge" style={{ backgroundColor: "#e0f2fe", color: "#0369a1" }}>{getDestinoNombre(h.destino_slug)}</span></td>
                      <td className="fw-semibold" style={{ color: "#0f766e" }}>${Number(h.precio_noche).toLocaleString("es-CO")}</td>
                      <td>
                        <span style={{ color: "#0f766e", letterSpacing: "2px" }}>{"★".repeat(h.estrellas)}</span>
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-flex gap-2 justify-content-end">
                          <button
                            className="btn btn-sm d-inline-flex align-items-center gap-1"
                            style={{ backgroundColor: "#0f766e", color: "white", borderRadius: "0.5rem", padding: "0.4rem 0.8rem" }}
                            onClick={() => handleEditHotel(h)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                            </svg>
                            Editar
                          </button>
                          <button
                            className="btn btn-sm d-inline-flex align-items-center"
                            style={{ backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: "0.5rem", padding: "0.4rem 0.6rem" }}
                            onClick={() => handleDeleteHotel(h.slug)}
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

export default HotelesTab;
