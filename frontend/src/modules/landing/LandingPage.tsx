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

export function LandingPage() {
  useEffect(() => {
    setSeo(
      'Essence Factory | Plataforma SaaS White-Label',
      'Construimos el motor de tu negocio. Infraestructura SaaS white-label para verticales con marca propia, control total y expansion rapida.'
    );
  }, []);

  return (
    <section className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="app-card">
          <p className="app-chip">The factory hub</p>
          <h2 className="mt-4 text-4xl font-semibold">Construimos el motor de tu negocio.</h2>
          <p className="mt-4 text-sm text-muted">
            ESSENCE FACTORY SAAS para operar verticales con marca propia, control total y expansion rapida.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="btn-primary" to="/barberias-landing">
              Explorar barberias
            </Link>
            <Link className="btn-secondary" to="#quienes-somos">
              Quienes somos
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <div className="app-card" id="quienes-somos">
            <h3 className="text-lg font-semibold">Quienes somos</h3>
            <p className="mt-2 text-sm text-muted">
              Essence Factory construye infraestructura SaaS para marcas que quieren dominar su mercado con tecnologia propia.
            </p>
          </div>
          <div className="app-card">
            <h3 className="text-lg font-semibold">Arquitectura white-label</h3>
            <p className="mt-2 text-sm text-muted">
              Rutas, permisos y branding por tenant con micro-frontends logicos para escalar sin fricciones.
            </p>
          </div>
          <div className="app-card">
            <h3 className="text-lg font-semibold">Operacion en tiempo real</h3>
            <p className="mt-2 text-sm text-muted">
              Reportes, automatizaciones y sincronizacion viva para equipos que no pueden parar.
            </p>
          </div>
        </div>
      </div>

      <div className="app-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold">Servicios por industria</h3>
            <p className="mt-2 text-sm text-muted">
              Flujos y configuraciones listas para cada vertical.
            </p>
          </div>
          <Link className="btn-secondary" to="/barberias-landing">Ver detalle barberias</Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link to="/barberias-landing" className="app-card-soft border border-transparent transition hover:border-outline">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Activo</p>
            <h4 className="mt-2 text-lg font-semibold">Barberias & Estetica</h4>
            <p className="mt-2 text-sm text-muted">Agenda, POS, comisiones y PWA listos para vender.</p>
          </Link>
          <div className="app-card-soft opacity-60">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Proximamente</p>
            <h4 className="mt-2 text-lg font-semibold">Restaurantes</h4>
            <p className="mt-2 text-sm text-muted">Comandas, reservas y delivery en una sola operacion.</p>
          </div>
          <div className="app-card-soft opacity-60">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Proximamente</p>
            <h4 className="mt-2 text-lg font-semibold">Gimnasios</h4>
            <p className="mt-2 text-sm text-muted">Membresias, clases y staff conectados en tiempo real.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
