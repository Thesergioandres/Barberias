import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from '../../../../shared/animations/gsapConfig';
import { apiRequest } from '../../../../shared/infrastructure/http/apiClient';
import { moduleRegistry } from '../../../../shared/constants/moduleRegistry';
import { AdminNav } from '../components/AdminNav';
import { EssenceMiniLoader } from '../../../../shared/components/EssenceMiniLoader';

type TenantEntity = {
  id: string;
  slug: string;
  subdomain?: string;
  name: string;
  status: string;
  planId: string;
  planName?: string;
  activeModules?: string[];
  email?: string | null;
  createdAt?: string;
  validUntil?: string | null;
  config: {
    bufferTimeMinutes: number;
    requirePaymentForNoShows: boolean;
    maxNoShowsBeforePayment: number;
  };
};

type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId?: string | null;
};

export function AdminTenantsPage() {
  const [tenants, setTenants] = useState<TenantEntity[]>([]);
  const [owners, setOwners] = useState<UserRecord[]>([]);
  const [admins, setAdmins] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionTenantId, setActionTenantId] = useState<string | null>(null);
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});

  useEffect(() => {
    async function fetchTenants() {
      try {
        const [tenantsData, ownersData, adminsData] = await Promise.all([
          apiRequest<TenantEntity[]>('/tenants'),
          apiRequest<UserRecord[]>('/users?role=OWNER'),
          apiRequest<UserRecord[]>('/users?role=ADMIN')
        ]);
        setTenants(tenantsData);
        setOwners(ownersData);
        setAdmins(adminsData);
      } catch (err: any) {
        setError(err.message || 'Error al cargar los tenants');
      } finally {
        setLoading(false);
      }
    }

    fetchTenants();
  }, []);

  const moduleLabelByKey = useMemo(() => {
    return Object.values(moduleRegistry).reduce<Record<string, string>>((acc, item) => {
      acc[item.key] = item.label;
      return acc;
    }, {});
  }, []);

  const ownerByTenant = useMemo(() => {
    const map = new Map<string, UserRecord>();
    owners.forEach((owner) => {
      if (owner.tenantId) map.set(owner.tenantId, owner);
    });
    admins.forEach((admin) => {
      if (!admin.tenantId) return;
      if (!map.has(admin.tenantId)) map.set(admin.tenantId, admin);
    });
    return map;
  }, [owners, admins]);

  const formatDate = (value?: string | null) => {
    if (!value) return '-';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '-';
    return parsed.toLocaleDateString();
  };

  const suspendTenant = async (tenantId: string) => {
    setActionTenantId(tenantId);
    try {
      await apiRequest(`/tenants/${tenantId}/suspend`, { method: 'POST' });
      const row = rowRefs.current[tenantId];
      if (row) {
        await new Promise<void>((resolve) => {
          gsap
            .timeline({ onComplete: resolve })
            .to(row, {
              keyframes: [{ x: -6 }, { x: 6 }, { x: -4 }, { x: 4 }, { x: 0 }],
              duration: 0.4,
              ease: 'power1.inOut'
            })
            .to(row, {
              x: -24,
              opacity: 0,
              duration: 0.25,
              ease: 'power1.in'
            });
        });
      }
      setTenants((prev) => prev.filter((tenant) => tenant.id !== tenantId));
    } catch (err: any) {
      setError(err.message || 'No se pudo suspender el tenant');
    } finally {
      setActionTenantId(null);
    }
  };

  return (
    <section className="space-y-6">
      <header className="app-card">
        <h2 className="section-title">Gestion de Tenants</h2>
        <p className="section-subtitle">Vista global para gobierno y data mining.</p>
      </header>

      <AdminNav />

      {error ? (
        <p className="rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-200">{error}</p>
      ) : null}

      <div className="app-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Tenants en plataforma</h3>
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
                  <th className="py-3 pr-4 font-medium">Negocio / Dueño</th>
                  <th className="py-3 px-4 font-medium">Correo de contacto</th>
                  <th className="py-3 px-4 font-medium">Modulos activos</th>
                  <th className="py-3 px-4 font-medium">Inicio contrato</th>
                  <th className="py-3 px-4 font-medium">Terminacion</th>
                  <th className="py-3 pl-4 font-medium text-right">Accion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tenants.map((tenant) => {
                  const owner = ownerByTenant.get(tenant.id);
                  const moduleLabels = (tenant.activeModules || [])
                    .map((key) => moduleLabelByKey[key] || key)
                    .join(' + ');
                  const isSuspended = tenant.status === 'suspended';
                  const isLoading = actionTenantId === tenant.id;
                  return (
                    <tr
                      key={tenant.id}
                      ref={(element) => {
                        rowRefs.current[tenant.id] = element;
                      }}
                      className="transition-colors hover:bg-white/5"
                    >
                      <td className="py-3 pr-4">
                        <p className="font-medium text-white">{tenant.name}</p>
                        <p className="text-xs text-zinc-400">{owner?.name || 'Sin dueno asignado'}</p>
                      </td>
                      <td className="py-3 px-4 text-zinc-300">
                        {owner?.email || tenant.email || 'Sin correo'}
                      </td>
                      <td className="py-3 px-4 text-zinc-300">
                        {moduleLabels || 'Sin modulos'}
                      </td>
                      <td className="py-3 px-4 text-zinc-300">{formatDate(tenant.createdAt)}</td>
                      <td className="py-3 px-4 text-zinc-300">{formatDate(tenant.validUntil)}</td>
                      <td className="py-3 pl-4 text-right">
                        <button
                          className={`btn-ghost text-xs relative ${isLoading ? 'pointer-events-none' : ''}`}
                          type="button"
                          onClick={() => suspendTenant(tenant.id)}
                          disabled={isSuspended || isLoading}
                          style={isLoading ? { filter: 'drop-shadow(0 0 10px rgba(0,240,255,0.35))' } : undefined}
                        >
                          <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
                            {isSuspended ? 'Suspendido' : 'Suspender Acceso'}
                          </span>
                          {isLoading ? (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <EssenceMiniLoader />
                            </span>
                          ) : null}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
