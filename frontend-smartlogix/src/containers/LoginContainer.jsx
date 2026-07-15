import { useState } from 'react';
import LoginView from '../components/LoginView';
import { login, register } from '../facade/BffFacade';

export default function LoginContainer({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isRegister) {
        await register(username, password);
        setSuccess('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
        setError(null);
        setIsRegister(false);
        setUsername('');
        setPassword('');
        return;
      }

      const data = await login(username, password);
      localStorage.setItem('smartlogix_token', data.token);
      onLoginSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setIsRegister(!isRegister);
    setError(null);
    setSuccess(null);
    setUsername('');
    setPassword('');
  };

  return (
    <LoginView
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      error={error}
      success={success}
      loading={loading}
      onSubmit={handleSubmit}
      isRegister={isRegister}
      onToggle={handleToggle}
    />
  );
}
