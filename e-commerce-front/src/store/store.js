import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './slices/cartSlice'
 
// El store es donde vive el estado global de la app.
// Cada clave de reducer es una parte del estado: store.cart.items
export const store = configureStore({
    reducer: {
        cart: cartReducer // carrito de compras
    }
})