// URL base del backend. Todos los fetch apuntan a este servidor.
export const API_URL = 'http://localhost:8080'

// fetch con lo que repiten todos los pedidos al backend:
// - manda y recibe JSON
// - si se pasa `token`, lo agrega en el header Authorization (lo pide el backend para las rutas protegidas)
// - si la respuesta no es 2xx, lanza un error con el status (ej: 401, 404)
export async function apiFetch(ruta, { token, ...opciones } = {}) {
    const res = await fetch(`${API_URL}${ruta}`, {
        ...opciones,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...opciones.headers
        }
    })

    if (!res.ok) {
        const error = new Error(`Error ${res.status}`)
        error.status = res.status
        throw error
    }

    // 204 No Content no trae body
    return res.status === 204 ? null : res.json()
}
