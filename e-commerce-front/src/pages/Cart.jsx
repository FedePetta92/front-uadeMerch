import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import QuantitySelector from '../components/QuantitySelector'

function Cart() {
  const { carrito, eliminar, actualizar, vaciar } = useCart()

  // Suma precio * cantidad de cada item para obtener el total
  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

  return (
    <div className="cart">
      <Link to="/catalogo">← Volver al catálogo</Link>
      <h2>Tu carrito</h2>

      {carrito.length > 0 ? (
        <>
          <ul>
            {carrito.map((item) => (
              <li key={item.id}>
                {item.nombre}
                <QuantitySelector
                  cantidad={item.cantidad}
                  onChange={(nueva) => actualizar(item.id, nueva)}
                  min={1}
                  max={item.stock}
                />
                ${(item.precio * item.cantidad).toLocaleString('es-AR')}
                <button onClick={() => eliminar(item.id)}>Quitar</button>
              </li>
            ))}
          </ul>
          <p><strong>Total: ${total.toLocaleString('es-AR')}</strong></p>
          <button onClick={vaciar}>Vaciar carrito</button>
        </>
      ) : (
        <p>Tu carrito está vacío</p>
      )}
    </div>
  )
}

export default Cart
