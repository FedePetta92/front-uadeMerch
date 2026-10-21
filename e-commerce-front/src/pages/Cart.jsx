import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { eliminar, actualizar, vaciar } from '../store/slices/cartSlice'
import QuantitySelector from '../components/QuantitySelector'

function Cart() {
  // useSelector suscribe este componente al carrito: si cambia, se vuelve a dibujar
  const carrito = useSelector((state) => state.cart.items)
  // dispatch sirve para ejecutar las acciones del slice
  const dispatch = useDispatch()

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
                  onChange={(nueva) => dispatch(actualizar({ id: item.id, cantidad: nueva }))}
                  min={1}
                  max={item.stock}
                />
                ${(item.precio * item.cantidad).toLocaleString('es-AR')}
                <button onClick={() => dispatch(eliminar(item.id))}>Quitar</button>
              </li>
            ))}
          </ul>
          <p><strong>Total: ${total.toLocaleString('es-AR')}</strong></p>
          <button onClick={() => dispatch(vaciar())}>Vaciar carrito</button>
        </>
      ) : (
        <p>Tu carrito está vacío</p>
      )}
    </div>
  )
}

export default Cart