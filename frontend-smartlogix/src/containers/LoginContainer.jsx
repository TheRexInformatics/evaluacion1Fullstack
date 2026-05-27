import { useState } from 'react';
import LoginView from '../components/LoginView';

export default function LoginContainer({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Llamada real al API Gateway
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas o error de conexión');
      }

      const data = await response.json();
      
      // Guardamos el token JWT de forma segura
      localStorage.setItem('smartlogix_token', data.token);
      
      // Le avisamos a App.jsx que el login fue exitoso
      onLoginSuccess();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginView 
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
}