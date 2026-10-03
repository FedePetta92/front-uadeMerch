import {Navigate} from "react-router-dom";


function ProtectedRoute({ children }) {
    const logueado = localStorage.getItem('logueado') // busca en el navegador si existe la clave 'logueado'
    return logueado ? children : <Navigate to="/login" /> // si está logueado muestra la página, sino redirige al login
}

export default ProtectedRoute;