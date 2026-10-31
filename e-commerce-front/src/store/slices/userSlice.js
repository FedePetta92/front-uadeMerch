import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiFetch } from '../../services/api'

// Clave de localStorage donde se guarda la sesión para que no se pierda al recargar la página
export const CLAVE_SESION = 'sesion'

// Lee los datos que trae el JWT (nombre, apellido, email, vencimiento).
// El token tiene 3 partes separadas por "."; la del medio es un JSON en base64.
function leerToken(token) {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes)) // TextDecoder respeta tildes y ñ
}

// Recupera la sesión guardada, solo si el token todavía no venció
function cargarSesion() {
    try {
        const sesion = JSON.parse(localStorage.getItem(CLAVE_SESION))
        if (sesion && leerToken(sesion.token).exp * 1000 > Date.now()) {
            return sesion
        }
    } catch {
        // sesión guardada inválida: se arranca sin sesión
    }
    return { token: null, usuario: null }
}

// createAsyncThunk sirve para acciones asincrónicas (como un fetch).
// Genera 3 acciones automáticamente: login.pending, login.fulfilled y login.rejected,
// que se manejan abajo en extraReducers.
// dispatch(login({ email, password }))
export const login = createAsyncThunk(
    'user/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            // El backend devuelve { token, usuarioId }
            const data = await apiFetch('/api/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            })
            const { nombre, apellido } = leerToken(data.token)
            // Lo que se devuelve acá llega como action.payload a login.fulfilled
            return {
                token: data.token,
                usuario: { id: data.usuarioId, nombre, apellido, email }
            }
        } catch {
            // Lo que se pasa a rejectWithValue llega como action.payload a login.rejected
            return rejectWithValue('Email o contraseña incorrectos')
        }
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState: {
        ...cargarSesion(), // token y usuario ({ id, nombre, apellido, email }) o null si no hay sesión
        cargando: false,   // true mientras se espera la respuesta del login
        error: null        // mensaje si el login falló
    },
    reducers: {
        // Cierra la sesión. El cartSlice también escucha esta acción para vaciar el carrito.
        // dispatch(logout())
        logout: (state) => {
            state.token = null
            state.usuario = null
        },

        // Borra el mensaje de error (ej: al volver a entrar al login)
        limpiarError: (state) => {
            state.error = null
        }
    },
    // extraReducers responde a acciones que NO se crearon en `reducers`,
    // como las 3 que genera createAsyncThunk
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.cargando = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                state.cargando = false
                state.token = action.payload.token
                state.usuario = action.payload.usuario
            })
            .addCase(login.rejected, (state, action) => {
                state.cargando = false
                state.error = action.payload
            })
    }
})

// Selector: el usuario está logueado si hay token
export const selectLogueado = (state) => Boolean(state.user.token)

export const { logout, limpiarError } = userSlice.actions

export default userSlice.reducer
