// URL base del backend. Todos los fetch apuntan a este servidor.
export const API_URL = 'http://localhost:8080'

// fetch con lo que repiten todos los pedidos al backend:
// - manda y recibe JSON
// - si se pasa `token`, lo agrega en el header Authorization (lo pide el backend para las rutas protegidas)
// - si la respuesta no es 2xx, lanza un error con:
//     error.status  -> el código HTTP (ej: 400, 401, 404)
//     error.datos   -> el cuerpo de la respuesta: un objeto si vino JSON (ej: la orden rechazada del checkout, 402)
//                      o el texto que manda el backend (ej: "Stock insuficiente para Mate UADE")
//     error.message -> un mensaje listo para mostrar: el texto del backend, o "Error <status>" si no mandó nada
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
        const datos = await leerCuerpo(res)
        const mensaje = typeof datos === 'string' && datos.trim() ? datos : `Error ${res.status}`
        const error = new Error(mensaje)
        error.status = res.status
        error.datos = datos
        throw error
    }

    // Algunas respuestas OK no traen body: 204 No Content, o 200 vacío de los endpoints void
    // (ej: DELETE /api/productos/{id}). En esos casos se devuelve null en vez de fallar al leer JSON.
    const texto = await res.text()
    return texto ? JSON.parse(texto) : null
}

// Lee el cuerpo de una respuesta de error: JSON si se puede, si no texto (o null si viene vacío)
async function leerCuerpo(res) {
    const texto = await res.text()
    if (!texto) return null
    try {
        return JSON.parse(texto)
    } catch {
        return texto
    }
}
