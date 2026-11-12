import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { updateCartItem, removeFromCart, clearCart } from '../store/slices/cartSlice'
import QuantitySelector from '../components/QuantitySelector'

function Cart() {
  // useSelector suscribe este componente al carrito: si cambia, se vuelve a dibujar
  const carrito = useSelector((state) => state.cart.items)
  // cargando: hay un pedido al backend en curso / error: el último pedido falló
  const { cargando, error } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Calculamos el total general
  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

  if (carrito.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Tu carrito está vacío</h2>
        {error && <p className="error-msg">{error}</p>}
        <p>Todavía no agregaste productos.</p>
        <Link to="/catalogo" className="btn-primary">Ir al catálogo</Link>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <Link to="/catalogo" className="back-link">← Volver al catálogo</Link>

      <div className="cart-layout">
        {/* COLUMNA IZQUIERDA: Lista de productos */}
        <div className="cart-items-section">
          <h1 className="cart-title">Tu carrito</h1>

          {error && <p className="error-msg">{error}</p>}

          <div className="cart-items-list">
            {carrito.map((item) => (
              <div key={item.id} className="cart-item-card">
                <div className="cart-item-image">
                  [IMAGEN]
                </div>

                <div className="cart-item-info">
                  <h3>{item.nombre}</h3>
                  <p>${item.precio.toLocaleString('es-AR')} c/u</p>
                </div>

                <div className="cart-item-qty">
                  <QuantitySelector
                    cantidad={item.cantidad}
                    // Mientras hay un pedido en curso se ignoran los clicks, para no pisar un cambio con otro
                    onChange={(nueva) => !cargando && dispatch(updateCartItem({ id: item.id, cantidad: nueva }))}
                    min={1}
                    max={item.stock}
                  />
                </div>

                <div className="cart-item-subtotal">
                  ${(item.precio * item.cantidad).toLocaleString('es-AR')}
                </div>

                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  disabled={cargando}
                  className="btn-eliminar"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: Resumen de compra */}
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

          <div className="summary-buttons">
            {/* Lleva al paso de pago (Checkout.jsx); se deshabilita mientras se guarda un cambio del carrito */}
            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary btn-full"
              disabled={cargando}
            >
              Finalizar compra
            </button>
            <button
              onClick={() => dispatch(clearCart())}
              className="btn-secondary btn-full"
              disabled={cargando}
            >
              Vaciar carrito
            </button>
            <Link to="/catalogo" className="link-seguir-comprando">Seguir comprando</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart