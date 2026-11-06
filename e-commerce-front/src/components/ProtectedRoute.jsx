import {Navigate} from "react-router-dom";
import { useSelector } from "react-redux";
import { selectLogueado } from "../store/slices/userSlice";


function ProtectedRoute({ children }) {
    const logueado = useSelector(selectLogueado) // lee del store si hay un usuario logueado
    return logueado ? children : <Navigate to="/login" replace /> // si está logueado muestra la página, sino redirige al login
}

export default ProtectedRoute;
