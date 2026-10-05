import productos from '../data/products.json'
import ProductCard from './ProductCard'

function Listado() {
  return (
    <div>
      <h1>Catálogo de Productos</h1>
      <div className="listado-productos">
        {productos.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  )
}

export default Listado