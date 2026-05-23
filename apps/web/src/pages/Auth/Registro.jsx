import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import styles from './Auth.module.css';

export default function Registro() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', comunidad: '', region: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // TODO: const { data } = await api.post('/auth/register', form);
      // setAuth(data.token, data.user);
      setAuth('demo-token', { nombre: form.nombre, email: form.email });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.authLogo}>
          <span>🦙</span>
          <h1>KORI ALP</h1>
        </div>
        <p className={styles.authSubtitle}>Crea tu cuenta de productor alpaquero</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {[
            ['nombre', 'text', 'Nombre completo', 'Don Teófilo Mamani'],
            ['email', 'email', 'Email', 'tu@email.com'],
            ['password', 'password', 'Contraseña', '••••••••'],
            ['comunidad', 'text', 'Comunidad / Localidad', 'Macusani'],
            ['region', 'text', 'Región', 'Puno'],
          ].map(([name, type, label, placeholder]) => (
            <div key={name} className={styles.field}>
              <label>{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                value={form[name]}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                required
              />
            </div>
          ))}
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Registrando...' : 'Crear Cuenta →'}
          </button>
        </form>

        <p className={styles.authLink}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
