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

const benefits = [
  {
    title: 'Agenda online 24/7',
    description: 'Evita choques y llena espacios con recordatorios automatizados.'
  },
  {
    title: 'Comisiones claras',
    description: 'Liquida al staff en segundos y motiva con metas por servicio.'
  },
  {
    title: 'Inventario en tiempo real',
    description: 'Controla productos, alertas y compras sin perder ventas.'
  },
  {
    title: 'POS y caja rapida',
    description: 'Cobros, tickets y cierres diarios integrados al flujo.'
  }
];

const highlights = [
  'Reservas, staff y ventas en una sola vista.',
  'WhatsApp y PWA listos para operar desde el celular.',
  'Marca blanca con tu dominio y tus colores.'
];

export function BarbershopLandingPage() {
  useEffect(() => {
    setSeo(
      'Software para Barberias | Essence Factory',
      'Gestiona agenda, staff, inventario y caja desde un solo panel. La plataforma definitiva para barberias modernas.'
    );
  }, []);

  return (
    <section className="space-y-10">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="app-card relative overflow-hidden">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-amber-400/20 blur-2xl" />
          <div className="absolute -bottom-10 right-10 h-24 w-24 rounded-full bg-amber-200/20 blur-xl" />
          <p className="app-chip">Vertical barberias</p>
          <h2 className="mt-4 text-4xl font-semibold">
            El software definitivo para llevar tu barberia al siguiente nivel.
          </h2>
          <p className="mt-4 text-sm text-muted">
            Conquista mas reservas, controla tu operacion y fideliza clientes con una plataforma hecha para barberias.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="btn-primary" to="/onboarding?vertical=barberias">
              Crear mi Barberia
            </Link>
            <Link className="btn-secondary" to="/barberias-login">
              Acceso duenos y staff
            </Link>
          </div>
          <div className="mt-8 grid gap-3 text-sm text-muted">
            {highlights.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-400/20 text-amber-200">•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="app-card">
              <h3 className="text-lg font-semibold">{benefit.title}</h3>
              <p className="mt-2 text-sm text-muted">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="app-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold">Todo lo que un dueno necesita</h3>
            <p className="mt-2 text-sm text-muted">
              Agenda, staff, inventario, POS y comisiones configurados para barberias.
            </p>
          </div>
          <Link className="btn-secondary" to="/onboarding?vertical=barberias">
            Probar gratis
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            'Agenda inteligente con recordatorios',
            'Staff y comisiones automaticas',
            'Inventario con alertas de stock',
            'POS rapido para productos y servicios',
            'Reportes diarios listos para el cierre',
            'Marca blanca y subdominio propio'
          ].map((feature) => (
            <div key={feature} className="app-card-soft">
              <p className="text-sm text-muted">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
