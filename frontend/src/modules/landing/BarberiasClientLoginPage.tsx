import { useState } from 'react';
import { useAuth } from '../../shared/context/AuthContext';
import { apiRequest } from '../../shared/infrastructure/http/apiClient';

function buildTenantUrl(slug: string) {
  const { protocol, hostname, port } = window.location;
  const isLocal = hostname.endsWith('localhost');
  const hostParts = hostname.split('.');
  const baseHost = isLocal
    ? `${slug}.localhost`
    : hostParts.length > 2
      ? `${slug}.${hostParts.slice(1).join('.')}`
      : `${slug}.${hostname}`;
  const portSegment = port ? `:${port}` : '';
  return `${protocol}//${baseHost}${portSegment}/`;
}

export function BarberiasClientLoginPage() {
  const { login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const normalizedSlug = subdomain.trim().toLowerCase();
      if (!normalizedSlug) {
        setError('Ingresa el subdominio de tu barberia.');
        return;
      }

      await apiRequest(`/tenants/slug/${normalizedSlug}`);

      const user = await login(email, password);
      if (user.role !== 'CLIENT') {
        logout();
        setError('Este acceso es solo para clientes.');
        return;
      }

      window.location.assign(buildTenantUrl(normalizedSlug));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className="app-card">
        <h2 className="section-title">Acceso clientes</h2>
        <p className="section-subtitle">Inicia sesion para gestionar tu reserva en tu barberia.</p>
      </header>

      <div className="app-card max-w-xl space-y-4">
        {error ? <p className="text-sm text-secondary">{error}</p> : null}
        <label className="text-xs text-muted">
          Subdominio de tu barberia
          <input
            className="input-field mt-2"
            value={subdomain}
            onChange={(event) => setSubdomain(event.target.value)}
            placeholder="mi-barberia"
          />
        </label>
        <label className="text-xs text-muted">
          Correo
          <input
            className="input-field mt-2"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="cliente@barberia.com"
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
          {loading ? 'Ingresando...' : 'Entrar como cliente'}
        </button>
      </div>
    </section>
  );
}
