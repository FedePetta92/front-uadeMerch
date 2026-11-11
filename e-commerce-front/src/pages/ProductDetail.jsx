import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import { selectLogueado } from '../store/slices/userSlice'
import QuantitySelector from '../components/QuantitySelector'

// URL base del backend. Todos los fetch apuntan a este servidor.
const API_URL = 'http://localhost:8080'

function ProductDetail() {

  // useParams extrae el :id de la URL, ej: /product/3 → id = "3"
  const { id } = useParams()
  const carrito = useSelector((state) => state.cart.items)
  // cargando: hay un pedido al carrito en curso / error: el último pedido falló
  const { cargando: guardando, error: errorCarrito } = useSelector((state) => state.cart)
  const logueado = useSelector(selectLogueado)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [cantidad, setCantidad] = useState(1)

  // resultado guarda la respuesta del backend junto con el id que se pidió
  const [resultado, setResultado] = useState({ id: null, producto: null, error: null })
  const { producto, error } = resultado

  // cargando: true mientras el resultado guardado no sea del id de la URL
  const cargando = resultado.id !== id

  useEffect(() => {
    // Si el usuario cambia de producto antes de que llegue la respuesta, la vieja se ignora
    let cancelado = false

    fetch(`${API_URL}/api/productos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Producto no encontrado')
        return res.json()
      })
      .then((data) => {
        if (!cancelado) setResultado({ id, producto: data, error: null })
      })
      .catch((err) => {
        if (!cancelado) setResultado({ id, producto: null, error: err.message })
      })

    return () => { cancelado = true }
  }, [id])

  if (cargando) return <p>Cargando producto...</p>

  if (error) return (
    <div>
      <p>{error}</p>
      <Link to="/catalogo">Volver al catálogo</Link>
    </div>
  )

  // Cuántas unidades de este producto ya están en el carrito
  const enCarrito = carrito.find((item) => item.id === producto.id)?.cantidad ?? 0

  // Cuántas se pueden agregar todavía sin superar el stock
  const disponible = producto.stock - enCarrito

  const handleAgregar = () => {
    // El carrito se guarda en la DB por usuario: sin sesión, primero hay que loguearse
    if (!logueado) {
      navigate('/login')
      return
    }
    dispatch(addToCart({ producto, cantidad }))
    setCantidad(1)
  }

  return (
    <div className="product-detail-wrapper">

      <Link to="/catalogo" className="back-link">
        ← Volver al catálogo
      </Link>

      <div className="product-detail-grid">

        {/* COLUMNA IZQUIERDA: La Imagen */}
        <div className="product-detail-image">
          <div className="image-placeholder">
            [IMAGEN DEL PRODUCTO]
          </div>
        </div>

        {/* COLUMNA DERECHA: La Información y Botones */}
        <div className="product-detail-info">
          <h1 className="detail-title">{producto.nombre}</h1>

          <p className="detail-description">{producto.descripcion}</p>

          <div className="info-precio-stock">
            <p className="detail-price">${Number(producto.precio).toLocaleString('es-AR')}</p>
            <p className="detail-stock">Stock: {producto.stock}</p>
          </div>

          {errorCarrito && <p className="error-msg">{errorCarrito}</p>}

          {disponible > 0 ? (
            <>
              <div className="detail-actions">
                <QuantitySelector cantidad={cantidad} onChange={setCantidad} min={1} max={disponible} />
              </div>

              <div className="detail-buttons">
                <button
                  onClick={handleAgregar}
                  className="btn-primary"
                  disabled={guardando || cantidad < 1 || cantidad > disponible}
                >
                  {guardando ? 'Agregando...' : 'Agregar al carrito'}
                </button>

                <Link to="/cart" className="btn-secondary">
                  Ir al carrito
                </Link>
              </div>
            </>
          ) : (
            <p>Ya tenés el máximo de stock en el carrito</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail