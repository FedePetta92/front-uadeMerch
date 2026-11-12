import { useEffect, useRef } from 'react'
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, selectLogueado, selectEsAdmin } from '../store/slices/userSlice'

function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const logueado = useSelector(selectLogueado) // lee del store si el usuario está logueado (se actualiza solo)
    const esAdmin = useSelector(selectEsAdmin)

    // cantidad de productos distintos que hay en el carrito (se actualiza sola)
    const cantidad = useSelector((state) => state.cart.items.length)

    // Marca que el usuario apretó "Salir": la sesión se cierra recién cuando ya llegó al inicio.
    // React Router hace las navegaciones con baja prioridad (startTransition) y el cambio de Redux es inmediato:
    // si la sesión se cerrara antes de llegar, la ruta protegida (ej: /cart) redirigiría al login en vez de al inicio.
    const saliendo = useRef(false)

    const handleSalir = () => {
        // Si ya está en el inicio, la URL no cambia: cierra la sesión directamente
        if (location.pathname === '/') {
            dispatch(logout())
            return
        }
        saliendo.current = true
        navigate('/') // vuelve al inicio
    }

    // Cuando la navegación al inicio terminó, cierra la sesión (el carrito también se vacía en pantalla)
    useEffect(() => {
        if (saliendo.current && location.pathname === '/') {
            saliendo.current = false
            dispatch(logout())
        }
    }, [location.pathname, dispatch])

        // Clase para los links según si están activos o no
    const getLinkClass = ({ isActive }) => isActive ? 'nav-link active' : 'nav-link'

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">UADE Merch</Link>
            </div>
            
            <div className="navbar-links">
                <NavLink to="/" className={getLinkClass}>Inicio</NavLink>
                <NavLink to="/catalogo" className={getLinkClass}>Catálogo</NavLink>
                <NavLink to="/cart" className={getLinkClass}>Carrito ({cantidad})</NavLink>
                {logueado && <NavLink to="/mis-compras" className={getLinkClass}>Mis compras</NavLink>}
                {/* Pestaña de administración: solo se muestra si el usuario logueado es ADMIN */}
                {esAdmin && <NavLink to="/admin/productos" className={getLinkClass}>Admin</NavLink>}
            </div>

            <div className="navbar-auth">
                {logueado ? (
                    <button onClick={handleSalir} className="btn-logout">Salir</button>
                ) : (
                    <>
                        <NavLink to="/login" className={getLinkClass}>Ingresar</NavLink>
                        <NavLink to="/register" className={getLinkClass}>Crear Cuenta</NavLink>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar