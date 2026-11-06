import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import QuantitySelector from '../components/QuantitySelector'

function Cart() {
  const { carrito, eliminar, actualizar, vaciar } = useCart()

  // Calculamos el total general
  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

  if (carrito.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Tu carrito está vacío</h2>
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
          
          <div className="cart-items-list">
            {carrito.map((item) => (
              <div key={item.id} className="cart-item-card">
                {/* Imagen */}
                <div className="cart-item-image">
                  [IMAGEN]
                </div>
                
                {/* Nombre y Precio Unitario */}
                <div className="cart-item-info">
                  <h3>{item.nombre}</h3>
                  <p>${item.precio.toLocaleString('es-AR')} c/u</p>
                </div>

                {/* Selector de cantidad */}
                <div className="cart-item-qty">
                  <QuantitySelector
                    cantidad={item.cantidad}
                    onChange={(nueva) => actualizar(item.id, nueva)}
                    min={1}
                    max={item.stock}
                  />
                </div>

                {/* Subtotal (Precio * Cantidad) */}
                <div className="cart-item-subtotal">
                  ${(item.precio * item.cantidad).toLocaleString('es-AR')}
                </div>

                {/* Botón Eliminar */}
                <button onClick={() => eliminar(item.id)} className="btn-eliminar">
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
            <button className="btn-primary btn-full">Finalizar compra</button>
            <button onClick={vaciar} className="btn-secondary btn-full">Vaciar carrito</button>
            <Link to="/catalogo" className="link-seguir-comprando">Seguir comprando</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
