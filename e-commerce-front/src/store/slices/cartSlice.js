import { createSlice, createAsyncThunk, isPending, isFulfilled, isRejected } from '@reduxjs/toolkit'
import { apiFetch } from '../../services/api'
import { logout } from './userSlice'

// ---------- Funciones auxiliares ----------

// Convierte los items que manda el backend al formato que usan los componentes.
// El backend no manda el stock, así que se toma de `productos` (los items que ya teníamos o el producto que se agrega).
function convertirItems(itemsBackend, productos) {
    return itemsBackend.map((item) => ({
        itemId: item.id,         // id del item en la DB: se usa para actualizarlo o eliminarlo
        id: item.productoId,     // id del producto
        nombre: item.nombreProducto,
        precio: Number(item.precioUnitario),
        cantidad: item.cantidad,
        stock: productos.find((p) => p.id === item.productoId)?.stock ?? item.cantidad
    }))
}

// Pide al backend cambiar la cantidad de un item y devuelve la lista actualizada
async function pedirCambioDeCantidad(token, item, cantidad, items) {
    await apiFetch(`/api/carrito-items/${item.itemId}`, {
        method: 'POST',
        token,
        body: JSON.stringify({ cantidad })
    })
    return items.map((i) => (i.id === item.id ? { ...i, cantidad } : i))
}

// Pide al backend quitar un item del carrito y devuelve la lista actualizada
async function pedirEliminar(token, usuarioId, item, items) {
    const carrito = await apiFetch(`/api/carritos/${usuarioId}/items/${item.itemId}`, {
        method: 'DELETE',
        token
    })
    return convertirItems(carrito.items, items)
}

// Arma un thunk del carrito. Todos comparten lo mismo:
// - necesitan el token y el id del usuario logueado (los toma del userSlice)
// - si el token venció (401/403), cierran la sesión
// - si algo falla, devuelven un mensaje para mostrar
// La función `pedido` recibe { arg, token, usuarioId, items } y devuelve la lista final de items.
function crearThunkDelCarrito(nombre, pedido) {
    return createAsyncThunk(`cart/${nombre}`, async (arg, { getState, dispatch, rejectWithValue }) => {
        const { token, usuario } = getState().user
        if (!token) {
            return rejectWithValue('Tenés que iniciar sesión para usar el carrito')
        }
        try {
            return await pedido({ arg, token, usuarioId: usuario.id, items: getState().cart.items })
        } catch (err) {
            if (err.status === 401 || err.status === 403) {
                dispatch(logout())
                return rejectWithValue('Tu sesión venció. Volvé a iniciar sesión.')
            }
            return rejectWithValue('No se pudo actualizar el carrito. Intentá de nuevo.')
        }
    })
}

// ---------- Thunks (acciones que hablan con el backend) ----------

// Trae el carrito del usuario desde la DB.
// dispatch(fetchCart())
export const fetchCart = crearThunkDelCarrito('fetchCart', async ({ token, usuarioId }) => {
    // También pide los productos para saber el stock de cada uno
    const productos = await apiFetch('/api/productos')
    try {
        const carrito = await apiFetch(`/api/carritos/${usuarioId}`, { token })
        return convertirItems(carrito.items, productos)
    } catch (err) {
        // 404: el usuario todavía no tiene carrito (el backend lo crea al agregar el primer producto)
        if (err.status === 404) return []
        throw err
    }
})

// Agrega un producto al carrito en la DB. Si ya estaba, suma la cantidad sin superar el stock.
// dispatch(addToCart({ producto, cantidad }))
export const addToCart = crearThunkDelCarrito('addToCart', async ({ arg, token, usuarioId, items }) => {
    const { producto, cantidad } = arg
    const existe = items.find((item) => item.id === producto.id)

    // El backend crea un item nuevo en cada POST, aunque el producto ya esté:
    // por eso, si ya existe, se actualiza la cantidad del item que ya estaba
    if (existe) {
        const nueva = Math.min(existe.cantidad + cantidad, producto.stock)
        return pedirCambioDeCantidad(token, existe, nueva, items)
    }

    const carrito = await apiFetch(`/api/carritos/${usuarioId}/items`, {
        method: 'POST',
        token,
        body: JSON.stringify({ productoId: producto.id, cantidad: Math.min(cantidad, producto.stock) })
    })
    return convertirItems(carrito.items, [...items, producto])
})

// Cambia la cantidad de un producto del carrito. Queda entre 1 y el stock; con 0 o menos, lo elimina.
// dispatch(updateCartItem({ id, cantidad }))
export const updateCartItem = crearThunkDelCarrito('updateCartItem', async ({ arg, token, usuarioId, items }) => {
    const item = items.find((i) => i.id === arg.id)
    if (!item) return items

    if (arg.cantidad < 1) {
        return pedirEliminar(token, usuarioId, item, items)
    }
    return pedirCambioDeCantidad(token, item, Math.min(arg.cantidad, item.stock), items)
})

// Elimina un producto del carrito por su id.
// dispatch(removeFromCart(id))
export const removeFromCart = crearThunkDelCarrito('removeFromCart', async ({ arg: id, token, usuarioId, items }) => {
    const item = items.find((i) => i.id === id)
    if (!item) return items
    return pedirEliminar(token, usuarioId, item, items)
})

// Vacía el carrito. El backend no tiene un endpoint para vaciar, así que elimina los items de a uno.
// dispatch(clearCart())
export const clearCart = crearThunkDelCarrito('clearCart', async ({ token, usuarioId, items }) => {
    let restantes = items
    for (const item of items) {
        restantes = await pedirEliminar(token, usuarioId, item, restantes)
    }
    return restantes
})

const thunks = [fetchCart, addToCart, updateCartItem, removeFromCart, clearCart]

// ---------- Slice ----------

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],      // productos que hay en el carrito (copia de lo que está en la DB)
        cargando: false, // true mientras se espera una respuesta del backend
        error: null      // mensaje si el último pedido falló
    },
    // No hay reducers propios: todos los cambios pasan por el backend con los thunks de arriba
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Escucha la acción logout del userSlice: al cerrar sesión, se vacía el carrito en pantalla
            // (en la DB queda guardado para la próxima vez que entre ese usuario)
            .addCase(logout, (state) => {
                state.items = []
                state.error = null
            })
            // addMatcher maneja varias acciones a la vez:
            // isPending(...thunks) coincide con fetchCart.pending, addToCart.pending, etc.
            .addMatcher(isPending(...thunks), (state) => {
                state.cargando = true
                state.error = null
            })
            // Todos los thunks devuelven la lista final de items
            .addMatcher(isFulfilled(...thunks), (state, action) => {
                state.cargando = false
                state.items = action.payload
            })
            .addMatcher(isRejected(...thunks), (state, action) => {
                state.cargando = false
                state.error = action.payload ?? 'Ocurrió un error inesperado'
            })
    }
})

// exporta el reducer para agregarlo al store
export default cartSlice.reducer
