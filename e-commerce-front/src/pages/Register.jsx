import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const API_URL = 'http://localhost:8080'

function Register() {
  const navigate = useNavigate()
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

  const handleSubmit = (e) => {
    e.preventDefault()
    setCargando(true)
    setError(null)

    // Petición al backend (asumiendo que tu /api/usuarios acepta estos campos)
    fetch(`${API_URL}/api/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al registrar usuario. Verificá los datos.')
        return res.json()
      })
      .then(() => {
        setCargando(false)
        alert('¡Cuenta creada con éxito! Ya podés iniciar sesión.')
        navigate('/login')
      })
      .catch((err) => {
        setError(err.message)
        setCargando(false)
      })
  }

  return (
    <div className="auth-page-wrapper">
      <h1 className="auth-title">Crear cuenta</h1>
      
      <div className="auth-card">
        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Apellido</label>
            <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Fecha de nacimiento</label>
            <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Sexo</label>
            <select name="sexo" value={formData.sexo} onChange={handleChange} className="select-input">
              <option value="">Seleccioná tu sexo</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="O">Otro</option>
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