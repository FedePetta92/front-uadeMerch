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

  // resultado guarda la respuesta del backend junto con el id que se pidió:
  // producto: objeto con los datos del backend
  // error: mensaje de error si el fetch falla
  const [resultado, setResultado] = useState({ id: null, producto: null, error: null })
  const { producto, error } = resultado

  // cargando: true mientras el resultado guardado no sea del id de la URL.
  // Se calcula en vez de guardarse con setState, así el efecto no actualiza el estado
  // de forma sincrónica (eso hace que el componente se dibuje dos veces seguidas)
  const cargando = resultado.id !== id

  // useEffect se dispara cada vez que cambia el id en la URL
  useEffect(() => {
    // Si el usuario cambia de producto antes de que llegue la respuesta, la vieja se ignora
    let cancelado = false

    // Llama al endpoint GET /api/productos/{id} para traer el detalle de un producto
    fetch(`${API_URL}/api/productos/${id}`)
      .then((res) => {
        // Si la respuesta no es 2xx (ej: 404) lanza un error
        if (!res.ok) throw new Error('Producto no encontrado')
        // Convierte la respuesta JSON a un objeto JavaScript
        return res.json()
      })
      .then((data) => {
        // Guarda el producto junto con su id (eso apaga el indicador de carga)
        if (!cancelado) setResultado({ id, producto: data, error: null })
      })
      .catch((err) => {
        // Si algo falla, guarda el mensaje de error
        if (!cancelado) setResultado({ id, producto: null, error: err.message })
      })

    return () => { cancelado = true }
  }, [id]) // Se re-ejecuta si el usuario navega a otro producto (cambia el id)

  // Muestra mensaje mientras carga
  if (cargando) return <p>Cargando producto...</p>

  // Muestra error si el fetch falló o el producto no existe
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
    // addToCart hace el POST al backend; si sale bien, el carrito del store se actualiza solo
    dispatch(addToCart({ producto, cantidad }))
    setCantidad(1)
  }

  return (
    <div className="product-detail">
      <Link to="/catalogo" style={{ color: '#002b5c', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
        ← Volver al catálogo
      </Link>
      <h2>{producto.nombre}</h2>
      <p>{producto.descripcion}</p>
      {/* precio viene como número desde el backend, toLocaleString lo formatea con puntos de miles */}
      <p className="precio">${Number(producto.precio).toLocaleString('es-AR')}</p>
      <p>Stock disponible: {producto.stock}</p>
      {errorCarrito && <p className="error-msg">{errorCarrito}</p>}
      {disponible > 0 ? (
        <>
          <QuantitySelector cantidad={cantidad} onChange={setCantidad} min={1} max={disponible} />
          <button onClick={handleAgregar} className="btn-primary btn-ancho" disabled={guardando || cantidad < 1 || cantidad > disponible}>
            {guardando ? 'Agregando...' : 'Agregar al carrito'}
          </button>
        </>
      ) : (
        <p>Ya tenés el máximo de stock en el carrito</p>
      )}
    </div>
  )
}

export default ProductDetail