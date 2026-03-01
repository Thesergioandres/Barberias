import { type ChangeEvent, type FormEvent, useState } from 'react';
import { apiRequest } from '../../shared/infrastructure/http/apiClient';
import { LoadingOverlay } from '../../shared/components/LoadingOverlay';

const initialState = {
  tenantName: '',
  slug: '',
  subdomain: '',
  primary: '#f4b41a',
  secondary: '#f9d784',
  logoUrl: '',
  adminName: '',
  adminEmail: '',
  adminPhone: '',
  adminPassword: '',
  branchName: '',
  branchAddress: ''
};

export function CreateBarbershopPage() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiRequest('/users/register-tenant', {
        method: 'POST',
        body: JSON.stringify({
          tenantName: form.tenantName,
          slug: form.slug,
          subdomain: form.subdomain,
          customColors: {
            primary: form.primary,
            secondary: form.secondary
          },
          logoUrl: form.logoUrl || null,
          adminName: form.adminName,
          adminEmail: form.adminEmail,
          adminPhone: form.adminPhone,
          adminPassword: form.adminPassword,
          branchName: form.branchName,
          branchAddress: form.branchAddress
        })
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'No se pudo crear el tenant.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className="app-card">
        <h2 className="section-title">Crear mi barberia</h2>
        <p className="section-subtitle">Dispara el registro tenant + admin en un solo paso.</p>
      </header>

      {success ? (
        <div className="app-card">
          <p className="text-lg font-semibold">Listo. Tu barberia esta en construccion.</p>
          <p className="mt-2 text-sm text-muted">Te enviaremos un correo con el acceso.</p>
        </div>
      ) : (
        <form className="app-card grid gap-4" onSubmit={submit}>
          {error ? <p className="text-sm text-secondary">{error}</p> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm">
              Nombre
              <input className="input-field mt-2" value={form.tenantName} onChange={updateField('tenantName')} required />
            </label>
            <label className="text-sm">
              Slug
              <input className="input-field mt-2" value={form.slug} onChange={updateField('slug')} required />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm">
              Subdominio
              <input className="input-field mt-2" value={form.subdomain} onChange={updateField('subdomain')} required />
            </label>
            <label className="text-sm">
              Logo URL
              <input className="input-field mt-2" value={form.logoUrl} onChange={updateField('logoUrl')} />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm">
              Color primario
              <input className="input-field mt-2" value={form.primary} onChange={updateField('primary')} />
            </label>
            <label className="text-sm">
              Color secundario
              <input className="input-field mt-2" value={form.secondary} onChange={updateField('secondary')} />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm">
              Admin nombre
              <input className="input-field mt-2" value={form.adminName} onChange={updateField('adminName')} required />
            </label>
            <label className="text-sm">
              Admin email
              <input className="input-field mt-2" value={form.adminEmail} onChange={updateField('adminEmail')} required />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm">
              Admin telefono
              <input className="input-field mt-2" value={form.adminPhone} onChange={updateField('adminPhone')} />
            </label>
            <label className="text-sm">
              Admin password
              <input className="input-field mt-2" type="password" value={form.adminPassword} onChange={updateField('adminPassword')} required />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm">
              Sede principal
              <input className="input-field mt-2" value={form.branchName} onChange={updateField('branchName')} required />
            </label>
            <label className="text-sm">
              Direccion
              <input className="input-field mt-2" value={form.branchAddress} onChange={updateField('branchAddress')} />
            </label>
          </div>
          <button className="btn-primary" type="submit">Crear barberia</button>
        </form>
      )}

      {loading ? <LoadingOverlay /> : null}
    </section>
  );
}
