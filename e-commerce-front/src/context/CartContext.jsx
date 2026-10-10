import { createContext, useContext, useState } from "react";

const CartContext = createContext()

export function CartProvider({ children }) {
    const [carrito, setCarrito] = useState([])

    // Agrega un producto al carrito; si ya existe, suma la cantidad sin superar el stock
    const agregar = (producto, cantidad) => {
        setCarrito((carritoPrev) => {
            const existe = carritoPrev.find((item) => item.id === producto.id)
            if (existe) {
                return carritoPrev.map((item) =>
                    item.id === producto.id
                        ? { ...item, cantidad: Math.min(item.cantidad + cantidad, producto.stock) }
                        : item
                )
            }
            return [...carritoPrev, { ...producto, cantidad }]
        })
    }

    // Elimina un producto del carrito por su id
    const eliminar = (id) => {
        setCarrito((carritoPrev) => carritoPrev.filter((item) => item.id !== id))
    }

    // Actualiza la cantidad de un item ya existente en el carrito
    const actualizar = (id, cantidad) => {
        setCarrito((carritoPrev) =>
            carritoPrev.map((item) => (item.id === id ? { ...item, cantidad } : item))
        )
    }

    // Vacía el carrito por completo
    const vaciar = () => {
        setCarrito([])
    }

    return (
        <CartContext.Provider value={{ carrito, agregar, eliminar, actualizar, vaciar }}>
            {children}
        </CartContext.Provider>
    )
}

// Hook para consumir el contexto del carrito desde cualquier componente
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
    return useContext(CartContext)
}

