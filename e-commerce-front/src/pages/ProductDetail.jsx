import { useParams, Link } from 'react-router-dom'
import productos from '../data/products.json'

function ProductDetail() {
  const { id } = useParams()
  const producto = productos.find((p) => p.id === Number(id))

  if (!producto) {
    return (
      <div>
        <p>Producto no encontrado</p>
        <Link to="/">Volver al catálogo</Link>
      </div>
    )
  }

  return (
    <div className="product-detail">
      <Link to="/catalogo">← Volver al catálogo</Link>
      <h2>{producto.nombre}</h2>
      <p>{producto.descripcion}</p>
      <p className="precio">${producto.precio.toLocaleString('es-AR')}</p>
      <p>Stock disponible: {producto.stock}</p>
    </div>
  )
}

export default ProductDetail