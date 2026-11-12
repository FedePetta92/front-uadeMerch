import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { apiFetch } from '../services/api'
import { logout } from '../store/slices/userSlice'

// Formulario vacío: se usa para "Nuevo producto" y para limpiar después de guardar
const FORM_VACIO = { nombre: '', descripcion: '', precio: '', stock: '', imagen: '' }

// Panel de administración de productos (solo ADMIN, ver AdminRoute).
// Usa los endpoints que el backend ya protege con hasRole("ADMIN"):
//   POST   /api/productos        -> crear
//   PUT    /api/productos/{id}   -> editar
//   DELETE /api/productos/{id}   -> dar de baja (borrado lógico: deja de verse en el catálogo)
function AdminProductos() {
  const token = useSelector((state) => state.user.token)
  const dispatch = useDispatch()

  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)
  const [aviso, setAviso] = useState(null)

  const [form, setForm] = useState(FORM_VACIO)
  const [editandoId, setEditandoId] = useState(null) // null = creando uno nuevo
  const [confirmarBajaId, setConfirmarBajaId] = useState(null) // id del producto que espera confirmación

  // Trae los productos activos ordenados por nombre (se usa al entrar y después de cada cambio)
  const cargarProductos = () =>
    apiFetch('/api/productos')
      .then((data) => setProductos([...data].sort((a, b) => a.nombre.localeCompare(b.nombre))))
      .catch(() => setError('No se pudieron cargar los productos'))
      .finally(() => setCargando(false))

  useEffect(() => {
    apiFetch('/api/productos')
      .then((data) => setProductos([...data].sort((a, b) => a.nombre.localeCompare(b.nombre))))
      .catch(() => setError('No se pudieron cargar los productos'))
      .finally(() => setCargando(false))
  }, [])

  // Traduce un error del backend a un mensaje. Con 401 la sesión venció: se cierra.
  const manejarError = (err) => {
    if (err.status === 401) {
      dispatch(logout())
      return
    }
    if (err.status === 403) {
      setError('Tu usuario no tiene permisos de administrador')
      return
    }
    // 400: el backend manda qué campo está mal (ej: "El precio no puede ser negativo")
    setError(err.status === 400 ? err.message : 'No se pudo guardar. Intentá de nuevo.')
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const empezarEdicion = (producto) => {
    setEditandoId(producto.id)
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? '',
      precio: String(producto.precio),
      stock: String(producto.stock),
      imagen: producto.imagen ?? ''
    })
    setError(null)
    setAviso(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelarEdicion = () => {
    setEditandoId(null)
    setForm(FORM_VACIO)
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError(null)
    setAviso(null)

    const datos = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      stock: Number(form.stock),
      imagen: form.imagen.trim() || null
    }

    try {
      if (editandoId) {
        await apiFetch(`/api/productos/${editandoId}`, { method: 'PUT', token, body: JSON.stringify(datos) })
        setAviso(`Se guardaron los cambios de "${datos.nombre}"`)
      } else {
        await apiFetch('/api/productos', { method: 'POST', token, body: JSON.stringify(datos) })
        setAviso(`Se creó "${datos.nombre}"`)
      }
      setEditandoId(null)
      setForm(FORM_VACIO)
      await cargarProductos()
    } catch (err) {
      manejarError(err)
    } finally {
      setGuardando(false)
    }
  }

  const darDeBaja = async (producto) => {
    setConfirmarBajaId(null)
    setError(null)
    setAviso(null)
    try {
      await apiFetch(`/api/productos/${producto.id}`, { method: 'DELETE', token })
      setAviso(`"${producto.nombre}" se dio de baja y ya no aparece en el catálogo`)
      if (editandoId === producto.id) cancelarEdicion()
      await cargarProductos()
    } catch (err) {
      manejarError(err)
    }
  }

  return (
    <div className="admin-page">
      <h1>Administración de productos</h1>

      {error && <p className="error-msg">{error}</p>}
      {aviso && <p className="ok-msg">{aviso}</p>}

      {/* Formulario de alta / edición. Los límites coinciden con las validaciones del backend */}
      <form onSubmit={handleSubmit} className="admin-form">
        <h2>{editandoId ? 'Editar producto' : 'Nuevo producto'}</h2>

        <div className="admin-form-grid">
          <div className="form-group">
            <label>Nombre</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} maxLength={30} required />
          </div>

          <div className="form-group">
            <label>Precio ($)</label>
            <input name="precio" type="number" min="0" step="0.01" value={form.precio} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input name="stock" type="number" min="0" step="1" value={form.stock} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Imagen (ruta)</label>
            <input name="imagen" value={form.imagen} onChange={handleChange} placeholder="/images/101.jpg" maxLength={255} />
          </div>

          <div className="form-group admin-form-ancho">
            <label>Descripción</label>
            <input name="descripcion" value={form.descripcion} onChange={handleChange} maxLength={100} />
          </div>
        </div>

        <div className="admin-form-botones">
          <button type="submit" className="btn-primary" disabled={guardando}>
            {guardando ? 'Guardando...' : editandoId ? 'Guardar cambios' : 'Crear producto'}
          </button>
          {editandoId && (
            <button type="button" className="btn-secondary" onClick={cancelarEdicion} disabled={guardando}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h2>Productos activos ({productos.length})</h2>

      {cargando ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="tabla-scroll">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th className="num">Precio</th>
                <th className="num">Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id} className={editandoId === p.id ? 'fila-editando' : ''}>
                  <td>
                    <strong>{p.nombre}</strong>
                    {p.descripcion && <div className="admin-desc">{p.descripcion}</div>}
                  </td>
                  <td className="num">${Number(p.precio).toLocaleString('es-AR')}</td>
                  <td className="num">{p.stock}</td>
                  <td className="admin-acciones">
                    <button className="btn-secondary btn-chico" onClick={() => empezarEdicion(p)}>Editar</button>
                    {/* La baja pide un segundo click para confirmar */}
                    {confirmarBajaId === p.id ? (
                      <>
                        <button className="btn-eliminar btn-chico" onClick={() => darDeBaja(p)}>Confirmar baja</button>
                        <button className="btn-secondary btn-chico" onClick={() => setConfirmarBajaId(null)}>No</button>
                      </>
                    ) : (
                      <button className="btn-eliminar btn-chico" onClick={() => setConfirmarBajaId(p.id)}>Dar de baja</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminProductos
