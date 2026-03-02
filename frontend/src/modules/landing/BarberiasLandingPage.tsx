import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function setSeo(title: string, description: string) {
  document.title = title;
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'description');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', description);
}

const plans = [
  {
    name: 'Bronce',
    price: '$29',
    detail: 'Para equipos pequenos que arrancan con orden.',
    items: ['Agenda y clientes', 'Control de servicios', 'Soporte esencial']
  },
  {
    name: 'Plata',
    price: '$59',
    detail: 'La operacion completa con comisiones y reportes.',
    items: ['POS y facturacion', 'Comisiones por barbero', 'Reportes diarios']
  },
  {
    name: 'Oro',
    price: '$99',
    detail: 'Escala con multiples sedes y automatizacion.',
    items: ['Multi-sede', 'WhatsApp automatizado', 'PWA y mobile staff']
  }
];

export function BarberiasLandingPage() {
  useEffect(() => {
    setSeo(
      'Software para Barberias | Essence Factory',
      'Software para barberias con agenda, POS, comisiones y PWA. Lanza tu negocio con un ERP completo para barberias y estetica.'
    );
  }, []);

  return (
    <section className="space-y-10">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="app-card">
          <p className="app-chip">Vertical barberias</p>
          <h2 className="mt-4 text-4xl font-semibold">La gestion total de tu barberia en un solo lugar.</h2>
          <p className="mt-4 text-sm text-muted">
            Agenda, POS, comisiones y reportes listos para que tu equipo solo se enfoque en vender.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="btn-primary" to="/onboarding">
              Comenzar ahora
            </Link>
            <Link className="btn-secondary" to="/barberias-login">
              Acceso duenos y staff
            </Link>
            <Link className="btn-ghost" to="/barberias-client-login">
              Acceso clientes
            </Link>
          </div>
        </div>
        <div className="space-y-4">
          <div className="app-card">
            <h3 className="text-lg font-semibold">Agendamiento inteligente</h3>
            <p className="mt-2 text-sm text-muted">Evita choques y aumenta ocupacion con buffers automaticos.</p>
          </div>
          <div className="app-card">
            <h3 className="text-lg font-semibold">POS y ventas rapidas</h3>
            <p className="mt-2 text-sm text-muted">Cobra productos, servicios y controla inventario desde un solo panel.</p>
          </div>
          <div className="app-card">
            <h3 className="text-lg font-semibold">Comisiones y PWA</h3>
            <p className="mt-2 text-sm text-muted">Gestiona comisiones por barbero y opera desde mobile sin friccion.</p>
          </div>
        </div>
      </div>

      <div className="app-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold">Planes de pago</h3>
            <p className="mt-2 text-sm text-muted">Elige el nivel adecuado y escala cuando lo necesites.</p>
          </div>
          <span className="text-xs text-muted">Precios mensuales</span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className="app-card-soft flex flex-col gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">{plan.name}</p>
                <p className="mt-2 text-3xl font-semibold">{plan.price}</p>
                <p className="mt-2 text-sm text-muted">{plan.detail}</p>
              </div>
              <ul className="space-y-2 text-sm text-muted">
                {plan.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
              <Link className="btn-secondary mt-auto" to="/onboarding">
                Elegir {plan.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
