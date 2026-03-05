import { PlanGuard } from '../../../shared/components/PlanGuard';
import { useTenant } from '../../../shared/context/TenantContext';
import { useLabels } from '../../../shared/hooks/useLabels';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../../shared/infrastructure/http/apiClient';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

type SummaryResponse = {
  totalSales: number;
  appointmentsToday: number;
  totalProducts: number;
  activeStaff: number;
  salesTrend: number[];
};

export function AdminHomePage() {
  const { tenant } = useTenant();
  const labels = useLabels();
  const activeModules = tenant?.activeModules || [];
  const isBarbershop = (tenant?.verticalSlug || '').toLowerCase() === 'barberias';

  const showAgenda = activeModules.includes('agenda');
  const showStaff = activeModules.includes('staff');
  const showPos = activeModules.includes('pos');
  const showStorefront = activeModules.includes('ecommerce_storefront');
  const showInventory = activeModules.includes('inventory');

  const summaryQuery = useQuery({
    queryKey: ['reports', 'summary', tenant?.id],
    queryFn: async () => {
      try {
        return await apiRequest<SummaryResponse>('/reports/summary');
      } catch {
        return {
          totalSales: 0,
          appointmentsToday: 0,
          totalProducts: 0,
          activeStaff: 0,
          salesTrend: []
        } as SummaryResponse;
      }
    },
    enabled: Boolean(tenant?.id)
  });

  const summary = summaryQuery.data || {
    totalSales: 0,
    appointmentsToday: 0,
    totalProducts: 0,
    activeStaff: 0,
    salesTrend: []
  };

  const salesChartData = summary.salesTrend.length
    ? summary.salesTrend.map((value, index) => ({ day: `D${index + 1}`, sales: value }))
    : [];

  return (
    <section className="space-y-6">
      <header className="app-card">
        <h2 className="section-title">Control operativo</h2>
        <p className="section-subtitle">Agenda viva, equipo y comunicaciones en un solo lugar.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        {showPos || showStorefront ? (
          <div className="app-card">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Ventas totales</p>
            <p className="mt-4 text-3xl font-semibold">$ {summary.totalSales}</p>
            <p className="mt-2 text-sm text-muted">Consolidado del mes.</p>
          </div>
        ) : null}
        {showAgenda ? (
          <div className="app-card">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Citas de hoy</p>
            <p className="mt-4 text-3xl font-semibold">{summary.appointmentsToday}</p>
            <p className="mt-2 text-sm text-muted">Agenda activa.</p>
          </div>
        ) : null}
        {showInventory ? (
          <div className="app-card">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Total de productos</p>
            <p className="mt-4 text-3xl font-semibold">{summary.totalProducts}</p>
            <p className="mt-2 text-sm text-muted">Catalogo disponible.</p>
          </div>
        ) : null}
        {showStaff ? (
          <div className="app-card">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">{labels.staffPlural} activos</p>
            <p className="mt-4 text-3xl font-semibold">{summary.activeStaff}</p>
            <p className="mt-2 text-sm text-muted">Equipo operativo.</p>
          </div>
        ) : null}
      </div>

      {showPos || showStorefront ? (
        <div className="app-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">Tendencia de ventas</h3>
              <p className="text-sm text-muted">Ultimos 7 dias</p>
            </div>
          </div>
          {salesChartData.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Sin datos de ventas recientes.</p>
          ) : (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="var(--muted)" fontSize={12} />
                  <YAxis stroke="var(--muted)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 17, 24, 0.92)',
                      border: '1px solid rgba(248,250,252,0.12)',
                      borderRadius: '12px'
                    }}
                  />
                  <Line type="monotone" dataKey="sales" stroke="var(--primary)" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
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
