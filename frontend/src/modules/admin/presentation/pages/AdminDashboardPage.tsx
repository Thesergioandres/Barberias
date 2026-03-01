import { useEffect, useState } from 'react';
import { apiRequest } from '../../../../shared/infrastructure/http/apiClient';
import { AdminNav } from '../components/AdminNav';

type Summary = {
  totals: { users: number; services: number; appointments: number };
  appointmentsByStatus: Record<string, number>;
  analytics?: {
    productivity: string;
    occupancy: string;
    retention: string;
  };
};

export function AdminDashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await apiRequest<Summary>('/reports/summary');
        setSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo cargar el resumen');
      }
    }

    loadSummary();
  }, []);

  return (
    <section className="space-y-6">
      <header className="app-card">
        <h2 className="section-title">Panel administrativo</h2>
        <p className="section-subtitle">Resumen general de la operacion.</p>
      </header>

      <AdminNav />

      {error ? <p className="app-card-soft text-red-200">{error}</p> : null}

      {summary ? (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs text-zinc-400">Usuarios</p>
            <p className="text-2xl font-semibold">{summary.totals.users}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs text-zinc-400">Servicios</p>
            <p className="text-2xl font-semibold">{summary.totals.services}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs text-zinc-400">Citas</p>
            <p className="text-2xl font-semibold">{summary.totals.appointments}</p>
          </div>
        </div>
      ) : null}

      {summary ? (
        <div className="app-card">
          <h3 className="text-sm font-semibold">Citas por estado</h3>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {Object.entries(summary.appointmentsByStatus).map(([status, value]) => (
              <li key={status} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm">
                <span>{status}</span>
                <span className="font-semibold">{value}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {summary && summary.analytics ? (
        <div className="app-card">
          <h3 className="text-sm font-semibold mb-3">Analíticas Avanzadas</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-blue-900/30 bg-blue-950/20 p-5">
              <p className="text-xs text-blue-300">Productividad</p>
              <p className="text-xl font-semibold text-white mt-1">{summary.analytics.productivity}</p>
            </div>
            <div className="rounded-2xl border border-indigo-900/30 bg-indigo-950/20 p-5">
              <p className="text-xs text-indigo-300">Ocupación (Estimada)</p>
              <p className="text-xl font-semibold text-white mt-1">{summary.analytics.occupancy}</p>
            </div>
            <div className="rounded-2xl border border-purple-900/30 bg-purple-950/20 p-5">
              <p className="text-xs text-purple-300">Retención de Clientes</p>
              <p className="text-xl font-semibold text-white mt-1">{summary.analytics.retention}</p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
