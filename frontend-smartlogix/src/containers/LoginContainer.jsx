import { useState } from "react";
import { login } from "../facade/BffFacade";
import LoginView from "../components/LoginView";

/**
 * LoginContainer
 * Responsabilidades:
 *  - Manejar el estado del formulario (username, password, error, loading)
 *  - Llamar a BffFacade.login() → POST /auth/login
 *  - En éxito: el token queda en localStorage (lo hace la facade) y se notifica al padre
 *
 * @param {{ onLoginSuccess: () => void }} props
 */
export default function LoginContainer({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState(null);
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit() {
    if (!username.trim() || !password) return;
    setError(null);
    setLoading(true);
    try {
      await login({ username: username.trim(), password });
      onLoginSuccess();
    } catch (err) {
      setError(err.message ?? "Credenciales incorrectas. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoginView
      username={username}
      password={password}
      error={error}
      loading={loading}
      onUsernameChange={setUsername}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
    />
  );
}
