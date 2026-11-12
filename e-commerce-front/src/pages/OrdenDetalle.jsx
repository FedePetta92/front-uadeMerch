import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { apiFetch } from '../services/api'
import { logout } from '../store/slices/userSlice'
import { formatearFecha } from '../utils/formato'

// Detalle de una orden: GET /api/ordenes-compra/{id} (el backend solo la devuelve a su dueño).
// Después de pagar, Checkout navega acá con state.recienComprada para mostrar la confirmación.
function OrdenDetalle() {
  const { id } = useParams()
  const location = useLocation()
  const token = useSelector((state) => state.user.token)
  const dispatch = useDispatch()

  const [orden, setOrden] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    apiFetch(`/api/ordenes-compra/${id}`, { token })
      .then(setOrden)
      .catch((err) => {
        if (err.status === 401) dispatch(logout())
        else if (err.status === 403 || err.status === 404) setError('No encontramos esa orden')
        else setError('No se pudo cargar la orden')
      })
  }, [id, token, dispatch])

  if (error) {
    return (
      <div className="cart-empty">
        <h2>{error}</h2>
        <Link to="/mis-compras" className="btn-primary">Ver mis compras</Link>
      </div>
    )
  }
  if (!orden) return <p>Cargando orden...</p>

  const pagada = orden.estado === 'PAGADA'

  return (
    <div className="orden-page">
      {location.state?.recienComprada && pagada && (
        <div className="orden-confirmacion">
          <h1>¡Gracias por tu compra!</h1>
          <p>El pago se aprobó. Te dejamos el detalle de la orden.</p>
        </div>
      )}

      <div className="orden-card">
        <div className="orden-encabezado">
          <h2>Orden #{orden.id}</h2>
          <span className={`estado-badge ${pagada ? 'estado-pagada' : 'estado-rechazada'}`}>{orden.estado}</span>
        </div>

        <p className="orden-datos">
          {formatearFecha(orden.fecha)} · Tarjeta terminada en {orden.tarjetaUltimos4} · Transacción {orden.transaccionId}
        </p>
        {!pagada && orden.motivoRechazo && <p className="error-msg">Motivo: {orden.motivoRechazo}</p>}

        <div className="tabla-scroll">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th className="num">Precio</th>
                <th className="num">Cantidad</th>
                <th className="num">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orden.items.map((item) => (
                <tr key={item.productoId}>
                  <td>{item.nombreProducto}</td>
                  <td className="num">${Number(item.precioUnitario).toLocaleString('es-AR')}</td>
                  <td className="num">{item.cantidad}</td>
                  <td className="num">${Number(item.subtotal).toLocaleString('es-AR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="summary-total">
          <span>Total</span>
          <span>${Number(orden.total).toLocaleString('es-AR')}</span>
        </div>
      </div>

      <div className="orden-links">
        <Link to="/catalogo" className="btn-primary">Seguir comprando</Link>
        <Link to="/mis-compras" className="btn-secondary">Ver mis compras</Link>
      </div>
    </div>
  )
}

export default OrdenDetalle
