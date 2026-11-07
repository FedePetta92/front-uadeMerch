import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import { selectLogueado } from '../store/slices/userSlice'
import QuantitySelector from './QuantitySelector'

function ProductCard({ producto }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const logueado = useSelector(selectLogueado)
  const carrito = useSelector((state) => state.cart.items)
  const guardando = useSelector((state) => state.cart.cargando)

  // Estado local para saber cuántos quiere agregar el usuario desde el catálogo
  const [cantidad, setCantidad] = useState(1)

  // Cuántas unidades se pueden agregar todavía sin superar el stock
  const enCarrito = carrito.find((item) => item.id === producto.id)?.cantidad ?? 0
  const disponible = producto.stock - enCarrito

  const handleAgregar = () => {
    // El carrito se guarda en la DB por usuario: sin sesión, primero hay que loguearse
    if (!logueado) {
      navigate('/login')
      return
    }
    dispatch(addToCart({ producto, cantidad }))
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
        {disponible > 0 && (
          <QuantitySelector
            cantidad={cantidad}
            onChange={setCantidad}
            min={1}
            max={disponible}
          />
        )}
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
          disabled={guardando || disponible <= 0}
        >
          {disponible <= 0 ? 'Sin stock disponible' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard