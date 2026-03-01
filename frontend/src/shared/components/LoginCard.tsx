import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

type LoginCardProps = {
  title?: string;
  subtitle?: string;
  demoHint?: string;
};

export function LoginCard({ title = 'Iniciar sesion', subtitle, demoHint }: LoginCardProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-card max-w-xl space-y-4">
      <div>
        <p className="text-sm font-semibold text-ink">{title}</p>
        {subtitle ? <p className="text-xs text-muted">{subtitle}</p> : null}
      </div>
      <label className="text-xs text-muted">
        Correo
        <input
          className="input-field mt-2"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="correo@barberia.com"
        />
      </label>
      <label className="text-xs text-muted">
        Contrasena
        <input
          type="password"
          className="input-field mt-2"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Tu contrasena"
        />
      </label>
      <button type="button" className="btn-primary" onClick={handleLogin} disabled={loading}>
        {loading ? 'Ingresando...' : 'Iniciar sesion'}
      </button>
      {error ? <p className="text-sm text-secondary">{error}</p> : null}
      {demoHint ? <p className="text-xs text-muted">{demoHint}</p> : null}
    </div>
  );
}
