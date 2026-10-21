import { createSlice } from '@reduxjs/toolkit'
 
// createSlice junta en un solo lugar el estado inicial y las funciones que lo modifican
const cartSlice = createSlice({
    name: 'cart', // nombre de esta parte del estado global
    initialState: {
        items: [] // productos que hay en el carrito
    },
    reducers: {
        // Agrega un producto; si ya existe, suma la cantidad sin superar el stock
        // dispatch(agregar({ producto, cantidad }))
        agregar: (state, action) => {
            const { producto, cantidad } = action.payload
            const existe = state.items.find((item) => item.id === producto.id)
            if (existe) {
                existe.cantidad = Math.min(existe.cantidad + cantidad, producto.stock)
            } else {
                state.items.push({ ...producto, cantidad })
            }
        },
 
        // Elimina un producto del carrito por su id
        // dispatch(eliminar(id))
        eliminar: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload)
        },
 
        // Cambia la cantidad de un producto que ya está en el carrito
        // dispatch(actualizar({ id, cantidad }))
        actualizar: (state, action) => {
            const { id, cantidad } = action.payload
            const item = state.items.find((item) => item.id === id)
            if (item) {
                item.cantidad = cantidad
            }
        },
 
        // Vacía el carrito por completo
        vaciar: (state) => {
            state.items = []
        }
    }
})
 
// exporta las acciones para usarlas en los componentes
export const { agregar, eliminar, actualizar, vaciar } = cartSlice.actions
 
// exporta el reducer para agregarlo al store
export default cartSlice.reducer
 