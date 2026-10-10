import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'

// URL base del backend. Todos los fetch apuntan a este servidor.
const API_URL = 'http://localhost:8080'

function Listado() {

  // productos: array con los datos que devuelve el backend
  // cargando: true mientras espera la respuesta, false cuando termina
  // error: guarda el mensaje de error si el fetch falla
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // useEffect se ejecuta una sola vez cuando el componente se monta ([] como dependencia vacía)
  useEffect(() => {

    // Llama al endpoint GET /api/productos para traer todos los productos
    fetch(`${API_URL}/api/productos`)
      .then((res) => {
        // Si la respuesta no es 2xx lanza un error para que lo capture el .catch
        if (!res.ok) throw new Error('Error al cargar los productos')
        // Convierte la respuesta JSON a un objeto JavaScript
        return res.json()
      })
      .then((data) => {
        // Guarda el array de productos en el estado y apaga el indicador de carga
        setProductos(data)
        setCargando(false)
      })
      .catch((err) => {
        // Si algo falla, guarda el mensaje de error y apaga el indicador de carga
        setError(err.message)
        setCargando(false)
      })

  }, []) // [] significa: ejecutar solo al montar el componente, no al re-renderizar

  // Muestra un spinner mientras el fetch no terminó
  if (cargando) return <p>Cargando productos...</p>

  // Muestra el error si el fetch falló
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <h1>Catálogo de Productos</h1>
      <div className="listado-productos">
        {/* Recorre el array de productos y renderiza una tarjeta por cada uno */}
        {productos.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  )
}

export default Listado