import { Link } from 'react-router-dom'

function Home() {
    return (
        <div>
            <h1> Bienvenido a UADE Merch</h1>
            <p>Encontrá los productos oficiales de la universidad</p>
            <Link to="/catalogo">Ver catálogo</Link>
        </div>
    )
}

export default Home