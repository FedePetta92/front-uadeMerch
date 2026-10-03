import { Link } from 'react-router-dom'

function Cart() {
  const carrito = []

  return (
    <div className="cart">
      <Link to="/">← Volver al catálogo</Link>
      <h2>Tu carrito</h2>

      {carrito.length > 0 ? (
        <ul>
          {carrito.map((item) => (
            <li key={item.id}>{item.nombre}</li>
          ))}
        </ul>
      ) : (
        <p>Tu carrito está vacío</p>
      )}
    </div>
  )
}

export default Cart