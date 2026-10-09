import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [usuario, setUsuario] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault(); // evita que el form recargue la página al enviarse
        localStorage.setItem('logueado', 'true'); // guarda en el navegador que el usuario está logueado
        navigate('/cart', { replace: true }); // redirige al carrito sin dejar el login en el historial
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Iniciar sesión</h2>
            <input value={usuario} onChange={(e) => setUsuario(e.target.value)} placeholder="Usuario" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" type="password" />
            <button type="submit">Ingresar</button>
        </form>
    )
}

export default Login
