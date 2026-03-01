import { PlanGuard } from '../../../shared/components/PlanGuard';

export function AdminHomePage() {
  return (
    <section className="space-y-6">
      <header className="app-card">
        <h2 className="section-title">Control operativo</h2>
        <p className="section-subtitle">Agenda viva, equipo y comunicaciones en un solo lugar.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="app-card">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Citas hoy</p>
          <p className="mt-4 text-3xl font-semibold">34</p>
          <p className="mt-2 text-sm text-muted">+12% vs ayer</p>
        </div>
        <div className="app-card">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">No shows</p>
          <p className="mt-4 text-3xl font-semibold">3</p>
          <p className="mt-2 text-sm text-muted">Automatiza cobros.</p>
        </div>
        <div className="app-card">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Satisfaccion</p>
          <p className="mt-4 text-3xl font-semibold">4.8</p>
          <p className="mt-2 text-sm text-muted">Feedback consolidado.</p>
        </div>
      </div>

      <PlanGuard requiredPlan="PRO">
        <div className="app-card">
          <h3 className="text-lg font-semibold">Optimización inteligente</h3>
          <p className="mt-2 text-sm text-muted">
            Sugerencias automaticas de slots para maximizar revenue.
          </p>
        </div>
      </PlanGuard>
    </section>
  );
}
