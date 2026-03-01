import { useEffect, useState } from 'react';
import { apiRequest } from '../../../../shared/infrastructure/http/apiClient';
import { AdminNav } from '../components/AdminNav';

type Summary = {
  totals: { users: number; services: number; appointments: number };
  appointmentsByStatus: Record<string, number>;
};

export function AdminReportsPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await apiRequest<Summary>('/reports/summary');
        setSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo cargar reportes');
      }
    }

    loadSummary();
  }, []);

  return (
    <section className="space-y-6">
      <header className="app-card">
        <h2 className="section-title">Reportes</h2>
        <p className="section-subtitle">Resumen operativo y estado de citas.</p>
      </header>

      <AdminNav />

      {error ? <p className="app-card-soft text-red-200">{error}</p> : null}

      {summary ? (
        <div className="app-card">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs text-zinc-400">Usuarios</p>
              <p className="text-xl font-semibold">{summary.totals.users}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-400">Servicios</p>
              <p className="text-xl font-semibold">{summary.totals.services}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-400">Citas</p>
              <p className="text-xl font-semibold">{summary.totals.appointments}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {Object.entries(summary.appointmentsByStatus).map(([status, value]) => (
              <div key={status} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm">
                <span>{status}</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
