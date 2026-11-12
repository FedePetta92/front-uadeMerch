import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCart } from './store/slices/cartSlice'
import Listado from './components/Listado'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import NotFound from './pages/NotFound.jsx'
import Checkout from './pages/Checkout.jsx'
import OrdenDetalle from './pages/OrdenDetalle.jsx'
import MisCompras from './pages/MisCompras.jsx'
import AdminProductos from './pages/AdminProductos.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import Navbar from './components/Navbar.jsx'
import './App.css'

function App() {
  const dispatch = useDispatch()
  const usuarioId = useSelector((state) => state.user.usuario?.id)

  // Cuando hay un usuario logueado (al iniciar sesión o al recargar la página), trae su carrito de la DB
  useEffect(() => {
    if (usuarioId) dispatch(fetchCart())
  }, [usuarioId, dispatch])

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
          {/* Compra: pago, detalle de una orden e historial (requieren sesión) */}
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/ordenes/:id" element={<ProtectedRoute><OrdenDetalle /></ProtectedRoute>} />
          <Route path="/mis-compras" element={<ProtectedRoute><MisCompras /></ProtectedRoute>} />
          {/* Administración: solo rol ADMIN */}
          <Route path="/admin/productos" element={<AdminRoute><AdminProductos /></AdminRoute>} />
          <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App