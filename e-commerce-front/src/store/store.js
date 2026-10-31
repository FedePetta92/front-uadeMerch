import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './slices/cartSlice'
import userReducer, { CLAVE_SESION } from './slices/userSlice'

// El store es donde vive el estado global de la app.
// Cada clave de reducer es una parte del estado: store.cart.items, store.user.usuario
export const store = configureStore({
    reducer: {
        cart: cartReducer, // carrito de compras
        user: userReducer  // sesión del usuario logueado
    }
})

// Cada vez que cambia el estado, guarda la sesión en localStorage
// para que no se pierda al recargar la página (o la borra si se cerró la sesión)
store.subscribe(() => {
    const { token, usuario } = store.getState().user
    if (token) {
        localStorage.setItem(CLAVE_SESION, JSON.stringify({ token, usuario }))
    } else {
        localStorage.removeItem(CLAVE_SESION)
    }
})
