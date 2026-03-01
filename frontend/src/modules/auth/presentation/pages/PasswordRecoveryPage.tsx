import { FormEvent, useState } from 'react';
import { apiRequest } from '../../../../shared/infrastructure/http/apiClient';

export function PasswordRecoveryPage() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestToken = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const result = await apiRequest<{ message: string; resetToken?: string }>('/auth/password/forgot', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      setMessage(result.resetToken ? `Token generado: ${result.resetToken}` : result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo generar token');
    }
  };

  const resetPassword = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const result = await apiRequest<{ message: string }>('/auth/password/reset', {
        method: 'POST',
        body: JSON.stringify({ token, password })
      });
      setMessage(result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cambiar password');
    }
  };

  return (
    <section className="space-y-6">
      <header className="app-card">
        <h2 className="section-title">Recuperar password</h2>
        <p className="section-subtitle">Solicita un token y restablece tu acceso.</p>
      </header>

      {message ? <p className="app-card-soft text-emerald-200">{message}</p> : null}
      {error ? <p className="app-card-soft text-red-200">{error}</p> : null}

      <form className="app-card grid gap-4 md:max-w-2xl" onSubmit={requestToken}>
        <label className="text-xs text-zinc-400">
          Email
          <input
            className="input-field mt-2"
            placeholder="correo@barberia.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <button className="btn-ghost w-fit" type="submit">
          Generar token
        </button>
      </form>

      <form className="app-card grid gap-4 md:max-w-2xl" onSubmit={resetPassword}>
        <label className="text-xs text-zinc-400">
          Token
          <input
            className="input-field mt-2"
            placeholder="Token"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            required
          />
        </label>
        <label className="text-xs text-zinc-400">
          Nuevo password
          <input
            className="input-field mt-2"
            type="password"
            placeholder="Nuevo password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button className="btn-primary w-fit" type="submit">
          Cambiar password
        </button>
      </form>
    </section>
  );
}
