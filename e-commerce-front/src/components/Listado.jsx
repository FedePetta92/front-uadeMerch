import productos from '../data/products.json'
import ProductCard from './ProductCard'

function Listado() {
  return (
    <div className="listado-productos">
      {productos.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </div>
  )
}

export default Listado