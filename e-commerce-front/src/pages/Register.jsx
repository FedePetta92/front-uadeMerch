import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

// URL base del backend
const API_URL = 'http://localhost:8080'

function Register() {
    // Cada campo del formulario tiene su propio estado
    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fechaNacimiento, setFechaNacimiento] = useState('')
    const [sexo, setSexo] = useState('')

    // error muestra el mensaje si el registro falla
    const [error, setError] = useState(null)

    // cargando evita que el usuario haga doble click mientras espera la respuesta
    const [cargando, setCargando] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        // Evita que el form recargue la página al enviarse
        e.preventDefault()

        setCargando(true)
        setError(null)

        // Llama al endpoint POST /api/usuarios enviando todos los campos en el body como JSON
        fetch(`${API_URL}/api/usuarios`, {
            method: 'POST',
            headers: {
                // Le indica al backend que el body viene en formato JSON
                'Content-Type': 'application/json'
            },
            // Convierte el objeto JavaScript a string JSON para enviarlo
            body: JSON.stringify({ nombre, apellido, email, password, fechaNacimiento, sexo })
        })
            .then((res) => {
                // Si la respuesta no es 2xx (ej: email duplicado) lanza un error
                if (!res.ok) throw new Error('No se pudo crear la cuenta. El email puede estar en uso.')
                return res.json()
            })
            .then(() => {
                setCargando(false)
                // Registro exitoso: redirige al login para que el usuario ingrese
                navigate('/login')
            })
            .catch((err) => {
                setError(err.message)
                setCargando(false)
            })
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Crear cuenta</h2>

            {/* Muestra el error si el registro falló */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
                required
            />
            <input
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Apellido"
                required
            />
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                required
            />
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                type="password"
                required
            />

            {/* fechaNacimiento debe enviarse en formato YYYY-MM-DD, que es lo que devuelve input type="date" */}
            <label>Fecha de nacimiento</label>
            <input
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                type="date"
                required
            />

            {/* sexo debe coincidir con el enum del backend: MASCULINO, FEMENINO u OTRO */}
            <select value={sexo} onChange={(e) => setSexo(e.target.value)} required>
                <option value="">Seleccioná tu sexo</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
                <option value="OTRO">Otro</option>
            </select>

            {/* disabled mientras espera la respuesta del backend para evitar doble envío */}
            <button type="submit" disabled={cargando}>
                {cargando ? 'Creando cuenta...' : 'Registrarse'}
            </button>

            <p>¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link></p>
        </form>
    )
}

export default Register
