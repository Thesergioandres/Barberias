import { EssenceMicroSymbol } from '../../../shared/components/EssenceMicroSymbol';
import { Link } from 'react-router-dom';

export function DataProcessingAgreement() {
  return (
    <section className="space-y-8">
      <header className="app-card">
        <p className="app-chip">DPA</p>
        <h1 className="mt-4 text-3xl font-semibold">Acuerdo de Procesamiento de Datos (DPA)</h1>
        <p className="mt-2 text-sm text-muted">Ultima actualizacion: 05/03/2026.</p>
      </header>

      <article className="app-card space-y-6 text-sm text-muted">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">1. Roles</h2>
          <p>
            El tenant (propietario del negocio) actua como Responsable del tratamiento. ESSENCE SOFTWARE FACTORY actua
            como Encargado, proporcionando la infraestructura y medidas de seguridad para procesar los datos.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">2. Instrucciones del Responsable</h2>
          <p>
            El Encargado tratara los datos unicamente conforme a las instrucciones documentadas del Responsable y los
            terminos del contrato SaaS.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">3. Subencargados</h2>
          <p>
            Podremos utilizar subencargados (proveedores cloud y mensajeria) bajo contratos de confidencialidad y
            seguridad equivalentes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">4. Seguridad y notificaciones</h2>
          <p>
            Se aplican controles tecnicos y organizacionales para garantizar integridad, disponibilidad y
            confidencialidad. En caso de incidentes, notificaremos conforme a la ley.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">5. Finalizacion del servicio</h2>
          <p>
            Al terminar la relacion contractual, el Responsable puede solicitar la eliminacion o exportacion de datos.
            Se aplican retenciones legales cuando corresponda.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">6. Documentos relacionados</h2>
          <div className="flex flex-wrap gap-3">
            <Link className="btn-secondary" to="/legal/ptd">Politica de Tratamiento</Link>
            <Link className="btn-secondary" to="/legal/privacy">Politica de Privacidad</Link>
          </div>
        </section>
      </article>

      <footer className="app-card-soft flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Encargado vs Responsable</p>
          <p className="text-xs text-muted">Marco contractual para datos personales.</p>
        </div>
        <EssenceMicroSymbol size={28} />
      </footer>
    </section>
  );
}
