import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectLogueado, selectEsAdmin } from '../store/slices/userSlice'

// Igual que ProtectedRoute, pero además exige rol ADMIN.
// - sin sesión: al login
// - logueado sin ser admin: al inicio
// Es solo para la interfaz: aunque alguien saltee esta ruta, el backend rechaza con 403
// los pedidos de gestión de productos que no vengan de un ADMIN.
function AdminRoute({ children }) {
    const logueado = useSelector(selectLogueado)
    const esAdmin = useSelector(selectEsAdmin)

    if (!logueado) return <Navigate to="/login" replace />
    if (!esAdmin) return <Navigate to="/" replace />
    return children
}

export default AdminRoute
