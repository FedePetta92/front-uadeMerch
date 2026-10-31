import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, limpiarError } from "../store/slices/userSlice";

function Login() {
    // email y password guardan lo que escribe el usuario en el formulario
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // error y cargando vienen del userSlice:
    // error muestra el mensaje si las credenciales son incorrectas
    // cargando evita que el usuario haga doble click mientras espera la respuesta
    const { error, cargando } = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const navigate = useNavigate();

    // Al entrar al login, borra el error de un intento anterior
    useEffect(() => {
        dispatch(limpiarError())
    }, [dispatch])

    const handleSubmit = (e) => {
        // Evita que el form recargue la página al enviarse
        e.preventDefault();

        // El thunk login hace el POST /api/login y guarda el token y el usuario en el store.
        // unwrap() permite saber acá si salió bien (then) o mal (catch)
        dispatch(login({ email, password }))
            .unwrap()
            .then(() => {
                // Redirige al carrito sin dejar el login en el historial del navegador
                navigate('/cart', { replace: true })
            })
            .catch(() => {
                // El mensaje de error ya quedó en el store y se muestra en el formulario
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