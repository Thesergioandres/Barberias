import { useEffect, useState } from 'react';
import { apiRequest } from '../../../../shared/infrastructure/http/apiClient';
import { AdminNav } from '../components/AdminNav';

type TenantEntity = {
  id: string;
  slug: string;
  name: string;
  isActive: boolean;
  planType: string;
  config: {
    bufferTimeMinutes: number;
    requirePaymentForNoShows: boolean;
    maxNoShowsBeforePayment: number;
  };
};

export function AdminTenantsPage() {
  const [tenants, setTenants] = useState<TenantEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTenants() {
      try {
        const data = await apiRequest<TenantEntity[]>('/tenants');
        setTenants(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar los tenants');
      } finally {
        setLoading(false);
      }
    }

    fetchTenants();
  }, []);

  return (
    <section className="space-y-6">
      <header className="app-card">
        <h2 className="section-title">Negocios (Tenants)</h2>
        <p className="section-subtitle">Gestión de barberías dadas de alta en la plataforma.</p>
      </header>

      <AdminNav />

      {error ? (
        <p className="rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-200">{error}</p>
      ) : null}

      <div className="app-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Lista de Barberías</h3>
          <button className="btn-primary py-1 px-3 text-xs" disabled>
            + Nuevo Tenant
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-zinc-400">Cargando negocios...</p>
        ) : tenants.length === 0 ? (
          <p className="text-sm text-zinc-400">No hay negocios registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase text-zinc-400">
                <tr>
                  <th className="py-3 pr-4 font-medium">Nombre</th>
                  <th className="py-3 px-4 font-medium">Slug</th>
                  <th className="py-3 px-4 font-medium">Plan</th>
                  <th className="py-3 px-4 font-medium">Estado</th>
                  <th className="py-3 pl-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tenants.map((t) => (
                  <tr key={t.id} className="transition-colors hover:bg-white/5">
                    <td className="py-3 pr-4 font-medium text-white">{t.name}</td>
                    <td className="py-3 px-4 text-zinc-300">{t.slug}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block rounded-md bg-amber-900/40 px-2 py-0.5 text-xs font-semibold text-amber-200">
                        {t.planType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${
                          t.isActive ? 'bg-emerald-900/40 text-emerald-200' : 'bg-red-900/40 text-red-200'
                        }`}
                      >
                        {t.isActive ? 'Activo' : 'Suspendido'}
                      </span>
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <button className="text-xs font-semibold text-zinc-400 hover:text-white" disabled>
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
