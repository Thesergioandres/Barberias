import { EssenceMicroSymbol } from '../../../shared/components/EssenceMicroSymbol';
import { Link } from 'react-router-dom';

export function TermsAndConditions() {
  return (
    <section className="space-y-8">
      <header className="app-card">
        <p className="app-chip">Documento legal</p>
        <h1 className="mt-4 text-3xl font-semibold">Terminos y Condiciones del Servicio</h1>
        <p className="mt-2 text-sm text-muted">
          Ultima actualizacion: 05/03/2026. Este documento regula el uso de la plataforma ESSENCE SOFTWARE FACTORY.
        </p>
      </header>

      <article className="app-card space-y-6 text-sm text-muted">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">1. Naturaleza del servicio SaaS</h2>
          <p>
            ESSENCE SOFTWARE FACTORY ofrece una plataforma SaaS bajo suscripcion. El acceso es temporal, no exclusivo y
            revocable conforme a estos terminos. La suscripcion habilita el uso de funcionalidades segun el plan activo.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">2. Propiedad intelectual</h2>
          <p>
            Todo el software, marcas, interfaces, codigo, modelos y contenidos son propiedad intelectual de ESSENCE
            SOFTWARE FACTORY o de sus licenciantes. El cliente recibe una licencia limitada, sin transferencia de
            propiedad, para operar su tenant dentro de la plataforma.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">3. Uso autorizado y restricciones</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Queda prohibido copiar, descompilar, modificar o distribuir el software sin autorizacion expresa.</li>
            <li>El uso no autorizado de credenciales o intentos de acceso indebido sera reportado y bloqueado.</li>
            <li>El cliente es responsable de las actividades realizadas desde sus usuarios y dispositivos.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">4. Responsabilidades del cliente</h2>
          <p>
            El cliente debe mantener informacion veraz, cumplir la normativa aplicable y garantizar que cuenta con las
            autorizaciones necesarias para tratar los datos de sus usuarios finales.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">5. Suspension y terminacion</h2>
          <p>
            ESSENCE SOFTWARE FACTORY puede suspender el acceso por incumplimiento contractual, pagos vencidos, uso
            fraudulento o riesgos de seguridad. El cliente puede terminar su suscripcion conforme al plan vigente.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">6. Jurisdiccion y ley aplicable</h2>
          <p>
            Este acuerdo se rige por las leyes de la Republica de Colombia. Cualquier controversia se resolvera en los
            tribunales competentes de Bogota D.C.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">7. Documentos complementarios</h2>
          <p>
            El uso de la plataforma tambien esta regulado por la Politica de Privacidad, la Politica de Tratamiento de
            Datos y el DPA. Puedes consultarlos en:
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className="btn-secondary" to="/legal/privacy">Politica de Privacidad</Link>
            <Link className="btn-secondary" to="/legal/ptd">Politica de Tratamiento de Datos</Link>
            <Link className="btn-secondary" to="/legal/dpa">Acuerdo de Procesamiento (DPA)</Link>
          </div>
        </section>
      </article>

      <footer className="app-card-soft flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">ESSENCE SOFTWARE FACTORY</p>
          <p className="text-xs text-muted">Soporte legal y cumplimiento para tu vertical.</p>
        </div>
        <EssenceMicroSymbol size={28} />
      </footer>
    </section>
  );
}
