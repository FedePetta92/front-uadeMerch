import { Routes, Route } from 'react-router-dom'
import Listado from './components/Listado'
import ProductDetail from './components/ProductDetail'
import Cart from './components/Cart'
import './App.css'

function App() {
  return (
    <div className="App">
      <h1>Catálogo de Productos</h1>
      <Routes>
        <Route path="/" element={<Listado />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </div>
  )
}

export default App