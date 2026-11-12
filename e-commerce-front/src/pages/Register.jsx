import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { apiFetch } from '../services/api'
import { login } from '../store/slices/userSlice'

// Fecha de hoy en formato YYYY-MM-DD: tope del selector de fecha de nacimiento
const HOY = new Date().toISOString().slice(0, 10)

function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    fechaNacimiento: '',
    sexo: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError(null)

    const datos = {
      ...formData,
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      email: formData.email.trim()
    }

    try {
      await apiFetch('/api/usuarios', { method: 'POST', body: JSON.stringify(datos) })
      // Registro OK: se inicia la sesión automáticamente y se va al catálogo
      await dispatch(login({ email: datos.email, password: datos.password })).unwrap()
      navigate('/catalogo', { replace: true })
    } catch (err) {
      // El backend manda el motivo en el cuerpo: 409 email repetido, 400 datos inválidos
      if (err.status === 409) {
        setError('Ya existe una cuenta con ese email. Probá iniciar sesión.')
      } else if (err.status === 400) {
        setError(err.message)
      } else if (err.status) {
        setError('No se pudo crear la cuenta. Intentá de nuevo.')
      } else if (typeof err === 'string') {
        // unwrap() del login rechazado devuelve el mensaje: la cuenta se creó, pero no se pudo iniciar sesión
        setError('Tu cuenta se creó, pero no pudimos iniciar sesión. Ingresá desde "Ingresar".')
      } else {
        setError('No se pudo conectar con el servidor.')
      }
      setCargando(false)
    }
  }

  return (
    <div className="auth-page-wrapper">
      <h1 className="auth-title">Crear cuenta</h1>

      <div className="auth-card">
        {error && <p className="error-msg">{error}</p>}

        {/* Las restricciones (required, maxLength, minLength) coinciden con las validaciones del backend */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} maxLength={30} required />
          </div>

          <div className="form-group">
            <label>Apellido</label>
            <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} maxLength={30} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} maxLength={50} required />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} minLength={6} required />
            <small className="form-hint">Mínimo 6 caracteres</small>
          </div>

          <div className="form-group">
            <label>Fecha de nacimiento</label>
            <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} max={HOY} required />
          </div>

          <div className="form-group">
            <label>Sexo</label>
            <select name="sexo" value={formData.sexo} onChange={handleChange} className="select-input" required>
              <option value="">Seleccioná tu sexo</option>
              <option value="MASCULINO">Masculino</option>
              <option value="FEMENINO">Femenino</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>
      </div>

      <p className="auth-footer">
        ¿Ya tenés cuenta? <Link to="/login">Ingresá</Link>
      </p>
    </div>
  )
}

export default Register
