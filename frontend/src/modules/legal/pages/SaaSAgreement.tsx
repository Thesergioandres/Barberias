import { EssenceMicroSymbol } from '../../../shared/components/EssenceMicroSymbol';
import { Link } from 'react-router-dom';

export function SaaSAgreement() {
  return (
    <section className="space-y-8">
      <header className="app-card">
        <p className="app-chip">Acuerdo de servicio</p>
        <h1 className="mt-4 text-3xl font-semibold">Acuerdo SaaS y Nivel de Servicio (SLA)</h1>
        <p className="mt-2 text-sm text-muted">Ultima actualizacion: 05/03/2026.</p>
      </header>

      <article className="app-card space-y-6 text-sm text-muted">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">1. Disponibilidad</h2>
          <p>
            La plataforma apunta a una disponibilidad mensual del 99.5%, salvo mantenimientos programados o eventos de
            fuerza mayor. Los mantenimientos se notifican con antelacion razonable.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">2. Soporte</h2>
          <p>
            El soporte se ofrece por canales digitales. Los tiempos de respuesta dependen del plan contratado y se
            informan en la propuesta comercial.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">3. Reembolsos</h2>
          <p>
            Los reembolsos aplican solo si el servicio presenta interrupciones graves verificadas y fuera de los
            parametros de este SLA. No aplica para usos indebidos o incumplimiento del cliente.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">4. Seguridad</h2>
          <p>
            ESSENCE SOFTWARE FACTORY implementa cifrado en transito (TLS), cifrado de contrasenas (bcrypt), backups en
            Google Cloud y monitoreo continuo.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">5. Propiedad intelectual</h2>
          <p>
            Este acuerdo no transfiere propiedad intelectual. El cliente conserva los derechos sobre sus datos y marca.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">6. Documentos relacionados</h2>
          <div className="flex flex-wrap gap-3">
            <Link className="btn-secondary" to="/legal/terms">Terminos y Condiciones</Link>
            <Link className="btn-secondary" to="/legal/privacy">Politica de Privacidad</Link>
          </div>
        </section>
      </article>

      <footer className="app-card-soft flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">SLA y continuidad</p>
          <p className="text-xs text-muted">Servicio resiliente y acuerdos claros.</p>
        </div>
        <EssenceMicroSymbol size={28} />
      </footer>
    </section>
  );
}
