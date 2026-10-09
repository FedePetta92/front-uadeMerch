import { Link } from 'react-router-dom'

function ProductCard({ producto }) {
  return (
    <div className="product-card">
      <h3>{producto.nombre}</h3>
      <p>{producto.descripcion}</p>
      <p className="precio">${producto.precio.toLocaleString('es-AR')}</p>
      <Link to={`/product/${producto.id}`}>Ver detalle</Link>
    </div>
  )
}

export default ProductCard
