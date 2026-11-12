import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { apiFetch } from '../services/api'
import { fetchCart } from '../store/slices/cartSlice'
import { logout } from '../store/slices/userSlice'

// Motivos de rechazo que devuelve el pago simulado del backend (PagoSimuladoService)
const MOTIVOS_RECHAZO = {
  TARJETA_RECHAZADA: 'La tarjeta fue rechazada.',
  FONDOS_INSUFICIENTES: 'La tarjeta no tiene fondos suficientes.'
}

// Paso de pago: muestra el resumen del carrito y pide la tarjeta.
// POST /api/ordenes-compra/{usuarioId}/checkout responde:
//   201 -> orden PAGADA: el backend descontó el stock y vació el carrito
//   402 -> orden RECHAZADA: no se cobró nada, el carrito queda igual y se puede reintentar
//   400 -> no se pudo armar la orden (stock insuficiente, carrito vacío, tarjeta inválida)
function Checkout() {
  const { token, usuario } = useSelector((state) => state.user)
  const carrito = useSelector((state) => state.cart.items)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [numeroTarjeta, setNumeroTarjeta] = useState('')
  const [pagando, setPagando] = useState(false)
  const [error, setError] = useState(null)

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

  // Sin productos no hay nada que pagar (ej: entró a /checkout a mano)
  if (carrito.length === 0 && !pagando) {
    return <Navigate to="/cart" replace />
  }

  // Agrupa los dígitos de a 4 mientras se escribe: "4111111111111111" -> "4111 1111 1111 1111"
  const handleTarjeta = (e) => {
    const digitos = e.target.value.replace(/\D/g, '').slice(0, 19)
    setNumeroTarjeta(digitos.replace(/(\d{4})(?=\d)/g, '$1 '))
  }

  const handlePagar = async (e) => {
    e.preventDefault()
    setPagando(true)
    setError(null)

    try {
      const orden = await apiFetch(`/api/ordenes-compra/${usuario.id}/checkout`, {
        method: 'POST',
        token,
        body: JSON.stringify({ numeroTarjeta })
      })
      // Pago aprobado: se trae el carrito (ya vacío) y se muestra la orden
      await dispatch(fetchCart())
      navigate(`/ordenes/${orden.id}`, { replace: true, state: { recienComprada: true } })
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        dispatch(logout())
        return
      }
      if (err.status === 402) {
        const motivo = MOTIVOS_RECHAZO[err.datos?.motivoRechazo] ?? 'El pago fue rechazado.'
        setError(`${motivo} No se cobró nada: podés intentar con otra tarjeta.`)
      } else if (err.status === 400) {
        // Mensaje del backend, ej: "Stock insuficiente para Mate UADE"
        setError(err.message)
        dispatch(fetchCart()) // por si el carrito cambió (stock, productos dados de baja)
      } else {
        setError('No se pudo procesar el pago. Intentá de nuevo.')
      }
      setPagando(false)
    }
  }

  return (
    <div className="cart-page">
      <Link to="/cart" className="back-link">← Volver al carrito</Link>

      <div className="cart-layout">
        {/* COLUMNA IZQUIERDA: datos de pago */}
        <div className="cart-items-section">
          <h1 className="cart-title">Finalizar compra</h1>

          <form onSubmit={handlePagar} className="checkout-form">
            <h2>Pago con tarjeta</h2>

            {error && <p className="error-msg">{error}</p>}

            <div className="form-group">
              <label>Número de tarjeta</label>
              <input
                value={numeroTarjeta}
                onChange={handleTarjeta}
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="4111 1111 1111 1111"
                minLength={4}
                required
              />
            </div>

            {/* El pago es simulado: el resultado depende de los últimos 4 dígitos */}
            <div className="checkout-ayuda">
              <strong>Pago simulado, no se cobra nada.</strong> Tarjetas de prueba:
              <ul>
                <li>Termina en <code>0002</code>: rechazada</li>
                <li>Termina en <code>9995</code>: fondos insuficientes</li>
                <li>Cualquier otra: aprobada</li>
              </ul>
            </div>

            <button type="submit" className="btn-primary btn-full" disabled={pagando}>
              {pagando ? 'Procesando pago...' : `Pagar $${total.toLocaleString('es-AR')}`}
            </button>
          </form>
        </div>

        {/* COLUMNA DERECHA: resumen */}
        <div className="cart-summary-section">
          <h2>Resumen</h2>
          <div className="summary-list">
            {carrito.map((item) => (
              <div key={item.id} className="summary-row">
                <span>{item.nombre} ×{item.cantidad}</span>
                <span>${(item.precio * item.cantidad).toLocaleString('es-AR')}</span>
              </div>
            ))}
          </div>
          <hr className="summary-divider" />
          <div className="summary-total">
            <span>Total</span>
            <span>${total.toLocaleString('es-AR')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
