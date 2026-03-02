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

const cityUsage = [
  { city: 'Bogota', tenants: 38, activity: 120 },
  { city: 'Medellin', tenants: 24, activity: 92 },
  { city: 'Cali', tenants: 18, activity: 66 },
  { city: 'Barranquilla', tenants: 12, activity: 44 },
  { city: 'Cartagena', tenants: 9, activity: 31 }
];

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

      <PlanGuard requiredPlan="GOD">
        <div className="app-card">
          <h3 className="text-lg font-semibold">Reportes IA</h3>
          <p className="mt-2 text-sm text-muted">Predicciones de churn y growth por tenant.</p>
        </div>
      </PlanGuard>
    </section>
  );
}
