import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// URL base del backend. Todos los fetch apuntan a este servidor.
const API_URL = 'http://localhost:8080'

function Login() {
    // email y password guardan lo que escribe el usuario en el formulario
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // error muestra el mensaje si las credenciales son incorrectas
    const [error, setError] = useState(null)

    // cargando evita que el usuario haga doble click mientras espera la respuesta
    const [cargando, setCargando] = useState(false)

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        // Evita que el form recargue la página al enviarse
        e.preventDefault();

        setCargando(true)
        setError(null)

        // Llama al endpoint POST /api/login enviando email y password en el body como JSON
        fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: {
                // Le indica al backend que el body viene en formato JSON
                'Content-Type': 'application/json'
            },
            // Convierte el objeto JavaScript a string JSON para enviarlo
            body: JSON.stringify({ email, password })
        })
            .then((res) => {
                // Si la respuesta no es 2xx (ej: 401 credenciales incorrectas) lanza un error
                if (!res.ok) throw new Error('Email o contraseña incorrectos')
                // Convierte la respuesta JSON a un objeto JavaScript
                return res.json()
            })
            .then((data) => {
                // El backend devuelve { token: "..." }
                // Guarda el JWT en localStorage para usarlo en requests autenticados
                localStorage.setItem('token', data.token)
                localStorage.setItem('logueado', 'true')
                setCargando(false)
                // Redirige al carrito sin dejar el login en el historial del navegador
                navigate('/cart', { replace: true })
            })
            .catch((err) => {
                // Muestra el error al usuario y habilita el botón nuevamente
                setError(err.message)
                setCargando(false)
            })
    }

        return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Iniciar sesión</h2>

                {error && <p className="error-msg">{error}</p>}

                <div className="form-group">
                    <label>Email</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ejemplo@uade.edu.ar"
                        type="email"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Contraseña</label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        type="password"
                        required
                    />
                </div>

                <button type="submit" className="btn-primary" disabled={cargando}>
                    {cargando ? 'Ingresando...' : 'Ingresar'}
                </button>

                <p className="auth-link">
                    ¿No tenés cuenta? <Link to="/register">Registrate</Link>
                </p>
            </form>
        </div>
    )
}

export default Login