import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import QuantitySelector from './QuantitySelector'

function ProductCard({ producto }) {
  const { agregar } = useCart()
  
  // Estado local para saber cuántos quiere agregar el usuario desde el catálogo
  const [cantidad, setCantidad] = useState(1)

  const handleAgregar = () => {
    agregar(producto, cantidad)
    setCantidad(1) // Reseteamos a 1 después de agregar
  }

  return (
    <div className="product-card">
      <div className="product-image-placeholder">
        [IMAGEN DEL PRODUCTO]
      </div>

      <h3>{producto.nombre}</h3>
      <p className="product-description">{producto.descripcion}</p>

      {/* Fila con el selector y el stock */}
      <div className="card-qty-stock">
        <QuantitySelector 
          cantidad={cantidad} 
          onChange={setCantidad} 
          min={1} 
          max={producto.stock} 
        />
        <span className="card-stock">Stock: {producto.stock}</span>
      </div>

      <p className="product-price">${Number(producto.precio).toLocaleString('es-AR')}</p>

      <div className="product-actions">
        <Link to={`/product/${producto.id}`} className="btn-secondary btn-card">
          Ver detalle
        </Link>
        <button 
          onClick={handleAgregar} 
          className="btn-primary btn-card"
          disabled={producto.stock === 0}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  )
}

export default ProductCard