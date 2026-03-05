import { PlanGuard } from '../../../shared/components/PlanGuard';
import { useTenant } from '../../../shared/context/TenantContext';
import { useLabels } from '../../../shared/hooks/useLabels';

export function AdminHomePage() {
  const { tenant } = useTenant();
  const labels = useLabels();
  const activeModules = tenant?.activeModules || [];
  const isBarbershop = (tenant?.verticalSlug || '').toLowerCase() === 'barberias';

  const showAgenda = activeModules.includes('agenda');
  const showStaff = activeModules.includes('staff');
  const showPos = activeModules.includes('pos');

  return (
    <section className="space-y-6">
      <header className="app-card">
        <h2 className="section-title">Control operativo</h2>
        <p className="section-subtitle">Agenda viva, equipo y comunicaciones en un solo lugar.</p>
      </header>

      {isBarbershop ? (
        <div className="grid gap-4 md:grid-cols-3">
          {showAgenda ? (
            <div className="app-card">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Citas de hoy</p>
              <p className="mt-4 text-3xl font-semibold">18</p>
              <p className="mt-2 text-sm text-muted">Agenda en vivo.</p>
            </div>
          ) : null}
          {showStaff ? (
            <div className="app-card">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">{labels.staffPlural} activos</p>
              <p className="mt-4 text-3xl font-semibold">6</p>
              <p className="mt-2 text-sm text-muted">Turnos confirmados.</p>
            </div>
          ) : null}
          {showPos ? (
            <div className="app-card">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Ventas POS</p>
              <p className="mt-4 text-3xl font-semibold">$1.2k</p>
              <p className="mt-2 text-sm text-muted">Resumen del dia.</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {!isBarbershop ? (
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
      ) : null}

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
