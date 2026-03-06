import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../../../shared/infrastructure/http/apiClient';
import { useAuth } from '../../../../shared/context/AuthContext';
import { useTenant } from '../../../../shared/context/TenantContext';

type Profile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'OWNER' | 'ADMIN' | 'STAFF' | 'CLIENT';
  whatsappConsent: boolean;
};

export function ProfilePage() {
  const { user, logout } = useAuth();
  const { tenant } = useTenant();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const me = await apiRequest<Profile>('/auth/me');
        setProfile(me);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo cargar el perfil');
      }
    }

    load();
  }, []);

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!profile) return;

    setError(null);
    try {
      const updated = await apiRequest<Profile>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          whatsappConsent: profile.whatsappConsent
        })
      });
      setProfile(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el perfil');
    }
  };

  const handleExport = async () => {
    setError(null);
    setExporting(true);
    try {
      const payload = await apiRequest('/tenants/me/export');
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `essence-datos-${tenant?.slug || 'tenant'}.json`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo exportar la informacion');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Esta accion eliminara o anonimiza los datos del tenant. Deseas continuar?')) {
      return;
    }
    setError(null);
    setDeleting(true);
    try {
      await apiRequest('/tenants/me/delete', { method: 'POST' });
      logout();
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo procesar la solicitud');
    } finally {
      setDeleting(false);
    }
  };

  if (!user) {
    return (
      <section className="app-card">
        <h2 className="section-title">Perfil</h2>
        <p className="section-subtitle">Inicia sesion para gestionar tu perfil.</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="app-card">
        <h2 className="section-title">Mi perfil</h2>
        <p className="section-subtitle">Actualiza tus datos y consentimiento.</p>
      </header>

      {error ? <p className="app-card-soft text-red-200">{error}</p> : null}

      {profile ? (
        <form className="app-card grid gap-4 md:max-w-2xl" onSubmit={handleSave}>
          <label className="text-xs text-zinc-400">
            Nombre
            <input
              className="input-field mt-2"
              value={profile.name}
              onChange={(event) => setProfile({ ...profile, name: event.target.value })}
            />
          </label>
          <label className="text-xs text-zinc-400">
            Telefono
            <input
              className="input-field mt-2"
              value={profile.phone}
              onChange={(event) => setProfile({ ...profile, phone: event.target.value })}
            />
          </label>
          <label className="flex items-center gap-2 text-xs text-zinc-300">
            <input
              type="checkbox"
              checked={profile.whatsappConsent}
              onChange={(event) => setProfile({ ...profile, whatsappConsent: event.target.checked })}
            />
            Acepto recibir WhatsApp
          </label>
          <button className="btn-primary w-fit" type="submit">
            Guardar cambios
          </button>
        </form>
      ) : null}

      {(user?.role === 'ADMIN' || user?.role === 'OWNER') ? (
        <div className="app-card space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Derechos ARCO</h3>
            <p className="text-sm text-muted">Descarga o elimina los datos asociados a tu tenant.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="btn-secondary" type="button" onClick={handleExport} disabled={exporting}>
              {exporting ? 'Generando exportacion...' : 'Descargar mis datos'}
            </button>
            <button className="btn-primary" type="button" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Procesando eliminacion...' : 'Eliminar mi cuenta y datos'}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
