import { useState } from 'react'
import { Link } from 'react-router-dom'
import QuantitySelector from './QuantitySelector'

function ProductCard({ producto }) {
  const [cantidad, setCantidad] = useState(1)
  const total = producto.precio * cantidad

  return (
    <div className="product-card">
      <h3>{producto.nombre}</h3>
      <p>{producto.descripcion}</p>

      <QuantitySelector
        cantidad={cantidad}
        onChange={setCantidad}
        max={producto.stock}
      />
      <p className="total"> ${total.toLocaleString('es-AR')}</p>

      <Link to={`/product/${producto.id}`}>Ver detalle</Link>
    </div>
  )
}

export default ProductCard
