import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="app-card">
        <p className="app-chip">White-label core</p>
        <h2 className="mt-4 text-4xl font-semibold">La fabrica SaaS que se adapta a cada negocio.</h2>
        <p className="mt-4 text-sm text-muted">
          Inyecta marca, rutas y permisos en tiempo real. Opera multiples negocios con una sola plataforma.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="btn-primary" to="/onboarding">
            Crear mi negocio
          </Link>
          <Link className="btn-secondary" to="/login">
            Entrar al panel
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <div className="app-card">
          <h3 className="text-lg font-semibold">Micro-Frontends Logicos</h3>
          <p className="mt-2 text-sm text-muted">
            Booking, Admin, Staff y Control Global separados para escalar sin fricciones.
          </p>
        </div>
        <div className="app-card">
          <h3 className="text-lg font-semibold">Control por Plan</h3>
          <p className="mt-2 text-sm text-muted">
            Activa features segun plan, con estados de upgrade claros y medibles.
          </p>
        </div>
        <div className="app-card">
          <h3 className="text-lg font-semibold">Sincronizacion viva</h3>
          <p className="mt-2 text-sm text-muted">
            Agenda con refresco automatico y experiencias instantaneas con skeletons.
          </p>
        </div>
      </div>
    </section>
  );
}
