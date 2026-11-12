import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { apiFetch } from '../services/api'
import { logout } from '../store/slices/userSlice'
import { formatearFecha } from '../utils/formato'

// Historial de órdenes del usuario logueado: GET /api/ordenes-compra/usuario/{usuarioId}
// (el backend las devuelve de la más nueva a la más vieja). Incluye las rechazadas.
function MisCompras() {
  const { token, usuario } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [ordenes, setOrdenes] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    apiFetch(`/api/ordenes-compra/usuario/${usuario.id}`, { token })
      .then(setOrdenes)
      .catch((err) => {
        if (err.status === 401 || err.status === 403) dispatch(logout())
        else setError('No se pudieron cargar tus compras')
      })
  }, [usuario.id, token, dispatch])

  if (error) return <p className="error-msg">{error}</p>
  if (!ordenes) return <p>Cargando compras...</p>

  if (ordenes.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Todavía no hiciste compras</h2>
        <Link to="/catalogo" className="btn-primary">Ir al catálogo</Link>
      </div>
    )
  }

  return (
    <div className="orden-page">
      <h1>Mis compras</h1>
      <div className="tabla-scroll">
        <table className="admin-tabla">
          <thead>
            <tr>
              <th>Orden</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th className="num">Productos</th>
              <th className="num">Total</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((o) => (
              <tr key={o.id}>
                <td><Link to={`/ordenes/${o.id}`}>#{o.id}</Link></td>
                <td>{formatearFecha(o.fecha)}</td>
                <td>
                  <span className={`estado-badge ${o.estado === 'PAGADA' ? 'estado-pagada' : 'estado-rechazada'}`}>
                    {o.estado}
                  </span>
                </td>
                <td className="num">{o.items.reduce((acc, i) => acc + i.cantidad, 0)}</td>
                <td className="num">${Number(o.total).toLocaleString('es-AR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MisCompras
