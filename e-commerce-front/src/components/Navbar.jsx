import { NavLink, Link, useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate()
    const logueado = localStorage.getItem('logueado') // busca en el navegador si el usuario está logueado

    const handleSalir = () => {
        localStorage.removeItem('logueado') // borra la marca de login
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
                <NavLink to="/cart" className={getLinkClass}>Carrito</NavLink>
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