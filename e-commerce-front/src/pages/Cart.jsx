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
      <Link to="/catalogo" style={{ color: '#002b5c', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
        ← Volver al catálogo
      </Link>
      <h2>Tu carrito</h2>

      {carrito.length > 0 ? (
        <>
          <ul>
            {carrito.map((item) => (
              <li key={item.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                  <div style={{ width: '80px', height: '80px', backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', textAlign: 'center' }}>
                    [IMAGEN]
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>{item.nombre}</h3>
                    <p style={{ margin: 0, color: '#777' }}>${item.precio.toLocaleString('es-AR')} c/u</p>
                  </div>
                </div>
                
                <QuantitySelector
                  cantidad={item.cantidad}
                  onChange={(nueva) => dispatch(actualizar({ id: item.id, cantidad: nueva }))}
                  min={1}
                  max={item.stock}
                />
                
                <div style={{ fontWeight: 'bold', width: '100px', textAlign: 'right' }}>
                  ${(item.precio * item.cantidad).toLocaleString('es-AR')}
                </div>
                
                <button
                  onClick={() => dispatch(eliminar(item.id))}
                  className="btn-secondary"
                  style={{ padding: '5px 15px', fontSize: '0.9rem' }}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            Total: ${total.toLocaleString('es-AR')}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button onClick={() => dispatch(vaciar())} className="btn-secondary">Vaciar carrito</button>
            <button className="btn-primary" style={{ padding: '15px 30px' }}>Finalizar compra</button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ fontSize: '1.2rem', color: '#777' }}>Tu carrito está vacío</p>
          <p>Todavía no agregaste productos.</p>
          <Link to="/catalogo" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Ir al catálogo</Link>
        </div>
      )}
    </div>
  )
}

export default Cart