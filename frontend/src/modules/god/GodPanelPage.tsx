import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { PlanGuard } from '../../shared/components/PlanGuard';
import { apiRequest } from '../../shared/infrastructure/http/apiClient';

type TenantRecord = {
  id: string;
  name: string;
  slug: string;
  subdomain?: string;
  email?: string | null;
  phone?: string | null;
  status: string;
  createdAt?: string;
};

type Plan = {
  id: string;
  name: string;
};

const cityUsage = [
  { city: 'Bogota', tenants: 38, activity: 120 },
  { city: 'Medellin', tenants: 24, activity: 92 },
  { city: 'Cali', tenants: 18, activity: 66 },
  { city: 'Barranquilla', tenants: 12, activity: 44 },
  { city: 'Cartagena', tenants: 9, activity: 31 }
];

export function GodPanelPage() {
  const queryClient = useQueryClient();
  const [selectedTenant, setSelectedTenant] = useState<TenantRecord | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [validDays, setValidDays] = useState(30);
  const [notice, setNotice] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTriggeringSuspensions, setIsTriggeringSuspensions] = useState(false);

  const tenantsQuery = useQuery({
    queryKey: ['tenants'],
    queryFn: () => apiRequest<TenantRecord[]>('/tenants')
  });

  const plansQuery = useQuery({
    queryKey: ['plans'],
    queryFn: () => apiRequest<Plan[]>('/plans'),
    enabled: Boolean(selectedTenant)
  });

  const pendingTenants = useMemo(() => {
    return (tenantsQuery.data || []).filter((tenant) => tenant.status === 'onboarding');
  }, [tenantsQuery.data]);

  useEffect(() => {
    if (!selectedTenant) return;
    if (plansQuery.data && plansQuery.data.length > 0 && !selectedPlanId) {
      setSelectedPlanId(plansQuery.data[0].id);
    }
  }, [plansQuery.data, selectedPlanId, selectedTenant]);

  const closeModal = () => {
    setSelectedTenant(null);
    setSelectedPlanId('');
    setValidDays(30);
    setError(null);
  };

  const activateTenant = async () => {
    if (!selectedTenant || !selectedPlanId) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + Math.max(1, validDays));
      await apiRequest(`/tenants/${selectedTenant.id}/activate`, {
        method: 'PATCH',
        body: JSON.stringify({
          planId: selectedPlanId,
          validUntil: validUntil.toISOString()
        })
      });
      setNotice(`Licencia activada para ${selectedTenant.name}.`);
      closeModal();
      await queryClient.invalidateQueries({ queryKey: ['tenants'] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo activar la licencia');
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerSuspensions = async () => {
    setActionError(null);
    setIsTriggeringSuspensions(true);
    try {
      const response = await apiRequest<{ message?: string }>('/tenants/trigger-suspensions', {
        method: 'POST'
      });
      setNotice(response.message || 'Job de suspensión ejecutado manualmente.');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'No se pudo ejecutar el job de suspensión');
    } finally {
      setIsTriggeringSuspensions(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className="app-card">
        <h2 className="section-title">God Panel</h2>
        <p className="section-subtitle">Vista global de la fabrica SaaS.</p>
      </header>

      {notice ? <div className="app-card-soft text-emerald-200">{notice}</div> : null}
      {actionError ? <div className="app-card-soft text-secondary">{actionError}</div> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="app-card">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Tenants activos</p>
          <p className="mt-4 text-3xl font-semibold">128</p>
        </div>
        <div className="app-card">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">WhatsApp health</p>
          <p className="mt-4 text-3xl font-semibold">99.3%</p>
        </div>
        <div className="app-card">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Ingresos MRR</p>
          <p className="mt-4 text-3xl font-semibold">$42k</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="app-card">
          <h3 className="text-lg font-semibold">Demanda por ciudad</h3>
          <p className="mt-2 text-sm text-muted">Top ciudades con mas actividad y tenants.</p>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityUsage} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(248,250,252,0.08)" strokeDasharray="3 3" />
                <XAxis dataKey="city" stroke="#c3cad6" fontSize={12} />
                <YAxis stroke="#c3cad6" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 17, 24, 0.92)',
                    border: '1px solid rgba(248,250,252,0.12)',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="tenants" fill="#f4b41a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="app-card">
          <h3 className="text-lg font-semibold">Mapa de demanda</h3>
          <p className="mt-2 text-sm text-muted">Vista rapida de concentracion por ciudad.</p>
          <div className="mt-6 flex items-center justify-center">
            <svg className="w-full max-w-sm" viewBox="0 0 240 200" fill="none">
              <rect x="10" y="10" width="220" height="180" rx="24" fill="rgba(255,255,255,0.04)" stroke="rgba(248,250,252,0.12)" />
              <circle cx="110" cy="70" r="12" fill="#f4b41a" />
              <circle cx="150" cy="90" r="8" fill="#f9d784" />
              <circle cx="90" cy="110" r="10" fill="#f4b41a" />
              <circle cx="130" cy="130" r="6" fill="#f9d784" />
              <circle cx="70" cy="140" r="7" fill="#f4b41a" />
            </svg>
          </div>
          <div className="mt-4 grid gap-2 text-sm text-muted">
            {cityUsage.map((city) => (
              <div key={city.city} className="flex items-center justify-between">
                <span>{city.city}</span>
                <span className="text-ink">{city.activity} reservas</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="app-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Aprobaciones pendientes</h3>
            <p className="text-sm text-muted">Tenants en estado onboarding que requieren activacion manual.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn-ghost"
              type="button"
              onClick={triggerSuspensions}
              disabled={isTriggeringSuspensions}
            >
              {isTriggeringSuspensions ? 'Ejecutando...' : 'Ejecutar Cron de Suspensiones'}
            </button>
            <span className="status-pill">{pendingTenants.length} pendientes</span>
          </div>
        </div>

        {tenantsQuery.isLoading ? (
          <p className="text-sm text-muted">Cargando pendientes...</p>
        ) : tenantsQuery.isError ? (
          <p className="text-sm text-secondary">No se pudieron cargar los tenants.</p>
        ) : pendingTenants.length === 0 ? (
          <p className="text-sm text-muted">No hay aprobaciones pendientes.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase text-zinc-400">
                <tr>
                  <th className="py-3 pr-4 font-medium">Empresa</th>
                  <th className="py-3 px-4 font-medium">Contacto</th>
                  <th className="py-3 px-4 font-medium">Registro</th>
                  <th className="py-3 pl-4 font-medium text-right">Accion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pendingTenants.map((tenant) => (
                  <tr key={tenant.id} className="transition-colors hover:bg-white/5">
                    <td className="py-3 pr-4 font-medium text-white">{tenant.name}</td>
                    <td className="py-3 px-4 text-zinc-300">
                      <div className="space-y-1">
                        <p>{tenant.email || 'Sin correo'}</p>
                        <p className="text-xs text-zinc-400">{tenant.phone || 'Sin telefono'}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-300">
                      {tenant.createdAt ? new Date(tenant.createdAt).toLocaleString() : '-'}
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <button className="btn-primary" type="button" onClick={() => setSelectedTenant(tenant)}>
                        Activar licencia
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PlanGuard requiredPlan="GOD">
        <div className="app-card">
          <h3 className="text-lg font-semibold">Reportes IA</h3>
          <p className="mt-2 text-sm text-muted">Predicciones de churn y growth por tenant.</p>
        </div>
      </PlanGuard>

      {selectedTenant ? (
        <div className="overlay-surface fixed inset-0 z-50 flex items-center justify-center backdrop-blur">
          <div className="app-card w-full max-w-lg space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Activar licencia</h3>
              <p className="text-sm text-muted">{selectedTenant.name}</p>
            </div>

            {error ? <p className="text-sm text-secondary">{error}</p> : null}

            <label className="text-xs text-muted">
              Plan
              <select
                className="select-field mt-2"
                value={selectedPlanId}
                onChange={(event) => setSelectedPlanId(event.target.value)}
                disabled={plansQuery.isLoading}
              >
                {plansQuery.isLoading ? <option value="">Cargando planes...</option> : null}
                {plansQuery.data?.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs text-muted">
              Dias de vigencia
              <input
                className="input-field mt-2"
                type="number"
                min={1}
                value={validDays}
                onChange={(event) => setValidDays(Number(event.target.value))}
              />
            </label>

            <div className="flex flex-wrap justify-end gap-3">
              <button className="btn-ghost" type="button" onClick={closeModal} disabled={isSubmitting}>
                Cancelar
              </button>
              <button className="btn-primary" type="button" onClick={activateTenant} disabled={isSubmitting || !selectedPlanId}>
                {isSubmitting ? 'Activando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
