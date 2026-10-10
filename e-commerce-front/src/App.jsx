import { Routes, Route } from 'react-router-dom'
import Listado from './components/Listado'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import NotFound from './pages/NotFound.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Navbar from './components/Navbar.jsx'
import './App.css'

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Listado />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<ProtectedRoute>
                                        <Cart/>
                                   </ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App