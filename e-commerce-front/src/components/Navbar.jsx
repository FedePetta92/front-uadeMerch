import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate()
    const logueado = localStorage.getItem('logueado') // busca en el navegador si el usuario está logueado

    const handleSalir = () => {
        localStorage.removeItem('logueado') // borra la marca de login
        navigate('/') // vuelve al inicio
    }

    return (
        <nav>
            <Link to="/">Inicio</Link> | <Link to="/catalogo">Catálogo</Link> | <Link to="/cart">Carrito</Link> |{' '}
            {logueado ? (
                <button onClick={handleSalir}>Salir</button>
            ) : (
                <Link to="/login">Ingresar</Link>
            )}
        </nav>
    )
}

export default Navbar