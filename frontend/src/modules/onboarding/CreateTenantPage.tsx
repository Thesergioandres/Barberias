import { type ChangeEvent, type FormEvent, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { apiRequest } from '../../shared/infrastructure/http/apiClient';
import { LoadingOverlay } from '../../shared/components/LoadingOverlay';
import { VERTICALS_REGISTRY } from '../../shared/constants/verticalsRegistry';
import type { AppModule } from '../../shared/types/appModules';
import { LEGAL_VERSIONS } from '../../shared/constants/legal';

const initialState = {
  tenantName: '',
  slug: '',
  subdomain: '',
  primary: '#00F0FF',
  secondary: '#8A2BE2',
  logoUrl: '',
  adminName: '',
  adminEmail: '',
  adminPhone: '',
  adminPassword: '',
  branchName: '',
  branchAddress: ''
};

const defaultConfig = {
  slug: 'general',
  name: 'tu negocio',
  activeModules: ['pos', 'inventory'] as AppModule[]
};

export function CreateTenantPage() {
  const location = useLocation();
  const [form, setForm] = useState(initialState);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptDataPolicy, setAcceptDataPolicy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verticalConfig = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const vertical = (params.get('vertical') || '').toLowerCase();
    const match = VERTICALS_REGISTRY.find((item) => item.slug === vertical);
    return match
      ? { slug: match.slug, name: match.name, activeModules: match.activeModules }
      : defaultConfig;
  }, [location.search]);

  const updateField = (field: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!acceptTerms || !acceptDataPolicy) {
      setLoading(false);
      setError('Debes aceptar los terminos y la politica de datos para continuar.');
      return;
    }

    try {
      await apiRequest('/users/register-tenant', {
        method: 'POST',
        body: JSON.stringify({
          tenantName: form.tenantName,
          slug: form.slug,
          subdomain: form.subdomain,
          verticalSlug: verticalConfig.slug,
          activeModules: verticalConfig.activeModules,
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
          branchAddress: form.branchAddress,
          legalConsent: {
            acceptedAt: new Date().toISOString(),
            termsVersion: LEGAL_VERSIONS.terms,
            privacyVersion: LEGAL_VERSIONS.privacy,
            dataTreatmentVersion: LEGAL_VERSIONS.dataTreatment,
            cookiesVersion: LEGAL_VERSIONS.cookies
          }
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
        <h2 className="section-title">Crea tu cuenta para {verticalConfig.name}</h2>
        <p className="section-subtitle">Dispara el registro tenant + admin en un solo paso.</p>
      </header>

      {success ? (
        <div className="app-card">
          <p className="text-lg font-semibold">Listo. Tu cuenta esta en construccion.</p>
          <p className="mt-2 text-sm text-muted">Te enviaremos un correo con el acceso.</p>
          <Link className="btn-secondary mt-4 inline-flex" to="/waiting">
            Ver estado de activacion
          </Link>
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
              Identificador de URL
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
              <input
                className="input-field mt-2"
                value={form.adminPhone}
                onChange={updateField('adminPhone')}
                required
              />
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
          <div className="space-y-2 text-xs text-muted">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={acceptDataPolicy}
                onChange={(event) => setAcceptDataPolicy(event.target.checked)}
                required
              />
              <span>
                Autorizo el tratamiento de mis datos personales conforme a la{' '}
                <Link className="text-primary" to="/legal/ptd">Politica de Tratamiento de Datos</Link>.
              </span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(event) => setAcceptTerms(event.target.checked)}
                required
              />
              <span>
                Acepto los <Link className="text-primary" to="/legal/terms">Terminos del Servicio</Link> y el{' '}
                <Link className="text-primary" to="/legal/saas">Acuerdo SaaS</Link>.
              </span>
            </label>
          </div>
          <button className="btn-primary" type="submit">Crear cuenta</button>
        </form>
      )}

      {loading ? <LoadingOverlay /> : null}
    </section>
  );
}
