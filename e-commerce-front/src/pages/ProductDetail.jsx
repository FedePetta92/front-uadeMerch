import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import QuantitySelector from '../components/QuantitySelector'

// URL base del backend. Todos los fetch apuntan a este servidor.
const API_URL = 'http://localhost:8080'

function ProductDetail() {

  // useParams extrae el :id de la URL, ej: /product/3 → id = "3"
  const { id } = useParams()
  const { carrito, agregar } = useCart()
  const [cantidad, setCantidad] = useState(1)

  // producto: objeto con los datos del backend
  // cargando: true mientras espera la respuesta
  // error: mensaje de error si el fetch falla
  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // useEffect se dispara cada vez que cambia el id en la URL
  useEffect(() => {

    setCargando(true)
    setError(null)

    // Llama al endpoint GET /api/productos/{id} para traer el detalle de un producto
    fetch(`${API_URL}/api/productos/${id}`)
      .then((res) => {
        // Si la respuesta no es 2xx (ej: 404) lanza un error
        if (!res.ok) throw new Error('Producto no encontrado')
        // Convierte la respuesta JSON a un objeto JavaScript
        return res.json()
      })
      .then((data) => {
        // Guarda el producto en el estado y apaga el indicador de carga
        setProducto(data)
        setCargando(false)
      })
      .catch((err) => {
        // Si algo falla, guarda el mensaje de error
        setError(err.message)
        setCargando(false)
      })

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
    agregar(producto, cantidad)
    setCantidad(1)
  }

  return (
    <div className="product-detail">
      <Link to="/catalogo">← Volver al catálogo</Link>
      <h2>{producto.nombre}</h2>
      <p>{producto.descripcion}</p>
      {/* precio viene como número desde el backend, toLocaleString lo formatea con puntos de miles */}
      <p className="precio">${Number(producto.precio).toLocaleString('es-AR')}</p>
      <p>Stock disponible: {producto.stock}</p>
      {disponible > 0 ? (
        <>
          <QuantitySelector cantidad={cantidad} onChange={setCantidad} min={1} max={disponible} />
          <button onClick={handleAgregar}>Agregar al carrito</button>
        </>
      ) : (
        <p>Ya tenés el máximo de stock en el carrito</p>
      )}
    </div>
  )
}

export default ProductDetail