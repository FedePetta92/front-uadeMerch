import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, selectLogueado } from '../store/slices/userSlice'

function Navbar() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const logueado = useSelector(selectLogueado) // lee del store si el usuario está logueado (se actualiza solo)

    // cantidad de productos distintos que hay en el carrito (se actualiza sola)
    const cantidad = useSelector((state) => state.cart.items.length)

    const handleSalir = () => {
        dispatch(logout()) // cierra la sesión (el carrito también se vacía en pantalla)
        navigate('/') // vuelve al inicio
    }

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