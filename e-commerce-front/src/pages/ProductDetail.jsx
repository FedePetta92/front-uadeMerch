import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import productos from '../data/products.json'
import { useCart } from '../context/CartContext'
import QuantitySelector from '../components/QuantitySelector'

function ProductDetail() {
  const { id } = useParams()
  const producto = productos.find((p) => p.id === Number(id))
  const { carrito, agregar } = useCart()
  const [cantidad, setCantidad] = useState(1)

  if (!producto) {
    return (
      <div>
        <p>Producto no encontrado</p>
        <Link to="/catalogo">Volver al catálogo</Link>
      </div>
    )
  }

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
      <p className="precio">${producto.precio.toLocaleString('es-AR')}</p>
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