import { PlanGuard } from '../../shared/components/PlanGuard';

export function GodPanelPage() {
  return (
    <section className="space-y-6">
      <header className="app-card">
        <h2 className="section-title">God Panel</h2>
        <p className="section-subtitle">Vista global de la fabrica SaaS.</p>
      </header>

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

      <PlanGuard requiredPlan="GOD">
        <div className="app-card">
          <h3 className="text-lg font-semibold">Reportes IA</h3>
          <p className="mt-2 text-sm text-muted">Predicciones de churn y growth por tenant.</p>
        </div>
      </PlanGuard>
    </section>
  );
}
