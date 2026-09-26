function ProductCard({ producto }) {
  return (
    <div className="product-card">
      <h3>{producto.nombre}</h3>
      <p>{producto.descripcion}</p>
      <span className="precio">${producto.precio}</span>
    </div>
  )
}

export default ProductCard